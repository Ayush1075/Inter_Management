const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
const Message = require('../models/Message');
const User = require('../models/User');

// @route   POST api/messages
// @desc    Create a new announcement/message
// @access  Private (Admin, HR, CEO, Mentor)
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, type, recipients, specificRecipient, pinned } = req.body;

    // Check if user has permission to create messages
    const allowedRoles = ['CEO', 'HR', 'MENTOR'];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'You do not have permission to create announcements' });
    }

    const messageData = {
      title,
      content,
      type: type || 'announcement',
      author: req.user.id,
      recipients: recipients || 'all',
      pinned: pinned || false
    };

    // If specific recipient is provided, validate it
    if (recipients === 'specific' && specificRecipient) {
      const recipient = await User.findById(specificRecipient);
      if (!recipient) {
        return res.status(400).json({ msg: 'Specific recipient not found' });
      }
      messageData.specificRecipient = specificRecipient;
    }

    const message = new Message(messageData);
    await message.save();

    // Populate author details
    await message.populate('author', 'name role');
    if (message.specificRecipient) {
      await message.populate('specificRecipient', 'name role');
    }

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET api/messages
// @desc    Get all messages/announcements for the current user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let query = {};

    // Filter based on user role and recipients
    if (req.user.role === 'INTERN') {
      query.$or = [
        { recipients: 'all' },
        { recipients: 'interns' },
        { specificRecipient: req.user.id }
      ];
    } else if (req.user.role === 'MENTOR') {
      query.$or = [
        { recipients: 'all' },
        { recipients: 'mentors' },
        { specificRecipient: req.user.id }
      ];
    } else if (req.user.role === 'HR') {
      query.$or = [
        { recipients: 'all' },
        { recipients: 'hr' },
        { specificRecipient: req.user.id }
      ];
    } else if (req.user.role === 'CEO') {
      query.$or = [
        { recipients: 'all' },
        { recipients: 'ceo' },
        { specificRecipient: req.user.id }
      ];
    }

    const messages = await Message.find(query)
      .populate('author', 'name role')
      .populate('specificRecipient', 'name role')
      .sort({ pinned: -1, createdAt: -1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET api/messages/admin
// @desc    Get all messages (admin only)
// @access  Private (Admin)
router.get('/admin', [auth, admin], async (req, res) => {
  try {
    const messages = await Message.find()
      .populate('author', 'name role')
      .populate('specificRecipient', 'name role')
      .sort({ pinned: -1, createdAt: -1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT api/messages/:id
// @desc    Update a message
// @access  Private (Author or Admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ msg: 'Message not found' });
    }

    // Check if user is author or admin
    if (message.author.toString() !== req.user.id && !['CEO', 'HR'].includes(req.user.role)) {
      return res.status(403).json({ msg: 'You do not have permission to edit this message' });
    }

    const { title, content, type, recipients, specificRecipient, pinned } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (type) updateData.type = type;
    if (recipients) updateData.recipients = recipients;
    if (specificRecipient) updateData.specificRecipient = specificRecipient;
    if (pinned !== undefined) updateData.pinned = pinned;

    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('author', 'name role')
     .populate('specificRecipient', 'name role');

    res.json(updatedMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   DELETE api/messages/:id
// @desc    Delete a message
// @access  Private (Author or Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ msg: 'Message not found' });
    }

    // Check if user is author or admin
    if (message.author.toString() !== req.user.id && !['CEO', 'HR'].includes(req.user.role)) {
      return res.status(403).json({ msg: 'You do not have permission to delete this message' });
    }

    await message.deleteOne();
    res.json({ msg: 'Message deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT api/messages/:id/toggle-pin
// @desc    Toggle pin status of a message
// @access  Private (Admin)
router.put('/:id/toggle-pin', [auth, admin], async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ msg: 'Message not found' });
    }

    message.pinned = !message.pinned;
    await message.save();

    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT api/messages/:id/mark-read
// @desc    Mark a message as read by current user
// @access  Private
router.put('/:id/mark-read', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ msg: 'Message not found' });
    }

    // Check if user has already read this message
    const alreadyRead = message.readBy.find(read => read.user.toString() === req.user.id);
    
    if (!alreadyRead) {
      message.readBy.push({
        user: req.user.id,
        readAt: new Date()
      });
      message.views += 1;
      await message.save();
    }

    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router; 