const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { auth, admin } = require('../middleware/auth');
const User = require('../models/User');
const Batch = require('../models/Batch');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');
const pdfParse = require('pdf-parse');

// Set up multer storage
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// @route   GET api/users
// @desc    Get all users (can filter by role)
// @access  Private (Admin)
router.get('/', [auth, admin], async (req, res) => {
    try {
        const query = req.query.role ? { role: req.query.role } : {};
        const users = await User.find(query).select('-password').populate('batchId', 'name');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/users
// @desc    Create a user
// @access  Private (Admin)
router.post('/', [auth, admin], async (req, res) => {
    const { email, password, name, phone, role, batchId } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            email,
            name,
            phone,
            password: hashedPassword,
            role,
            batchId: role === 'MENTOR' || role === 'INTERN' ? batchId : null,
        });

        await user.save();
        res.status(201).json({ msg: 'User created successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/users/:id
// @desc    Update a user
// @access  Private (Admin)
router.put('/:id', [auth, admin], async (req, res) => {
    const { name, email, phone, role, batchId, isActive } = req.body;

    const userFields = { name, email, phone, role, batchId, isActive };
    // Only assign batchId if the role requires it
    if (role !== 'MENTOR' && role !== 'INTERN') {
        userFields.batchId = null;
    }

    try {
        let user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ msg: 'User not found' });

        user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: userFields },
            { new: true }
        );

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/users/:id
// @desc    Delete a user
// @access  Private (Admin)
router.delete('/:id', [auth, admin], async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Prevent admin from deleting themselves
        if (user.id === req.user.id) {
            return res.status(400).json({ msg: 'You cannot delete your own account.' });
        }

        await user.deleteOne();
        res.json({ msg: 'User removed' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/users/upload-document
// @desc    Upload a document (interns)
// @access  Private (Intern)
router.post('/upload-document', auth, upload.single('document'), async (req, res) => {
  console.log('Upload endpoint hit');
  console.log('User:', req.user);
  console.log('File:', req.file);
  try {
    if (!req.user || req.user.role !== 'INTERN') {
      return res.status(403).json({ msg: 'Only interns can upload documents.' });
    }
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded.' });
    }

    let skills = [], projects = [], summaryText = '', suggestedRole = '';
    if (req.file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(req.file.path);
      const pdfData = await pdfParse(dataBuffer);
      const text = pdfData.text;
      summaryText = text.slice(0, 1000); // Save first 1000 chars for reference
      // Simple regex-based extraction (for demo)
      const skillsMatch = text.match(/Skills[\s:]*([\s\S]*?)(?:\n\n|Projects|Experience|Education|$)/i);
      if (skillsMatch) {
        skills = skillsMatch[1].split(/,|\n/).map(s => s.trim()).filter(Boolean);
      }
      const projectsMatch = text.match(/Projects[\s:]*([\s\S]*?)(?:\n\n|Skills|Experience|Education|$)/i);
      if (projectsMatch) {
        projects = projectsMatch[1].split(/\n/).map(p => p.trim()).filter(Boolean);
      }
      // Infer role based on skills
      const skillsText = skills.join(' ').toLowerCase();
      if (/react|angular|vue|frontend|javascript|html|css/.test(skillsText)) {
        suggestedRole = 'Frontend Engineer';
      } else if (/node|express|django|flask|backend|api|java|c#|spring/.test(skillsText)) {
        suggestedRole = 'Backend Engineer';
      } else if (/data|ml|machine learning|ai|pandas|numpy|scikit|tensorflow|pytorch/.test(skillsText)) {
        suggestedRole = 'Data Scientist';
      } else if (/devops|aws|azure|docker|kubernetes|cloud/.test(skillsText)) {
        suggestedRole = 'DevOps Engineer';
      } else if (/fullstack|full-stack/.test(skillsText)) {
        suggestedRole = 'Full Stack Engineer';
      } else if (/software/.test(skillsText)) {
        suggestedRole = 'Software Engineer';
      } else {
        suggestedRole = 'Engineer';
      }
      summaryText = `Suggested Role: ${suggestedRole}\n\n` + summaryText;
    }

    const doc = new Document({
      filename: req.file.filename,
      originalname: req.file.originalname,
      uploader: req.user.id,
      skills,
      projects,
      summaryText,
      suggestedRole,
    });
    await doc.save();
    res.status(201).json({ msg: 'Document uploaded and parsed successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error.' });
  }
});

// @route   GET api/users/documents
// @desc    List all uploaded documents (admin)
// @access  Private (Admin)
router.get('/documents', [auth, admin], async (req, res) => {
  try {
    const docs = await Document.find().populate('uploader', 'name email');
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error.' });
  }
});

// @route   DELETE api/users/documents/:id
// @desc    Delete a document (admin)
// @access  Private (Admin)
router.delete('/documents/:id', [auth, admin], async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ msg: 'Document not found' });
    // Remove file from uploads
    const filePath = path.join(uploadDir, doc.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    await doc.deleteOne();
    res.json({ msg: 'Document deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error.' });
  }
});

// @route   GET api/users/download/:filename
// @desc    Download a document file
// @access  Private (Admin)
router.get('/download/:filename', [auth, admin], (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ msg: 'File not found.' });
    }
});

module.exports = router; 