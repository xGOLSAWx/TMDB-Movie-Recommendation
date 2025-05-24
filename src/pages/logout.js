// src/pages/Logout.js
import React, { useEffect } from 'react';
import { logoutUser } from '../auth/authUtils';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    logoutUser();
    navigate('/login'); // Redirect after logout
  }, [navigate]);

  return (
    <div className="text-white p-6">Logging you out...</div>
  );
};

export default Logout;
