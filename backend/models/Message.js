const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['announcement', 'urgent', 'info', 'message'],
    default: 'announcement'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipients: {
    type: String,
    required: true,
    enum: ['all', 'interns', 'mentors', 'hr', 'ceo', 'specific'],
    default: 'all'
  },
  specificRecipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  pinned: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    readAt: {
      type: Date,
      default: Date.now,
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Update the updatedAt field before saving
MessageSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Message', MessageSchema); 