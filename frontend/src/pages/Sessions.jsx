import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import { Calendar, Clock, CheckCircle, XCircle, User, MessageSquare } from 'lucide-react';

const Sessions = () => {
  const location = useLocation();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestData, setRequestData] = useState({
    teacherId: '',
    teacherName: '',
    skill: '',
    scheduledAt: '',
    notes: ''
  });

  useEffect(() => {
    fetchSessions();
    
    // Check if we need to open request modal from navigation state
    if (location.state?.requestSession) {
      setRequestData({
        teacherId: location.state.teacherId,
        teacherName: location.state.teacherName,
        skill: location.state.skills?.[0] || '',
        scheduledAt: '',
        notes: ''
      });
      setShowRequestModal(true);
    }
  }, [location]);

  const fetchSessions = async () => {
    try {
      const response = await api.get('/sessions');
      setSessions(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setLoading(false);
    }
  };

  const handleRequestSession = async (e) => {
    e.preventDefault();
    try {
      await api.post('/sessions', {
        teacherId: requestData.teacherId,
        skill: requestData.skill,
        scheduledAt: requestData.scheduledAt,
        notes: requestData.notes
      });
      setShowRequestModal(false);
      setRequestData({ teacherId: '', teacherName: '', skill: '', scheduledAt: '', notes: '' });
      fetchSessions();
    } catch (error) {
      console.error('Error requesting session:', error);
      alert('Failed to request session');
    }
  };

  const handleStatusUpdate = async (sessionId, status) => {
    try {
      await api.put(`/sessions/${sessionId}/status`, { status });
      fetchSessions();
    } catch (error) {
      console.error('Error updating session:', error);
      alert('Failed to update session');
    }
  };

  const handleCompleteSession = async (sessionId, notes = '') => {
    try {
      await api.put(`/sessions/${sessionId}/complete`, { completionNotes: notes });
      fetchSessions();
    } catch (error) {
      console.error('Error completing session:', error);
      alert('Failed to complete session');
    }
  };

  const getFilteredSessions = () => {
    const now = new Date();
    switch (activeTab) {
      case 'upcoming':
        return sessions.filter(s => 
          ['accepted'].includes(s.status) && new Date(s.scheduledAt) > now
        );
      case 'pending':
        return sessions.filter(s => s.status === 'pending');
      case 'past':
        return sessions.filter(s => 
          s.status === 'completed' || (s.status === 'accepted' && new Date(s.scheduledAt) < now)
        );
      default:
        return sessions;
    }
  };

  const filteredSessions = getFilteredSessions();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading sessions...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Sessions</h1>
        <p className="text-gray-600">Manage your teaching and learning sessions</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 px-1 font-medium transition ${
            activeTab === 'upcoming'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 px-1 font-medium transition ${
            activeTab === 'pending'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Pending Requests
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`pb-3 px-1 font-medium transition ${
            activeTab === 'past'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Past Sessions
        </button>
      </div>

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No {activeTab} sessions
          </h3>
          <p className="text-gray-600">
            {activeTab === 'upcoming' && 'Your confirmed sessions will appear here'}
            {activeTab === 'pending' && 'Session requests will appear here'}
            {activeTab === 'past' && 'Your completed sessions will appear here'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSessions.map((session) => {
            const isTeacher = session.teacher._id === JSON.parse(localStorage.getItem('user'))?.id;
            const otherUser = isTeacher ? session.learner : session.teacher;
            const role = isTeacher ? 'Teaching' : 'Learning';

            return (
              <div
                key={session._id}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold"
                      style={{ backgroundColor: otherUser.avatarColor }}
                    >
                      {otherUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {otherUser.name}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          role === 'Teaching' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {role}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Skill: <span className="font-medium">{session.skill}</span>
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(session.scheduledAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(session.scheduledAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                      {session.notes && (
                        <p className="mt-2 text-sm text-gray-600 italic">
                          "{session.notes}"
                        </p>
                      )}
                      {session.completionNotes && (
                        <div className="mt-2 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-800">
                            <strong>Completion notes:</strong> {session.completionNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {session.status === 'pending' && isTeacher && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(session._id, 'accepted')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(session._id, 'declined')}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                        >
                          Decline
                        </button>
                      </>
                    )}
                    {session.status === 'pending' && !isTeacher && (
                      <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium">
                        Awaiting Response
                      </span>
                    )}
                    {session.status === 'accepted' && activeTab === 'upcoming' && (
                      <button
                        onClick={() => {
                          const notes = prompt('Add any completion notes (optional):');
                          if (notes !== null) {
                            handleCompleteSession(session._id, notes);
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                      >
                        Mark Complete
                      </button>
                    )}
                    {session.status === 'completed' && (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )}
                    {session.status === 'declined' && (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Request Session Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Request Session
            </h2>
            <form onSubmit={handleRequestSession} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teacher
                </label>
                <input
                  type="text"
                  value={requestData.teacherName}
                  disabled
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill
                </label>
                <input
                  type="text"
                  value={requestData.skill}
                  onChange={(e) => setRequestData({ ...requestData, skill: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={requestData.scheduledAt}
                  onChange={(e) => setRequestData({ ...requestData, scheduledAt: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={requestData.notes}
                  onChange={(e) => setRequestData({ ...requestData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any specific topics or questions..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sessions;