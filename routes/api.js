'use strict';
const ThreadController = require('../controllers/threadController');
const ReplyController = require('../controllers/replyController');

module.exports = function(app) {

  app.route('/api/threads/:board')
    .get(ThreadController.getThreads)
    .post(ThreadController.createThread)
    .put(ThreadController.reportThread)
    .delete(ThreadController.deleteThread);

  app.route('/api/replies/:board')
    .get(ThreadController.getThreadWithReplies)
    .post(ReplyController.createReply)
    .put(ReplyController.reportReply)
    .delete(ReplyController.deleteReply);


};

