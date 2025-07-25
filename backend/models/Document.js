const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  originalname: {
    type: String,
    required: true,
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  skills: [{ type: String }],
  projects: [{ type: String }],
  summaryText: { type: String },
  suggestedRole: { type: String },
});

module.exports = mongoose.model('Document', DocumentSchema); 