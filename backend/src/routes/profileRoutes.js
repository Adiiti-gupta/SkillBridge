import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get my profile
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update my profile
router.put('/', protect, async (req, res) => {
  try {
    console.log('Profile update request:', req.body);
    console.log('User ID:', req.user._id);

    const {
      name,
      bio,
      location,
      timeZone,
      skillsToTeach,
      skillsToLearn,
      availability
    } = req.body;

    // Build update object only with provided fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (timeZone !== undefined) updateData.timeZone = timeZone;
    if (skillsToTeach !== undefined) updateData.skillsToTeach = skillsToTeach;
    if (skillsToLearn !== undefined) updateData.skillsToLearn = skillsToLearn;
    if (availability !== undefined) updateData.availability = availability;

    console.log('Update data:', updateData);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    console.log('Updated user:', user);

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      details: error.toString()
    });
  }
});

// Get all users (public profiles) - MUST BE BEFORE /:userId
router.get('/all', protect, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select('-passwordHash -email')
      .sort({ points: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user profile by ID (public view) - MUST BE LAST
router.get('/:userId', protect, async (req, res) => {
  try {
    console.log('Fetching user profile:', req.params.userId);
    const user = await User.findById(req.params.userId).select('-passwordHash -email');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    console.log('User found:', user.name);
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;