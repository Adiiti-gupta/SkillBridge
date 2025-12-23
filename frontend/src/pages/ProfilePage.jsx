import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Save, X, Plus, AlertCircle, ArrowRight } from 'lucide-react';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    timeZone: '',
    skillsToTeach: [],
    skillsToLearn: [],
    availability: []
  });

  const [newSkillToTeach, setNewSkillToTeach] = useState('');
  const [newSkillToLearn, setNewSkillToLearn] = useState('');
  const [newAvailability, setNewAvailability] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile/me');
      const userData = response.data.data;
      setFormData({
        name: userData.name || '',
        bio: userData.bio || '',
        location: userData.location || '',
        timeZone: userData.timeZone || '',
        skillsToTeach: userData.skillsToTeach || [],
        skillsToLearn: userData.skillsToLearn || [],
        availability: userData.availability || []
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to load profile' 
      });
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('=== FORM SUBMITTED ===');
    
    // Validation
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Name is required' });
      return;
    }

    if (formData.skillsToTeach.length === 0 && formData.skillsToLearn.length === 0) {
      setMessage({ 
        type: 'error', 
        text: 'Please add at least one skill to teach or learn' 
      });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      console.log('Submitting data:', formData);
      
      const response = await api.put('/profile', formData);
      console.log('Profile update successful:', response.data);
      
      // Update local storage and context
      const updatedUser = response.data.data;
      const newUserData = { ...user, ...updatedUser };
      
      setUser(newUserData);
      localStorage.setItem('user', JSON.stringify(newUserData));
      
      setMessage({ type: 'success', text: '✓ Profile saved successfully!' });
      
      // Navigate to marketplace
      console.log('Redirecting to marketplace...');
      setTimeout(() => {
        navigate('/marketplace', { replace: true });
      }, 1000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to save profile. Please try again.' 
      });
      setSaving(false);
    }
  };

  const addSkillToTeach = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (newSkillToTeach.trim() && !formData.skillsToTeach.includes(newSkillToTeach.trim())) {
      setFormData({
        ...formData,
        skillsToTeach: [...formData.skillsToTeach, newSkillToTeach.trim()]
      });
      setNewSkillToTeach('');
    }
  };

  const removeSkillToTeach = (skill) => {
    setFormData({
      ...formData,
      skillsToTeach: formData.skillsToTeach.filter(s => s !== skill)
    });
  };

  const addSkillToLearn = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (newSkillToLearn.trim() && !formData.skillsToLearn.includes(newSkillToLearn.trim())) {
      setFormData({
        ...formData,
        skillsToLearn: [...formData.skillsToLearn, newSkillToLearn.trim()]
      });
      setNewSkillToLearn('');
    }
  };

  const removeSkillToLearn = (skill) => {
    setFormData({
      ...formData,
      skillsToLearn: formData.skillsToLearn.filter(s => s !== skill)
    });
  };

  const addAvailability = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (newAvailability.trim() && !formData.availability.includes(newAvailability.trim())) {
      setFormData({
        ...formData,
        availability: [...formData.availability, newAvailability.trim()]
      });
      setNewAvailability('');
    }
  };

  const removeAvailability = (slot) => {
    setFormData({
      ...formData,
      availability: formData.availability.filter(s => s !== slot)
    });
  };

  const handleKeyPress = (e, handler) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      handler();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h1>
          <p className="text-gray-600">
            Add your skills to find the perfect learning matches
          </p>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 animate-fade-in ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your full name"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell others about yourself, your interests, and what you're looking for..."
            />
          </div>

          {/* Location & Timezone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., San Francisco, CA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Zone
              </label>
              <input
                type="text"
                value={formData.timeZone}
                onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., PST, EST, GMT+5:30"
              />
            </div>
          </div>

          {/* Skills to Teach */}
          <div className="p-5 bg-blue-50 rounded-lg border-2 border-blue-200">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Skills I Can Teach <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-600 mb-3">
              What skills can you share with others?
            </p>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newSkillToTeach}
                onChange={(e) => setNewSkillToTeach(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, addSkillToTeach)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., JavaScript, Guitar, Spanish"
              />
              <button
                type="button"
                onClick={addSkillToTeach}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[40px]">
              {formData.skillsToTeach.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full font-medium"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkillToTeach(skill)}
                    className="hover:bg-blue-700 rounded-full p-1 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
              {formData.skillsToTeach.length === 0 && (
                <p className="text-sm text-blue-700 italic py-2">Add at least one skill to teach or learn</p>
              )}
            </div>
          </div>

          {/* Skills to Learn */}
          <div className="p-5 bg-green-50 rounded-lg border-2 border-green-200">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Skills I Want to Learn <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-600 mb-3">
              What skills do you want to learn?
            </p>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newSkillToLearn}
                onChange={(e) => setNewSkillToLearn(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, addSkillToLearn)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Python, Photography, French"
              />
              <button
                type="button"
                onClick={addSkillToLearn}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[40px]">
              {formData.skillsToLearn.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full font-medium"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkillToLearn(skill)}
                    className="hover:bg-green-700 rounded-full p-1 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
              {formData.skillsToLearn.length === 0 && (
                <p className="text-sm text-green-700 italic py-2">Add at least one skill to teach or learn</p>
              )}
            </div>
          </div>

          {/* Availability */}
          <div className="p-5 bg-purple-50 rounded-lg border border-purple-200">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Availability (Optional)
            </label>
            <p className="text-xs text-gray-600 mb-3">
              When are you typically available?
            </p>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newAvailability}
                onChange={(e) => setNewAvailability(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, addAvailability)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Weekday Evenings, Weekend Mornings"
              />
              <button
                type="button"
                onClick={addAvailability}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[30px]">
              {formData.availability.map((slot, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-full font-medium"
                >
                  {slot}
                  <button
                    type="button"
                    onClick={() => removeAvailability(slot)}
                    className="hover:bg-purple-700 rounded-full p-1 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t">
            <button
              type="submit"
              disabled={saving || (formData.skillsToTeach.length === 0 && formData.skillsToLearn.length === 0)}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl hover:from-blue-700 hover:to-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg hover:shadow-xl"
            >
              {saving ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  Saving Profile...
                </>
              ) : (
                <>
                  <Save className="w-6 h-6" />
                  Save Profile & Find Matches
                  <ArrowRight className="w-6 h-6" />
                </>
              )}
            </button>
            
            {(formData.skillsToTeach.length === 0 && formData.skillsToLearn.length === 0) && (
              <p className="text-center text-sm text-red-600 mt-3">
                Please add at least one skill to teach or learn before saving
              </p>
            )}
          </div>
        </form>
      </div>

      {/* Alternative Navigation */}
      <div className="text-center mt-6 space-y-2">
        <button
          type="button"
          onClick={() => navigate('/marketplace')}
          className="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
        >
          Browse Marketplace Without Saving →
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;