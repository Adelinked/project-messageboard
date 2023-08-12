const Reply = require('../models/Reply');
const Thread = require('../models/Thread');

const ReplyController = {
 

  createReply: async (req, res) => {
    const { board } = req.params;
    const { text, delete_password, thread_id } = req.body;
    try {
      const thread = await Thread.findById(thread_id);
      if (!thread) {
        return res.status(404).json({ error: 'Thread not found' });
      }
      const date = new Date();
      const newReply = await Reply.create({
        threadId: thread._id,
        text,
        delete_password,
        created_on: date
      });
      thread.bumped_on = date;
      thread.replies.push(newReply);
      await thread.save();

      const redirectUrl = `/b/${board}/${thread_id}/`;
      res.redirect(redirectUrl);

    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  reportReply: async (req, res) => {
   const { board } = req.params;
        const { thread_id, reply_id } = req.body;
        try {
            const thread = await Thread.findById(thread_id).populate('replies');
            
            if (!thread) {
                return res.status(404).json({ error: 'Thread not found' });
            }
            const reply = thread.replies.find(reply => reply._id.toString() === reply_id);
            if (!reply) {
                return res.status(404).json({ error: 'Reply not found' });
            }
            reply.reported = true;
            thread.bumped_on = new Date();
            await reply.save();
            await thread.save();

            res.status(200).send('reported');
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
  },

  deleteReply: async (req, res) => {
    const { board } = req.params;
    const { thread_id, reply_id, delete_password } = req.body;
    try {
      const thread = await Thread.findById(thread_id).populate('replies');
      if (!thread) {
        return res.status(404).json({ error: 'Thread not found' });
      }
      const reply = thread.replies.find(reply => reply._id.toString() === reply_id);
      if (!reply) {
        return res.status(404).json({ error: 'Reply not found' });
      }
      if (reply.delete_password !== delete_password) {
        return res.status(200).send('incorrect password');
      }
      reply.text = '[deleted]';
      await reply.save();
      await thread.save();

      res.status(200).send('success');
    } catch (error) {
    
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};


module.exports = ReplyController;
