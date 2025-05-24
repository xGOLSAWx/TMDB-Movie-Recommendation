import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { getCurrentUser, logoutUser } from '../auth/authUtils';

const Navbar = () => {
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search/${query}`);
      setQuery('');
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAccountDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav className="bg-black bg-opacity-80 text-white px-4 py-2 shadow-lg">
        {/* Website Title - Centered */}
        <div className="text-2xl font-extrabold uppercase text-center mb-2">
          <Link to="/">TMDB Movie App</Link>
        </div>

        {/* Horizontal Menu Bar with ☰ icon before Home */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <ul className="flex flex-wrap gap-4 text-sm font-semibold items-center justify-center md:justify-start mb-2 md:mb-0">
            <li>
              <button onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </li>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/netflix">Netflix Picks</Link></li>
            <li><Link to="/hotstar">Hotstar Picks</Link></li>
            <li><Link to="/webseries">Web-Series</Link></li>
            <li><Link to="/indian-movies">Indian Movies</Link></li>
            <li><Link to="/actors">Actor Details</Link></li>
            <li><Link to="/favorites" className="text-yellow-400">★ Favorite Page</Link></li>
            <li><Link to="/genres">Genres</Link></li>

            {!user ? (
              <>
                <li><Link to="/login" className="text-blue-400 hover:underline">Login</Link></li>
                <li><Link to="/signup" className="text-blue-400 hover:underline">Signup</Link></li>
              </>
            ) : (
              <>
                <li className="text-yellow-300">Hi, {user.displayName}</li>
                <li className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowAccountDropdown(prev => !prev)}
                    className="text-red-400 hover:underline"
                  >
                    Account
                  </button>
                  {showAccountDropdown && (
                    <ul
                      className="absolute right-0 bg-gray-900 border border-gray-700 mt-2 w-40 py-2 rounded shadow-lg z-50"
                      onMouseEnter={() => setShowAccountDropdown(true)}
                      onMouseLeave={() => setShowAccountDropdown(false)}
                    >
                      <li>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 hover:bg-red-600"
                        >
                          Logout
                        </button>
                      </li>
                      <li>
                        <Link
                          to="/delete-account"
                          className="block px-4 py-2 text-left text-red-400 hover:bg-red-600"
                        >
                          Delete Account
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              </>
            )}
          </ul>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex justify-center md:justify-end items-center mt-2 md:mt-0">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies..."
              className="px-2 py-1 rounded-l text-black"
            />
            <button
              type="submit"
              className="bg-red-600 px-3 py-1 rounded-r hover:bg-red-500"
            >
              Search
            </button>
          </form>
        </div>
      </nav>

      {/* Mobile Sidebar Menu */}
      {menuOpen && (
        <div className="fixed top-0 left-0 w-72 h-full bg-black bg-opacity-30 backdrop-blur-md text-white z-50 p-6 overflow-y-auto shadow-2xl border border-white/10 rounded-r-xl">
          <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 text-white">
            <X size={24} />
          </button>

          <h2 className="text-green-400 font-bold uppercase mb-2">★ Rankings ★</h2>
          <ul className="mb-4 space-y-2">
            <li><Link to="/highest-grossing">Highest Grossing Movies</Link></li>
            <li><Link to="/top-rated">Top Rated Movies</Link></li>
            <li><Link to="/rankings">Rankings</Link></li>
          </ul>

          <h2 className="text-blue-400 font-bold uppercase mb-2">★ Web Series ★</h2>
          <ul className="mb-4 space-y-2"><li><Link to="/webseries">Web Series</Link></li></ul>

          <h2 className="text-pink-400 font-bold uppercase mb-2">★ Genres ★</h2>
          <ul className="mb-4 space-y-2"><li><Link to="/genres">Genres</Link></li></ul>

          <h2 className="text-purple-400 font-bold uppercase mb-2">★ Movie By Alphabet ★</h2>
          <ul className="mb-4 space-y-2"><li><Link to="/by-alphabet">A-Z Movies</Link></li></ul>

          <h2 className="text-red-400 font-bold uppercase mb-2">★ Indian Movies ★</h2>
          <ul className="mb-4 space-y-2"><li><Link to="/indian-movies">Indian Movies</Link></li></ul>

          <h2 className="text-yellow-400 font-bold uppercase mb-2">★ Favorite Page ★</h2>
          <ul className="mb-4 space-y-2"><li><Link to="/favorites">My Favorites</Link></li></ul>

          <h2 className="text-yellow-400 font-bold uppercase mb-2">★ Movies By Year ★</h2>
          <ul className="mb-4 space-y-2"><li><Link to="/by-year">Movies by Year</Link></li></ul>

          <h2 className="text-yellow-400 font-bold uppercase mb-2">★ Latest ★</h2>
          <ul className="mb-4 space-y-2"><li><Link to="/latest">Latest</Link></li></ul>
          
          <h2 className="text-yellow-400 font-bold uppercase mb-2">★ Actor ★</h2>
          <ul className="mb-4 space-y-2"><li><Link to="/actors">Actors (Female and Male) </Link></li></ul>

          <h2 className="text-orange-400 font-bold uppercase mb-2">Top Platform</h2>
          <ul className="mb-4 space-y-2"><li><Link to="/hotstar">Hotstar</Link></li>
          <li><Link to="/netflix">Netflix</Link></li></ul>

          <h2 className="text-blue-400 font-bold uppercase mb-2">Contacts</h2>
          <ul className="mb-4 space-y-2">
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/reviews">Review</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>

          {user && (
            <>
              <h2 className="text-red-400 font-bold uppercase mb-2">Account</h2>
              <ul className="mb-4 space-y-2">
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-600"
                  >
                    Logout
                  </button>
                </li>
                <li>
                  <Link to="/delete-account" className="text-red-500 hover:text-red-700">
                    Delete Account
                  </Link>
                </li>
              </ul>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
