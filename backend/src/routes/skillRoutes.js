import express from 'express';
import Skill from '../models/Skill.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all skills
router.get('/', async (req, res) => {
  try {
    const { category, level } = req.query;
    const filter = {};
    
    if (category && category !== 'all') filter.category = category;
    if (level && level !== 'all') filter.level = level;

    const skills = await Skill.find(filter).populate('createdBy', 'name email points');
    res.json({ success: true, data: skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single skill
router.get('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id).populate('createdBy', 'name email points');
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }
    res.json({ success: true, data: skill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create skill
router.post('/', protect, async (req, res) => {
  try {
    const { title, category, description, level } = req.body;

    const skill = await Skill.create({
      title,
      category,
      description,
      level,
      createdBy: req.user._id
    });

    const populatedSkill = await Skill.findById(skill._id).populate('createdBy', 'name email points');
    res.status(201).json({ success: true, data: populatedSkill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update skill
router.put('/:id', protect, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    if (skill.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email points');

    res.json({ success: true, data: updatedSkill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete skill
router.delete('/:id', protect, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    if (skill.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await skill.deleteOne();
    res.json({ success: true, message: 'Skill deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;