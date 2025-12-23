import { Users, BookOpen, Zap } from 'lucide-react';

const StatsStrip = () => {
  const stats = [
    { label: '10K+ Active Users', icon: Users },
    { label: '50+ Skill Categories', icon: BookOpen },
    { label: '25K+ Bridge Completed', icon: Zap }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto px-4 py-12">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white rounded-xl p-6 shadow-sm text-center">
          <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsStrip;