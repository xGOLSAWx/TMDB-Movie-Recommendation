// src/auth/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // make sure this exists and exports auth

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Invalid credentials.');
    }
  };

  return (
    <div className="text-white p-6 max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
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
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white"
          required
        />
        <button type="submit" className="bg-blue-600 px-4 py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
