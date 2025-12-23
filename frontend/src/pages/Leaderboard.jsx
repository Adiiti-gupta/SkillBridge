import { useState, useEffect } from 'react';
import api from '../services/api';
import { Trophy, Award } from 'lucide-react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('sessionsCompleted');

  useEffect(() => {
    fetchLeaderboard();
  }, [sortBy]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/leaderboard?sortBy=${sortBy}`);
      setLeaderboard(response.data.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError(error.response?.data?.message || 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-600';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-orange-600';
    return 'text-gray-600';
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading leaderboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-lg text-red-600 mb-2">Error loading leaderboard</p>
          <p className="text-sm text-gray-600">{error}</p>
          <button
            onClick={fetchLeaderboard}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-8 h-8 text-yellow-600" />
          <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
        </div>
        <p className="text-gray-600">Top contributors in the SkillBridge community</p>
      </div>

      {/* Sort Options */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-700 mr-2">Sort by:</span>
          <button
            onClick={() => setSortBy('sessionsCompleted')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              sortBy === 'sessionsCompleted'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Total Sessions
          </button>
          <button
            onClick={() => setSortBy('hoursTaught')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              sortBy === 'hoursTaught'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Hours Teaching
          </button>
          <button
            onClick={() => setSortBy('hoursLearned')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              sortBy === 'hoursLearned'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Hours Learning
          </button>
        </div>
      </div>

      {leaderboard.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No rankings yet
          </h3>
          <p className="text-gray-600">
            Complete sessions to appear on the leaderboard!
          </p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {leaderboard.length >= 3 && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              {/* 2nd Place */}
              <div className="mt-8">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-sm p-6 text-center">
                  <div className="text-4xl mb-2">🥈</div>
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-xl font-bold"
                    style={{ backgroundColor: leaderboard[1].user?.avatarColor || '#3B82F6' }}
                  >
                    {leaderboard[1].user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">
                    {leaderboard[1].user?.name || 'Unknown'}
                  </h3>
                  <p className="text-2xl font-bold text-gray-600">
                    {sortBy === 'sessionsCompleted' && leaderboard[1].sessionsCompleted}
                    {sortBy === 'hoursTaught' && leaderboard[1].hoursTaught}
                    {sortBy === 'hoursLearned' && leaderboard[1].hoursLearned}
                  </p>
                  <p className="text-sm text-gray-500">
                    {leaderboard[1].user?.points || 0} points
                  </p>
                </div>
              </div>

              {/* 1st Place */}
              <div>
                <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl shadow-lg p-6 text-center transform scale-105">
                  <div className="text-5xl mb-2">🥇</div>
                  <div
                    className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-yellow-400"
                    style={{ backgroundColor: leaderboard[0].user?.avatarColor || '#3B82F6' }}
                  >
                    {leaderboard[0].user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 text-lg">
                    {leaderboard[0].user?.name || 'Unknown'}
                  </h3>
                  <p className="text-3xl font-bold text-yellow-700">
                    {sortBy === 'sessionsCompleted' && leaderboard[0].sessionsCompleted}
                    {sortBy === 'hoursTaught' && leaderboard[0].hoursTaught}
                    {sortBy === 'hoursLearned' && leaderboard[0].hoursLearned}
                  </p>
                  <p className="text-sm text-gray-600 font-medium">
                    {leaderboard[0].user?.points || 0} points
                  </p>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="mt-8">
                <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl shadow-sm p-6 text-center">
                  <div className="text-4xl mb-2">🥉</div>
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-xl font-bold"
                    style={{ backgroundColor: leaderboard[2].user?.avatarColor || '#3B82F6' }}
                  >
                    {leaderboard[2].user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">
                    {leaderboard[2].user?.name || 'Unknown'}
                  </h3>
                  <p className="text-2xl font-bold text-orange-600">
                    {sortBy === 'sessionsCompleted' && leaderboard[2].sessionsCompleted}
                    {sortBy === 'hoursTaught' && leaderboard[2].hoursTaught}
                    {sortBy === 'hoursLearned' && leaderboard[2].hoursLearned}
                  </p>
                  <p className="text-sm text-gray-500">
                    {leaderboard[2].user?.points || 0} points
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Full Leaderboard */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      User
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Sessions
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Hours Teaching
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Hours Learning
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Points
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Badges
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {leaderboard.map((entry) => (
                    <tr key={entry.user?._id || Math.random()} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <span className={`text-2xl font-bold ${getRankColor(entry.rank)}`}>
                          {getRankBadge(entry.rank)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: entry.user?.avatarColor || '#3B82F6' }}
                          >
                            {entry.user?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <span className="font-medium text-gray-900">
                            {entry.user?.name || 'Unknown User'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-gray-900">
                        {entry.sessionsCompleted || 0}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600">
                        {entry.hoursTaught || 0}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600">
                        {entry.hoursLearned || 0}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {entry.user?.points || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-1">
                          {entry.badges && entry.badges.length > 0 ? (
                            <>
                              {entry.badges.slice(0, 3).map((badge, idx) => (
                                <Award
                                  key={idx}
                                  className="w-5 h-5 text-yellow-600"
                                  title={badge.name}
                                />
                              ))}
                              {entry.badges.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{entry.badges.length - 3}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Leaderboard;
