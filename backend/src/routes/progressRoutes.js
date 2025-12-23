import express from 'express';
import Progress from '../models/Progress.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get my progress
router.get('/me', protect, async (req, res) => {
  try {
    let progress = await Progress.findOne({ user: req.user._id }).populate('user', 'name email avatarColor');
    
    if (!progress) {
      progress = await Progress.create({ user: req.user._id });
      progress = await Progress.findOne({ user: req.user._id }).populate('user', 'name email avatarColor');
    }

    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get progress for specific user
router.get('/:userId', protect, async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.params.userId }).populate('user', 'name avatarColor');
    
    if (!progress) {
      return res.status(404).json({ success: false, message: 'Progress not found' });
    }

    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;