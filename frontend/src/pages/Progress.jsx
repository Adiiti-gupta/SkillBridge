import { useState, useEffect } from 'react';
import api from '../services/api';
import { Award, TrendingUp, Clock, BookOpen, Target } from 'lucide-react';

const Progress = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await api.get('/progress/me');
      setProgress(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching progress:', error);
      setLoading(false);
    }
  };

  const badgeColors = {
    'First Session': 'bg-blue-100 text-blue-800 border-blue-300',
    '5 Sessions Taught': 'bg-purple-100 text-purple-800 border-purple-300',
    '5 Sessions Learned': 'bg-green-100 text-green-800 border-green-300',
    '10 Hours Teaching': 'bg-orange-100 text-orange-800 border-orange-300',
    '10 Hours Learning': 'bg-teal-100 text-teal-800 border-teal-300'
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading progress...</div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">No progress data found</div>
      </div>
    );
  }

  const totalHours = progress.hoursTaught + progress.hoursLearned;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Progress</h1>
        <p className="text-gray-600">Track your learning journey and achievements</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{progress.sessionsCompleted}</span>
          </div>
          <p className="text-blue-100 text-sm font-medium">Sessions Completed</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{progress.hoursTaught}</span>
          </div>
          <p className="text-purple-100 text-sm font-medium">Hours Teaching</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{progress.hoursLearned}</span>
          </div>
          <p className="text-green-100 text-sm font-medium">Hours Learning</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8 opacity-80" />
            <span className="text-3xl font-bold">{totalHours}</span>
          </div>
          <p className="text-orange-100 text-sm font-medium">Total Hours</p>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Activity Breakdown</h2>
        
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Teaching</span>
              <span className="text-sm text-gray-600">
                {totalHours > 0 ? Math.round((progress.hoursTaught / totalHours) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${totalHours > 0 ? (progress.hoursTaught / totalHours) * 100 : 0}%`
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Learning</span>
              <span className="text-sm text-gray-600">
                {totalHours > 0 ? Math.round((progress.hoursLearned / totalHours) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${totalHours > 0 ? (progress.hoursLearned / totalHours) * 100 : 0}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-6 h-6 text-yellow-600" />
          <h2 className="text-xl font-bold text-gray-900">Achievements</h2>
        </div>

        {progress.badges && progress.badges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {progress.badges.map((badge, index) => (
              <div
                key={index}
                className={`border-2 rounded-lg p-4 ${
                  badgeColors[badge.name] || 'bg-gray-100 text-gray-800 border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white bg-opacity-50 flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{badge.name}</h3>
                    <p className="text-xs opacity-75">
                      {new Date(badge.earnedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">
              No badges earned yet. Complete sessions to earn achievements!
            </p>
          </div>
        )}
      </div>

      {/* Next Milestones */}
      <div className="mt-8 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Next Milestones</h2>
        <div className="space-y-3">
          {progress.sessionsCompleted === 0 && (
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-2 h-2 rounded-full bg-blue-600" />
              <span>Complete your first session to earn "First Session" badge</span>
            </div>
          )}
          {progress.sessionsCompleted > 0 && progress.sessionsCompleted < 5 && (
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-2 h-2 rounded-full bg-purple-600" />
              <span>
                Complete {5 - progress.sessionsCompleted} more session(s) to earn badges
              </span>
            </div>
          )}
          {progress.hoursTaught < 10 && (
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-2 h-2 rounded-full bg-orange-600" />
              <span>
                Teach {10 - progress.hoursTaught} more hour(s) to earn "10 Hours Teaching" badge
              </span>
            </div>
          )}
          {progress.hoursLearned < 10 && (
            <div className="flex items-center gap-3 text-gray-700">
              <div className="w-2 h-2 rounded-full bg-teal-600" />
              <span>
                Learn {10 - progress.hoursLearned} more hour(s) to earn "10 Hours Learning" badge
              </span>
            </div>
          )}
          {progress.sessionsCompleted >= 5 && progress.hoursTaught >= 10 && progress.hoursLearned >= 10 && (
            <div className="flex items-center gap-3 text-green-700">
              <Award className="w-5 h-5" />
              <span className="font-medium">
                Congratulations! You've unlocked all current milestones! 🎉
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Progress;