import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="text-center py-20 px-4">
      <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
        Exchange Skills, Empower Each Other
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Connect with peers to teach what you know and learn what you need. Join our thriving community of knowledge sharers.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={() => navigate(user ? '/marketplace' : '/register')} 
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition text-lg font-medium"
        >
          Get Started Free
        </button>
        <button 
          onClick={() => navigate('/marketplace')} 
          className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition text-lg font-medium"
        >
          Explore Skills
        </button>
      </div>
    </div>
  );
};

export default Hero;