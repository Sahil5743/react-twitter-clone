import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaTwitter } from 'react-icons/fa';


export default function Login() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
  onSubmit={onSubmit}
  className="w-full max-w-sm mx-auto mt-20 px-8 py-10 bg-[#15202b] rounded-xl shadow-lg space-y-6 border border-[#38444d]"
  noValidate
  aria-describedby="login-error"
>
  <div className="flex justify-center mb-4">
    <FaTwitter className="text-sky-400 text-4xl" />
  </div>

  <h2 className="text-2xl text-white font-bold text-center">Sign in to Twitter</h2>

  {error && (
    <div
      id="login-error"
      className="bg-red-600 text-white p-2 rounded text-sm text-center"
      role="alert"
      aria-live="assertive"
    >
      {error}
    </div>
  )}

  <input
    name="email"
    type="email"
    placeholder="Email"
    required
    value={form.email}
    onChange={onChange}
    className="w-full p-3 rounded-md border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
    autoComplete="email"
    aria-invalid={error ? 'true' : 'false'}
  />

  <input
    name="password"
    type="password"
    placeholder="Password"
    required
    value={form.password}
    onChange={onChange}
    className="w-full p-3 rounded-md border border-gray-600 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
    autoComplete="current-password"
    aria-invalid={error ? 'true' : 'false'}
  />

  <button
    type="submit"
    disabled={loading}
    className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-md transition disabled:opacity-50"
  >
    {loading ? 'Logging in...' : 'Login'}
  </button>

  <p className="text-center text-gray-400 text-sm">
    Don't have an account? <a href="/signup" className="text-sky-400 hover:underline">Sign up</a>
  </p>
</form>
  );
}
