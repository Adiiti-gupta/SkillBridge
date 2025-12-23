import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { MessageSquare, Calendar, User, MapPin, Clock, AlertCircle, Filter } from 'lucide-react';

const Marketplace = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [displayUsers, setDisplayUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'matches'
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    console.log('Marketplace mounted, current user:', user);
    fetchData();
  }, []);

  useEffect(() => {
    // Update display based on view mode
    if (viewMode === 'all') {
      setDisplayUsers(allUsers);
    } else {
      setDisplayUsers(matches.map(m => ({ ...m.user, matchData: m })));
    }
  }, [viewMode, allUsers, matches]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching marketplace data...');
      
      // Fetch all users
      const usersResponse = await api.get('/profile/all');
      console.log('All users response:', usersResponse.data);
      setAllUsers(usersResponse.data.data || []);
      
      // Fetch matches
      const matchesResponse = await api.get('/matches');
      console.log('Matches response:', matchesResponse.data);
      setMatches(matchesResponse.data.data || []);
      
      // Default to showing all users
      setDisplayUsers(usersResponse.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.response?.data?.message || 'Failed to load marketplace');
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = (userId) => {
    console.log('Starting chat with user:', userId);
    navigate(`/messages?user=${userId}`);
  };

  const handleRequestSession = (userToRequest) => {
    console.log('Requesting session with:', userToRequest);
    
    // Get skills that can be learned from this user
    let skillsToLearn = [];
    if (viewMode === 'matches' && userToRequest.matchData) {
      skillsToLearn = userToRequest.matchData.canLearnFrom;
    } else {
      // Find common skills
      const currentUserSkillsToLearn = user?.skillsToLearn || [];
      const theirSkillsToTeach = userToRequest.skillsToTeach || [];
      skillsToLearn = theirSkillsToTeach.filter(skill => 
        currentUserSkillsToLearn.includes(skill)
      );
    }
    
    navigate('/sessions', { 
      state: { 
        requestSession: true, 
        teacherId: userToRequest._id,
        teacherName: userToRequest.name,
        skills: skillsToLearn.length > 0 ? skillsToLearn : userToRequest.skillsToTeach || []
      } 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading marketplace...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Marketplace
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Skill Marketplace</h1>
        <p className="text-gray-600">
          {viewMode === 'all' 
            ? 'Browse all available teachers and learners' 
            : 'Your personalized matches based on skills'}
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex gap-3 items-center">
        <Filter className="w-5 h-5 text-gray-600" />
        <button
          onClick={() => setViewMode('all')}
          className={`px-6 py-2 rounded-lg font-medium transition ${
            viewMode === 'all'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          All Users ({allUsers.length})
        </button>
        <button
          onClick={() => setViewMode('matches')}
          className={`px-6 py-2 rounded-lg font-medium transition ${
            viewMode === 'matches'
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          My Matches ({matches.length})
        </button>
      </div>

      {displayUsers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="max-w-md mx-auto">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {viewMode === 'all' ? 'No users found' : 'No matches found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {viewMode === 'all' 
                ? 'There are no users in the marketplace yet.' 
                : 'Update your profile with skills you want to teach and learn to find matches!'}
            </p>
            {viewMode === 'matches' && (
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/profile')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Complete Your Profile
                </button>
                <button
                  onClick={() => setViewMode('all')}
                  className="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Browse All Users
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-600">
            Showing {displayUsers.length} {displayUsers.length === 1 ? 'user' : 'users'}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayUsers.map((displayUser) => {
              const matchData = displayUser.matchData;
              const canLearnFrom = matchData?.canLearnFrom || [];
              const canTeachTo = matchData?.canTeachTo || [];
              
              return (
                <div
                  key={displayUser._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
                      style={{ backgroundColor: displayUser.avatarColor || '#3B82F6' }}
                    >
                      {displayUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {displayUser.name}
                      </h3>
                      {displayUser.location && (
                        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{displayUser.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-sm text-blue-600 mt-1">
                        <span className="font-medium">{displayUser.points || 0} pts</span>
                      </div>
                    </div>
                  </div>

                  {displayUser.bio && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {displayUser.bio}
                    </p>
                  )}

                  {/* Show match details if in matches view */}
                  {viewMode === 'matches' && matchData && (
                    <>
                      {canLearnFrom.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-medium text-gray-700 mb-2">
                            You can learn:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {canLearnFrom.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {canTeachTo.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-medium text-gray-700 mb-2">
                            You can teach:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {canTeachTo.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Show all skills if in all users view */}
                  {viewMode === 'all' && (
                    <>
                      {displayUser.skillsToTeach && displayUser.skillsToTeach.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-medium text-gray-700 mb-2">
                            Can teach:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {displayUser.skillsToTeach.slice(0, 4).map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                            {displayUser.skillsToTeach.length > 4 && (
                              <span className="text-xs text-gray-500">
                                +{displayUser.skillsToTeach.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {displayUser.skillsToLearn && displayUser.skillsToLearn.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-medium text-gray-700 mb-2">
                            Wants to learn:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {displayUser.skillsToLearn.slice(0, 4).map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                            {displayUser.skillsToLearn.length > 4 && (
                              <span className="text-xs text-gray-500">
                                +{displayUser.skillsToLearn.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {displayUser.availability && displayUser.availability.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Available:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {displayUser.availability.slice(0, 2).map((slot, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                          >
                            {slot}
                          </span>
                        ))}
                        {displayUser.availability.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{displayUser.availability.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={() => handleStartChat(displayUser._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Chat
                    </button>
                    <button
                      onClick={() => handleRequestSession(displayUser)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                    >
                      <Calendar className="w-4 h-4" />
                      Request
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Marketplace;