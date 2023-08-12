const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  threadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread' },
  text: String,
  created_on: { type: Date, default: Date.now },
  delete_password: String,
  reported: { type: Boolean, default: false },
});

module.exports = mongoose.model('Reply', replySchema);
