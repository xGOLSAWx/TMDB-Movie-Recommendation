import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ContactPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    rating: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRating = (rate) => {
    setFormData({ ...formData, rating: rate });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    const existingReviews = JSON.parse(localStorage.getItem('reviews')) || [];
    const updatedReviews = [...existingReviews, formData];
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));

    setSubmitting(false);
    navigate('/reviews');
  };

  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 text-white py-10 px-4 min-h-screen flex justify-center">
      <div className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400">Contact Us & Leave a Review</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Name *</label>
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-yellow-400"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Phone (Optional)</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-yellow-400"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Email *</label>
            <input
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-yellow-400"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Message *</label>
            <textarea
              required
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring focus:ring-yellow-400"
            ></textarea>
          </div>
          <div>
            <label className="block mb-1 font-medium">Rating *</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`cursor-pointer text-3xl ${formData.rating >= star ? 'text-yellow-400' : 'text-gray-500'}`}
                  onClick={() => handleRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-4 bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 rounded focus:outline-none"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;