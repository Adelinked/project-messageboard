const Thread = require('../models/Thread');
const Reply = require('../models/Reply');


const ThreadController = {

  getThreads: async (req, res) => {
    const { board } = req.params;
    try {
      const threads = await Thread.find({ board })
       .sort({ bumped_on: -1 })
       .limit(10)
     .populate({
       path: 'replies',
       options: { sort: { created_on: -1 }, limit: 3, select: '-reported -delete_password' },
     })
     .select('-reported -delete_password');
      res.status(200).json(threads.map(t => ({_id:t._id,text:t.text,created_on:t.created_on,bumped_on:t.bumped_on,replies:t.replies,replycount:t.replies.length})));
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  createThread: async (req, res) => {
    const { board } = req.params;
    const { text, delete_password } = req.body;
    try {
      const newThread = await Thread.create({
        board,
        text,
        delete_password
      });
      const redirectUrl = `/b/${board}/`;
      res.redirect(redirectUrl);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getThreadWithReplies: async (req, res) => {
    const { board } = req.params;
    const { thread_id } = req.query;

    try {
      const thread = await Thread.findById(thread_id)
        .populate({
          path: 'replies',
          select: '-reported -delete_password',
        })
        .select('-reported -delete_password');

      if (!thread) {
        return res.status(404).json({ error: 'Thread not found' });
      }

      res.json(thread);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },


  reportThread: async (req, res) => {
   const { board } = req.params;
        const { report_id:thread_id } = req.body;    
        try {
            const date = new Date();
            const thread = await Thread.findByIdAndUpdate(
                thread_id,
                { reported: true}
            );
            /*if (!thread) {
                return res.status(404).json({ error: 'Thread not found' });
            }*/
            res.status(200).send('reported');
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
  },

  deleteThread: async (req, res) => {
        const { board } = req.params;
        const { thread_id, delete_password } = req.body;
        try {
            const thread = await Thread.findById(thread_id);

            if (!thread) {
                return res.status(404).json({ error: 'Thread not found' });
            }

            if (thread.delete_password !== delete_password) {
                return res.status(200).send('incorrect password');
            }

            await thread.deleteOne();

            await Reply.deleteMany({ threadId: thread._id });

            res.status(200).send('success');
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
};




module.exports = ThreadController;
