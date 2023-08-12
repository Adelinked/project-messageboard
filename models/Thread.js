const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema({
    board: String,
    text: String,
    created_on: { type: Date, default: Date.now },
    bumped_on: { type: Date, default: Date.now },
    reported: { type: Boolean, default: false },
    delete_password: String,
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }],
});

module.exports = mongoose.model('Thread', threadSchema);
