
import React from 'react';
import './AnimatedBackground.css';

const AnimatedBackground = () => {
  return (
    <div className="animated-pattern">
      {/* Thin pattern overlay */}
      <div className="pattern-overlay" />

      {/* Animated gradient */}
      <div className="animated-gradient" />

      {/* Animated wave SVG */}
      <svg
        className="wave-svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill="#4f46e5"
          fillOpacity="0.3"
          d="M0,192L80,186.7C160,181,320,171,480,160C640,149,800,139,960,144C1120,149,1280,171,1360,181.3L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
        ></path>
      </svg>
    </div>
  );
};

export default AnimatedBackground;
