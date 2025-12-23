import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  timeZone: {
    type: String,
    default: ''
  },
  // Renamed from skillsOffered to skillsToTeach
  skillsToTeach: [{
    type: String,
    trim: true
  }],
  // Renamed from skillsWanted to skillsToLearn
  skillsToLearn: [{
    type: String,
    trim: true
  }],
  availability: [{
    type: String,
    trim: true
  }],
  points: {
    type: Number,
    default: 0
  },
  avatarColor: {
    type: String,
    default: '#2563EB'
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);