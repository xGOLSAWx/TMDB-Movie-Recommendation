// src/auth/Signup.js
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase'; // make sure this points to your firebase config
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { user } = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(user, { displayName: form.name });

      // Optional: save additional info like phone to Firestore if needed later

      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Signup failed.');
    }
  };

  return (
    <div className="text-white p-6 max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Signup</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white"
          required
        />
        <input
          name="phone"
          type="text"
          placeholder="Phone (optional)"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white"
          required
        />
        <button type="submit" className="bg-blue-600 px-4 py-2 rounded">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
