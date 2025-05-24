// src/pages/DeleteAccount.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../auth/authUtils';

const DeleteAccount = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    console.log("DeleteAccount: invoking deleteUser with password", password ? "••••" : "<empty>");
    const { success, message } = await deleteUser(password);
    setLoading(false);

    if (success) {
      console.log("DeleteAccount: successfully deleted account");
      navigate('/signup');
    } else {
      console.warn("DeleteAccount: failed to delete:", message);
      setError(message || 'Failed to delete account.');
    }
  };

  return (
    <div className="text-white p-6 pt-20 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Delete Account</h1>
      <p className="mb-4">To confirm, please enter your password:</p>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <input
        type="password"
        placeholder="Current password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full p-2 mb-4 rounded bg-gray-800 text-white"
      />
      <button
        onClick={handleDelete}
        disabled={loading || !password}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded w-full"
      >
        {loading ? 'Deleting…' : 'Yes, delete my account'}
      </button>
    </div>
  );
};

export default DeleteAccount;
