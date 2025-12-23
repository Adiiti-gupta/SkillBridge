import { Target, BookOpen, MessageSquare, Calendar, Trophy, Award } from 'lucide-react';

const FeatureGrid = () => {
  const features = [
    { icon: Target, title: 'Smart Matching', desc: 'Our algorithm connects you with the perfect learning partners based on skills and goals.' },
    { icon: BookOpen, title: 'Diverse Skills', desc: 'From coding to cooking, music to marketing - learn anything from real experts.' },
    { icon: MessageSquare, title: 'Built-in Chat', desc: 'Seamless messaging to coordinate sessions and share resources with your partners.' },
    { icon: Calendar, title: 'Session Scheduling', desc: 'Easy-to-use calendar system to book and manage your learning sessions.' },
    { icon: Trophy, title: 'Track Progress', desc: 'Monitor your learning journey with detailed analytics and milestone tracking.' },
    { icon: Award, title: 'Earn Rewards', desc: 'Gain points, unlock badges, and climb the leaderboard as you teach and learn.' }
  ];

  return (
    <div className="py-16 px-4">
      <h2 className="text-3xl font-bold text-center mb-12">Why Choose SkillBridge?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {features.map((feature, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <feature.icon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureGrid;