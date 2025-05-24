import React from 'react';
import { Github, Linkedin, Code } from 'lucide-react'; // `Code` icon used for HackerRank

const About = () => {
  return (
    <div className="p-8 text-white">
      <div className="bg-gradient-to-br from-purple-600 to-indigo-800 p-6 rounded-lg shadow-lg mb-8">
        <h1 className="text-4xl font-bold text-yellow-300 mb-4">ABOUT THE TMDB RECOMMENDATION SYSTEM</h1>
        <p className="text-lg leading-relaxed text-white">
          This web application leverages the power of The Movie Database (TMDB) API to bring users an intuitive and intelligent platform to discover movies. Whether you're looking for trending movies, genre-based browsing, or Netflix-specific recommendations, this app has you covered.
        </p>
      </div>

      <div className="bg-white text-black p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-2">🎯 HOW IT WORKS</h2>
        <p className="text-md leading-relaxed">
          Our recommendation engine utilizes TMDB's real-time API to fetch and filter movie data. The app includes search suggestions, filters by genre and provider (like Netflix), and lets users browse popular, latest, and trending content. Movie cards are clickable for more detailed information.
        </p>
      </div>

      <div className="bg-green-100 text-black p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-green-800 mb-2">🌐 DEPLOYMENT</h2>
        <p className="text-md leading-relaxed">
          This application is deployed on <span className="font-bold">Netlify</span>, ensuring seamless performance and accessibility. Netlify handles the continuous integration and delivery, making the app fast, secure, and easy to update.
        </p>
      </div>

      <div className="bg-yellow-100 text-black p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-yellow-700 mb-2">🔧 TECH STACK</h2>
        <ul className="list-disc pl-5">
          <li>React.js for Frontend</li>
          <li>Tailwind CSS for Styling</li>
          <li>Axios for API Requests</li>
          <li>React Router for Navigation</li>
          <li>TMDB API for Movie Data</li>
          <li>FireBase for Online Database and Authentication</li>
        </ul>
      </div>

      <div className="bg-yellow-100 text-black p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-yellow-700 mb-2">For Personal Contact</h2>
        <ul className="list-disc pl-5">
          <li>You can review In Through Contact</li>
          <li>Don't worry your Email adress Is safe</li>
          <li>You don't need to login with your own Email</li>
          <li>You can use Fake Email</li>
          <li>But That Data is Saved for security purpose</li>
          <li>Spam Id will Get Deleted due to Online Data Scenerio  ASAP</li>
          <li>Have Fun</li>
          <li>Genre page card are bit glitchy,will Give error sometime ,but Works lately
            just wait reload or Stay Away from that Page ......
          </li>
        </ul>
      </div>

      {/* 👇 Developer Section */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center">
        <p className="mb-4 text-lg">Developed by <span className="font-semibold text-yellow-400">Abhishek Raj</span></p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://github.com/xGOLSAWx"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg transition-colors"
          >
            <Github className="w-5 h-5" />
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/abhishek-raj-5a7a50175/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-600 border border-blue-900 rounded-lg transition-colors"
          >
            <Linkedin className="w-5 h-5" />
            LinkedIn
          </a>
          <a
            href="https://www.hackerrank.com/profile/golsaw27t269053"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="HackerRank Profile"
            className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-600 border border-green-900 rounded-lg transition-colors"
          >
            <Code className="w-5 h-5" />
            HackerRank
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
