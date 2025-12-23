import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="bg-gradient-to-r from-blue-600 to-green-500 rounded-2xl p-12 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Learning Journey?</h2>
        <p className="text-xl mb-8 opacity-90">Join thousands of learners exchanging skills every day.</p>
        <button 
          onClick={() => navigate('/register')} 
          className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition text-lg font-medium"
        >
          Join SkillBridge Today
        </button>
      </div>
    </div>
  );
};

export default CTASection;