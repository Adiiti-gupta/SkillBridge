import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get matches for current user
router.get('/', protect, async (req, res) => {
  try {
    console.log('=== MATCHES REQUEST ===');
    console.log('User ID:', req.user._id);
    
    const currentUser = await User.findById(req.user._id);
    console.log('Current user skills:', {
      skillsToTeach: currentUser.skillsToTeach,
      skillsToLearn: currentUser.skillsToLearn
    });

    // If user has no skills, return empty array
    if ((!currentUser.skillsToTeach || currentUser.skillsToTeach.length === 0) && 
        (!currentUser.skillsToLearn || currentUser.skillsToLearn.length === 0)) {
      console.log('User has no skills, returning empty matches');
      return res.json({ success: true, data: [] });
    }

    // Build query to find potential matches
    const query = {
      _id: { $ne: req.user._id } // Exclude self
    };

    // Find users with ANY matching skills
    const conditions = [];
    
    if (currentUser.skillsToLearn && currentUser.skillsToLearn.length > 0) {
      conditions.push({ skillsToTeach: { $in: currentUser.skillsToLearn } });
    }
    
    if (currentUser.skillsToTeach && currentUser.skillsToTeach.length > 0) {
      conditions.push({ skillsToLearn: { $in: currentUser.skillsToTeach } });
    }

    if (conditions.length > 0) {
      query.$or = conditions;
    } else {
      // No conditions means no matches possible
      return res.json({ success: true, data: [] });
    }

    console.log('Query:', JSON.stringify(query, null, 2));

    const matches = await User.find(query).select('-passwordHash -email');
    console.log(`Found ${matches.length} potential matches`);

    // Calculate match details
    const matchesWithDetails = matches.map(match => {
      const canLearnFrom = (match.skillsToTeach || []).filter(skill =>
        (currentUser.skillsToLearn || []).includes(skill)
      );
      const canTeachTo = (match.skillsToLearn || []).filter(skill =>
        (currentUser.skillsToTeach || []).includes(skill)
      );

      return {
        user: match,
        canLearnFrom,
        canTeachTo,
        matchScore: canLearnFrom.length + canTeachTo.length
      };
    });

    // Filter out matches with 0 score and sort by score
    const validMatches = matchesWithDetails
      .filter(m => m.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    console.log(`Returning ${validMatches.length} valid matches`);
    res.json({ success: true, data: validMatches });
  } catch (error) {
    console.error('Match error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;