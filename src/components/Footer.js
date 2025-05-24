import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-white text-center py-4 mt-0">
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-2 text-sm">
        <Link to="/about" className="hover:underline text-blue-400">About</Link>
        <Link to="/contact" className="hover:underline text-blue-400">Contact</Link>
        <Link to="/reviews" className="hover:underline text-blue-400">Review</Link>
      </div>
      <p className="text-xs">&copy; 2025 GOLSAW | TMDB Movie Recommendation WebApp</p>
    </footer>
  );
};

export default Footer;