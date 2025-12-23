import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Progress from './models/Progress.js';
import Session from './models/Session.js';
import Message from './models/Message.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skillswap';

// Skills pool
const techSkills = ['JavaScript', 'Python', 'React', 'Node.js', 'MongoDB', 'SQL', 'Java', 'C++', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'TypeScript', 'Vue.js', 'Angular', 'Django', 'Flask', 'Express', 'GraphQL', 'REST API', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Machine Learning', 'Data Science', 'AI', 'Blockchain', 'Solidity', 'Web3', 'Cybersecurity', 'DevOps', 'Linux', 'Git', 'Unity', 'Unreal Engine', 'Game Development', 'Mobile Development', 'React Native', 'Flutter'];

const creativeSkills = ['Photography', 'Photoshop', 'Illustrator', 'Video Editing', 'After Effects', 'Premiere Pro', 'UI/UX Design', 'Figma', 'Sketch', 'Graphic Design', 'Animation', '3D Modeling', 'Blender', 'Sound Design', 'Music Production', 'Drawing', 'Painting', 'Digital Art'];

const languageSkills = ['Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Mandarin', 'Japanese', 'Korean', 'Arabic', 'Russian', 'Hindi'];

const businessSkills = ['Digital Marketing', 'SEO', 'Content Writing', 'Social Media Marketing', 'Email Marketing', 'Sales', 'Project Management', 'Business Strategy', 'Excel', 'Data Analytics', 'Power BI', 'Public Speaking', 'Leadership', 'Negotiation'];

const lifestyleSkills = ['Yoga', 'Meditation', 'Cooking', 'Baking', 'Guitar', 'Piano', 'Singing', 'Dancing', 'Fitness Training', 'Nutrition', 'Wellness Coaching'];

const allSkills = [...techSkills, ...creativeSkills, ...languageSkills, ...businessSkills, ...lifestyleSkills];

// Name pools
const firstNames = ['Alice', 'Bob', 'Carlos', 'Diana', 'Ethan', 'Fiona', 'George', 'Hannah', 'Ian', 'Julia', 'Kevin', 'Laura', 'Michael', 'Nina', 'Oliver', 'Priya', 'Quinn', 'Rachel', 'Samuel', 'Tina', 'Uma', 'Victor', 'Wendy', 'Xavier', 'Yara', 'Zack', 'Amy', 'Brian', 'Catherine', 'David', 'Emma', 'Frank', 'Grace', 'Henry', 'Iris', 'Jack', 'Karen', 'Liam', 'Maria', 'Nathan', 'Olivia', 'Peter', 'Quincy', 'Rose', 'Steve', 'Tracy', 'Ursula', 'Vince', 'Wilma', 'Xander'];

const lastNames = ['Johnson', 'Smith', 'Rodriguez', 'Chen', 'Williams', 'Martinez', 'Park', 'Lee', 'Thompson', 'Santos', 'Brown', 'Kim', 'Zhang', 'Patel', 'Green', 'Taylor', 'Anderson', 'Thomas', 'Moore', 'Jackson', 'White', 'Harris', 'Martin', 'Garcia', 'Robinson', 'Clark', 'Lewis', 'Walker', 'Hall', 'Allen', 'Young', 'King', 'Wright', 'Lopez', 'Hill', 'Scott', 'Adams', 'Baker', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards', 'Collins'];

const cities = ['San Francisco, CA', 'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ', 'Philadelphia, PA', 'San Diego, CA', 'Dallas, TX', 'Austin, TX', 'Seattle, WA', 'Denver, CO', 'Boston, MA', 'Portland, OR', 'Miami, FL', 'Atlanta, GA', 'Minneapolis, MN', 'Detroit, MI', 'Nashville, TN', 'Las Vegas, NV'];

const timeZones = ['PST', 'EST', 'CST', 'MST'];
const availabilities = ['Weekday Mornings', 'Weekday Afternoons', 'Weekday Evenings', 'Weekend Mornings', 'Weekend Afternoons', 'Weekend Evenings', 'Flexible Schedule', 'Early Mornings', 'Late Nights'];

const bios = [
  'Passionate educator who loves sharing knowledge and learning from others.',
  'Tech enthusiast always eager to explore new technologies and teach what I know.',
  'Creative professional looking to exchange skills and grow together.',
  'Lifelong learner who believes in the power of skill sharing.',
  'Experienced professional wanting to give back to the community through teaching.',
  'Curious mind always ready to learn something new and help others.',
  'Skill exchange advocate who enjoys connecting with like-minded people.',
  'Expert in my field, beginner in many others. Let\'s learn together!',
  'Believer in continuous learning and collaborative growth.',
  'Knowledge sharer who finds joy in helping others succeed.',
  'Professional with diverse interests looking to expand my skill set.',
  'Teaching is my passion, learning is my lifestyle.',
  'Building connections through shared knowledge and mutual learning.',
  'Enthusiastic about both teaching and learning new skills.',
  'Love the collaborative spirit of skill exchange platforms.'
];

const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#EF4444', '#06B6D4', '#14B8A6', '#A855F7', '#F97316', '#DC2626'];

// Generate random user
const generateUser = (index) => {
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[Math.floor(index / firstNames.length) % lastNames.length];
  const name = `${firstName} ${lastName}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
  
  // Random skills
  const numTeachSkills = Math.floor(Math.random() * 5) + 2; // 2-6 skills
  const numLearnSkills = Math.floor(Math.random() * 4) + 2; // 2-5 skills
  
  const shuffledSkills = [...allSkills].sort(() => 0.5 - Math.random());
  const skillsToTeach = shuffledSkills.slice(0, numTeachSkills);
  const skillsToLearn = shuffledSkills.slice(numTeachSkills, numTeachSkills + numLearnSkills);
  
  // Random availability
  const numAvailability = Math.floor(Math.random() * 3) + 1; // 1-3 slots
  const availability = [];
  for (let i = 0; i < numAvailability; i++) {
    const slot = availabilities[Math.floor(Math.random() * availabilities.length)];
    if (!availability.includes(slot)) {
      availability.push(slot);
    }
  }
  
  return {
    name,
    email,
    password: 'password123',
    bio: bios[Math.floor(Math.random() * bios.length)],
    location: cities[Math.floor(Math.random() * cities.length)],
    timeZone: timeZones[Math.floor(Math.random() * timeZones.length)],
    skillsToTeach,
    skillsToLearn,
    availability,
    points: Math.floor(Math.random() * 200) + 50,
    avatarColor: colors[Math.floor(Math.random() * colors.length)]
  };
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding with 50 users...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Progress.deleteMany({});
    await Session.deleteMany({});
    await Message.deleteMany({});
    console.log('✓ Cleared existing data');

    // Create 50 users
    console.log('👥 Creating 50 users...');
    const users = [];
    
    for (let i = 0; i < 50; i++) {
      const userData = generateUser(i);
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(userData.password, salt);
      
      const user = await User.create({
        name: userData.name,
        email: userData.email,
        passwordHash,
        bio: userData.bio,
        location: userData.location,
        timeZone: userData.timeZone,
        skillsToTeach: userData.skillsToTeach,
        skillsToLearn: userData.skillsToLearn,
        availability: userData.availability,
        points: userData.points,
        avatarColor: userData.avatarColor
      });
      
      users.push(user);
      
      // Create progress for each user
      const sessionsCompleted = Math.floor(Math.random() * 15);
      const badges = [];
      
      if (sessionsCompleted >= 1) badges.push({ name: 'First Session', earnedAt: new Date() });
      if (sessionsCompleted >= 5) badges.push({ name: '5 Sessions Completed', earnedAt: new Date() });
      if (sessionsCompleted >= 10) badges.push({ name: '10 Sessions Milestone', earnedAt: new Date() });
      
      await Progress.create({
        user: user._id,
        sessionsCompleted,
        hoursTaught: Math.floor(Math.random() * 25),
        hoursLearned: Math.floor(Math.random() * 25),
        badges
      });
    }
    
    console.log(`✓ Created ${users.length} users with progress`);

    // Create sample sessions
    console.log('📅 Creating sample sessions...');
    const sessions = [];
    
    for (let i = 0; i < 30; i++) {
      const teacher = users[Math.floor(Math.random() * users.length)];
      const learner = users[Math.floor(Math.random() * users.length)];
      
      if (teacher._id.toString() !== learner._id.toString() && teacher.skillsToTeach.length > 0) {
        const skill = teacher.skillsToTeach[Math.floor(Math.random() * teacher.skillsToTeach.length)];
        const statuses = ['pending', 'accepted', 'completed', 'accepted'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30) - 10);
        
        const session = await Session.create({
          teacher: teacher._id,
          learner: learner._id,
          skill,
          scheduledAt: futureDate,
          status,
          notes: 'Looking forward to learning this skill!'
        });
        
        sessions.push(session);
      }
    }
    
    console.log(`✓ Created ${sessions.length} sessions`);

    // Create sample messages
    console.log('💬 Creating sample messages...');
    const messages = [];
    
    const messageTexts = [
      'Hi! I saw your profile and would love to learn from you.',
      'Are you available for a session this week?',
      'Thanks for the great session! I learned a lot.',
      'When would be a good time for our next session?',
      'I really appreciate your teaching style!',
      'Could we schedule a follow-up session?',
      'Do you have any resources you recommend?',
      'Looking forward to our session!',
      'That was really helpful, thank you!',
      'Can we discuss this topic in more detail?'
    ];
    
    for (let i = 0; i < 50; i++) {
      const sender = users[Math.floor(Math.random() * users.length)];
      const receiver = users[Math.floor(Math.random() * users.length)];
      
      if (sender._id.toString() !== receiver._id.toString()) {
        const message = await Message.create({
          sender: sender._id,
          receiver: receiver._id,
          text: messageTexts[Math.floor(Math.random() * messageTexts.length)],
          read: Math.random() > 0.5,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000))
        });
        
        messages.push(message);
      }
    }
    
    console.log(`✓ Created ${messages.length} messages`);

    // Summary
    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Progress records: ${users.length}`);
    console.log(`   - Sessions: ${sessions.length}`);
    console.log(`   - Messages: ${messages.length}`);
    console.log('\n👤 Test Login Credentials (All users):');
    console.log('   Password: password123');
    console.log('\n   Sample emails:');
    console.log('   - alice.johnson@example.com');
    console.log('   - bob.smith@example.com');
    console.log('   - carlos.rodriguez@example.com');
    console.log('   - diana.chen@example.com');
    console.log('   - ethan.williams@example.com\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();