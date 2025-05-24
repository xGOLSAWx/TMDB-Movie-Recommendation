import React, { useEffect, useState } from 'react';

const ReviewPage = () => {
  const [reviews, setReviews] = useState([]);
  const [isDeveloper, setIsDeveloper] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const adminUsername = process.env.REACT_APP_ADMIN_USERNAME;
  const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;

  useEffect(() => {
    const savedReviews = JSON.parse(localStorage.getItem('reviews')) || [];
    setReviews(savedReviews);
  }, []);

  const deleteReview = (indexToDelete) => {
    const updatedReviews = reviews.filter((_, index) => index !== indexToDelete);
    setReviews(updatedReviews);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));
  };

  const maskEmail = (email) => {
    if (!email) return '';
    const [user, domain] = email.split('@');
    return `${user[0]}***@${domain}`;
  };

  const maskPhone = (phone) => {
    if (!phone) return '';
    return phone.replace(/\d(?=\d{2})/g, '*'); // mask all but last 2 digits
  };

  const handleLogin = () => {
    if (username === adminUsername && password === adminPassword) {
      setIsDeveloper(true);
      setShowLogin(false);
      setUsername('');
      setPassword('');
      setError('');
    } else {
      setError('Invalid username or password.');
    }
  };

  const handleLogout = () => {
    setIsDeveloper(false);
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen p-8 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-yellow-400">What Our Users Say</h1>

        {isDeveloper ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white font-semibold px-4 py-2 rounded hover:bg-red-400 transition"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="bg-yellow-500 text-black font-semibold px-4 py-2 rounded hover:bg-yellow-400 transition"
          >
            Developer Login
          </button>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="text-center">No reviews available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-xl shadow-lg relative">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-yellow-400">{review.name}</h3>
                <div>
                  {[...Array(parseInt(review.rating))].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
              </div>

              {review.email && (
                <p className="text-sm text-gray-400">
                  {isDeveloper ? review.email : maskEmail(review.email)}
                </p>
              )}

              {review.phone && (
                <p className="text-sm text-gray-400">
                  {isDeveloper ? review.phone : maskPhone(review.phone)}
                </p>
              )}

              <p className="mt-3 text-white">{review.message}</p>

              {isDeveloper && (
                <button
                  onClick={() => deleteReview(index)}
                  className="absolute top-2 right-2 text-sm text-red-400 hover:text-red-600"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-sm text-black shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-center text-indigo-700">Admin Login</h2>
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex justify-between">
              <button
                onClick={handleLogin}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500 transition"
              >
                Login
              </button>
              <button
                onClick={() => {
                  setShowLogin(false);
                  setUsername('');
                  setPassword('');
                  setError('');
                }}
                className="text-gray-500 hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewPage;
