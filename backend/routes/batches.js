const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Batch = require('../models/Batch');

// @route   GET api/batches
// @desc    Get all batches
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const batches = await Batch.find();
        res.json(batches);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/batches/:id
// @desc    Get a single batch by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const batch = await Batch.findById(req.params.id);
        if (!batch) {
            return res.status(404).json({ msg: 'Batch not found' });
        }
        res.json(batch);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/batches
// @desc    Create a new batch and assign users
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { name, userIds } = req.body;
        if (!name) return res.status(400).json({ msg: 'Batch name is required' });
        // Create the batch
        const batch = new Batch({ name });
        await batch.save();
        // Assign users to this batch
        if (Array.isArray(userIds) && userIds.length > 0) {
            const User = require('../models/User');
            await User.updateMany(
                { _id: { $in: userIds } },
                { $set: { batchId: batch._id } }
            );
        }
        // Return the new batch
        res.status(201).json(batch);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router; 