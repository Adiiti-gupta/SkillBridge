import express from 'express';
import Progress from '../models/Progress.js';

const router = express.Router();

// Get leaderboard
router.get('/', async (req, res) => {
  try {
    const { sortBy = 'sessionsCompleted', limit = 50 } = req.query;

    const validSortFields = ['sessionsCompleted', 'hoursTaught', 'hoursLearned'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'sessionsCompleted';

    const leaderboard = await Progress.find()
      .populate('user', 'name avatarColor points')
      .sort({ [sortField]: -1 })
      .limit(parseInt(limit));
       
         const validLeaderboard = leaderboard.filter(entry => entry.user);

    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      rank: index + 1,
      user: entry.user,
      sessionsCompleted: entry.sessionsCompleted,
      hoursTaught: entry.hoursTaught,
      hoursLearned: entry.hoursLearned,
      badges: entry.badges
    }));

    res.json({ success: true, data: rankedLeaderboard });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;