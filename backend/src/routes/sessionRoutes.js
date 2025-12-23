import express from 'express';
import Session from '../models/Session.js';
import Progress from '../models/Progress.js';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create session request
router.post('/', protect, async (req, res) => {
  try {
    const { teacherId, skill, scheduledAt, notes } = req.body;

    if (!teacherId || !skill || !scheduledAt) {
      return res.status(400).json({
        success: false,
        message: 'Teacher, skill, and scheduled time are required'
      });
    }

    const session = await Session.create({
      teacher: teacherId,
      learner: req.user._id,
      skill,
      scheduledAt,
      notes: notes || ''
    });

    const populatedSession = await Session.findById(session._id)
      .populate('teacher', 'name email avatarColor')
      .populate('learner', 'name email avatarColor');

    res.status(201).json({ success: true, data: populatedSession });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get my sessions
router.get('/', protect, async (req, res) => {
  try {
    const { status, type } = req.query;

    let query = {
      $or: [
        { teacher: req.user._id },
        { learner: req.user._id }
      ]
    };

    if (status) {
      query.status = status;
    }

    if (type === 'teaching') {
      query = { teacher: req.user._id };
      if (status) query.status = status;
    } else if (type === 'learning') {
      query = { learner: req.user._id };
      if (status) query.status = status;
    }

    const sessions = await Session.find(query)
      .populate('teacher', 'name email avatarColor')
      .populate('learner', 'name email avatarColor')
      .sort({ scheduledAt: -1 });

    res.json({ success: true, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update session status (accept/decline/cancel)
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    // Check authorization
    if (session.teacher.toString() !== req.user._id.toString() &&
        session.learner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    session.status = status;
    await session.save();

    const updatedSession = await Session.findById(session._id)
      .populate('teacher', 'name email avatarColor')
      .populate('learner', 'name email avatarColor');

    res.json({ success: true, data: updatedSession });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Complete session and update progress
router.put('/:id/complete', protect, async (req, res) => {
  try {
    const { completionNotes } = req.body;
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    // Check authorization (teacher or learner can mark complete)
    if (session.teacher.toString() !== req.user._id.toString() &&
        session.learner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    session.status = 'completed';
    session.completionNotes = completionNotes || '';
    await session.save();

    // Update progress for both users
    const teacherProgress = await Progress.findOne({ user: session.teacher });
    const learnerProgress = await Progress.findOne({ user: session.learner });

    if (teacherProgress) {
      teacherProgress.sessionsCompleted += 1;
      teacherProgress.hoursTaught += session.duration;
      
      // Award badges
      if (teacherProgress.sessionsCompleted === 1 && !teacherProgress.badges.some(b => b.name === 'First Session')) {
        teacherProgress.badges.push({ name: 'First Session' });
      }
      if (teacherProgress.sessionsCompleted === 5 && !teacherProgress.badges.some(b => b.name === '5 Sessions Taught')) {
        teacherProgress.badges.push({ name: '5 Sessions Taught' });
      }
      if (teacherProgress.hoursTaught >= 10 && !teacherProgress.badges.some(b => b.name === '10 Hours Teaching')) {
        teacherProgress.badges.push({ name: '10 Hours Teaching' });
      }
      
      await teacherProgress.save();
    }

    if (learnerProgress) {
      learnerProgress.sessionsCompleted += 1;
      learnerProgress.hoursLearned += session.duration;
      
      // Award badges
      if (learnerProgress.sessionsCompleted === 1 && !learnerProgress.badges.some(b => b.name === 'First Session')) {
        learnerProgress.badges.push({ name: 'First Session' });
      }
      if (learnerProgress.sessionsCompleted === 5 && !learnerProgress.badges.some(b => b.name === '5 Sessions Learned')) {
        learnerProgress.badges.push({ name: '5 Sessions Learned' });
      }
      if (learnerProgress.hoursLearned >= 10 && !learnerProgress.badges.some(b => b.name === '10 Hours Learning')) {
        learnerProgress.badges.push({ name: '10 Hours Learning' });
      }
      
      await learnerProgress.save();
    }

    // Update user points
    await User.findByIdAndUpdate(session.teacher, { $inc: { points: 10 } });
    await User.findByIdAndUpdate(session.learner, { $inc: { points: 5 } });

    const updatedSession = await Session.findById(session._id)
      .populate('teacher', 'name email avatarColor')
      .populate('learner', 'name email avatarColor');

    res.json({ success: true, data: updatedSession });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;