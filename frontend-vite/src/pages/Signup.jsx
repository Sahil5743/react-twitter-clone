import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const { signup } = useContext(AuthContext);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(''); // Clear error on input change
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signup(form.username.trim(), form.email.trim(), form.password);
      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
  onSubmit={onSubmit}
  className="max-w-md mx-auto p-6 space-y-6 bg-[#15202b] text-white rounded-xl shadow-md border border-gray-700"
>
  <h1 className="text-2xl font-extrabold text-center text-white">Create your account</h1>

  {error && <p className="text-red-500 text-center">{error}</p>}

  <label className="block">
    <span className="mb-1 block font-medium text-gray-300">Username</span>
    <input
      name="username"
      type="text"
      value={form.username}
      onChange={onChange}
      placeholder="Enter username"
      required
      minLength={3}
      className="w-full p-3 rounded-md border border-gray-600 bg-[#192734] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
    />
  </label>

  <label className="block">
    <span className="mb-1 block font-medium text-gray-300">Email</span>
    <input
      name="email"
      type="email"
      value={form.email}
      onChange={onChange}
      placeholder="Enter email"
      required
      className="w-full p-3 rounded-md border border-gray-600 bg-[#192734] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
    />
  </label>

  <label className="block">
    <span className="mb-1 block font-medium text-gray-300">Password</span>
    <input
      name="password"
      type="password"
      value={form.password}
      onChange={onChange}
      placeholder="Enter password"
      required
      minLength={6}
      className="w-full p-3 rounded-md border border-gray-600 bg-[#192734] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]"
    />
  </label>

  <button
    type="submit"
    disabled={loading}
    className="w-full bg-[#1DA1F2] text-black font-semibold py-3 rounded-md hover:bg-[#1a8cd8] transition disabled:opacity-60 disabled:cursor-not-allowed"
  >
    {loading ? 'Signing up...' : 'Sign up'}
  </button>
</form>

  );
}
