import express from 'express';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get messages with a specific user
router.get('/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ]
    })
    .sort({ createdAt: 1 })
    .populate('sender', 'name avatarColor')
    .populate('receiver', 'name avatarColor');

    // Mark messages as read
    await Message.updateMany(
      { sender: userId, receiver: req.user._id, read: false },
      { read: true }
    );

    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all conversations (list of users I've messaged with)
router.get('/', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id }
      ]
    })
    .sort({ createdAt: -1 })
    .populate('sender', 'name avatarColor')
    .populate('receiver', 'name avatarColor');

    // Get unique users
    const userMap = new Map();
    
    messages.forEach(msg => {
      const otherUser = msg.sender._id.toString() === req.user._id.toString() 
        ? msg.receiver 
        : msg.sender;
      
      const otherUserId = otherUser._id.toString();
      
      if (!userMap.has(otherUserId)) {
        const unreadCount = messages.filter(m => 
          m.sender._id.toString() === otherUserId && 
          m.receiver._id.toString() === req.user._id.toString() &&
          !m.read
        ).length;

        userMap.set(otherUserId, {
          user: otherUser,
          lastMessage: msg.text,
          lastMessageAt: msg.createdAt,
          unreadCount
        });
      }
    });

    const conversations = Array.from(userMap.values());
    
    res.json({ success: true, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send a message
router.post('/', protect, async (req, res) => {
  try {
    const { to, text } = req.body;

    if (!to || !text) {
      return res.status(400).json({
        success: false,
        message: 'Receiver and message text are required'
      });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver: to,
      text
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatarColor')
      .populate('receiver', 'name avatarColor');

    res.status(201).json({ success: true, data: populatedMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;