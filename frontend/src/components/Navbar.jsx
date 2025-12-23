import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = user ? [
    { name: 'Home', path: '/' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Messages', path: '/messages' },
    { name: 'Sessions', path: '/sessions' },
    { name: 'Progress', path: '/progress' },
    { name: 'Leaderboard', path: '/leaderboard' }
  ] : [
    { name: 'Home', path: '/' },
    { name: 'Leaderboard', path: '/leaderboard' }
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              SkillBridge
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`${
                  location.pathname === item.path 
                    ? 'text-blue-600 font-medium' 
                    : 'text-gray-700'
                } hover:text-blue-600 transition`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link 
                  to="/profile"
                  className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center text-white font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-blue-600 text-xs">{user.points || 0} pts</div>
                  </div>
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden">
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className="block text-gray-700"
              >
                {item.name}
              </Link>
            ))}
            {user && (
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="block text-gray-700 font-medium"
              >
                Profile
              </Link>
            )}
            {user ? (
              <button 
                onClick={() => { handleLogout(); setMobileOpen(false); }} 
                className="block w-full text-left text-gray-700"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-gray-700">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="block text-blue-600">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;