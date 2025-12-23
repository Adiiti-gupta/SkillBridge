# SkillBridge - Skill Exchange Platform

A full-stack MERN application for exchanging skills between users. Users can teach skills they know and learn skills they want to acquire through matched connections.

## Features

- 👤 User Authentication (JWT)
- 📝 User Profiles with Skills
- 🎯 Smart Skill Matching Algorithm
- 📅 Session Scheduling & Management
- 💬 Real-time Messaging
- 📊 Progress Tracking & Badges
- 🏆 Leaderboard System

## Tech Stack

**Frontend:**
- React + Vite
- React Router
- Tailwind CSS
- Axios
- Lucide React Icons

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/skillswap.git
cd skillswap
```

### Backend Setup
```bash
cd server
npm install

# Create .env file
echo "MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000" > .env

# Seed the database with fake data (optional)
npm run seed

# Start the server
npm run dev
```

### Frontend Setup
```bash
cd client
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start the development server
npm run dev
```

## Usage

1. Register a new account or login
2. Complete your profile with skills to teach and learn
3. Browse the marketplace to find matches
4. Chat with matches and request sessions
5. Track your progress and earn badges

## Test Accounts

After running the seed script, you can login with:
- Email: `alice.johnson@example.com`
- Password: `password123`

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Profile
- GET `/api/profile/me` - Get my profile
- PUT `/api/profile` - Update profile
- GET `/api/profile/all` - Get all users
- GET `/api/profile/:userId` - Get user by ID

### Matches
- GET `/api/matches` - Get skill matches

### Sessions
- POST `/api/sessions` - Create session request
- GET `/api/sessions` - Get my sessions
- PUT `/api/sessions/:id/status` - Update session status
- PUT `/api/sessions/:id/complete` - Complete session

### Messages
- GET `/api/messages` - Get conversations
- GET `/api/messages/:userId` - Get messages with user
- POST `/api/messages` - Send message

### Progress
- GET `/api/progress/me` - Get my progress

### Leaderboard
- GET `/api/leaderboard` - Get leaderboard

## License

MIT

## Author

Aditi Gupta