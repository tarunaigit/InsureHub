import React, { useState } from 'react';
import { useNavigate, useForm } from 'react-router-dom';
import { FormInput } from '../components/FormInput';
import { Button } from '../components/Button';
import { Input } from '../components/FormInput';

import { Shield, LogIn, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (values) => {
    setLoading(true);
    setError('');
    try {
      await login(values.email, values.password);
      const userRole = user?.role;
      if (userRole === 'ADMIN') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 sm:p-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <div>
            <a href="/register" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Create an account
            </a>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 text-sm">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={e => {
          e.preventDefault();
          onSubmit(e.target.elements as any);
        }} className="space-y-4">
          <FormInput
            label="Email Address"
            type="email"
            error=""
            autoComplete="email"
            required
          />
          <FormInput
            label="Password"
            type="password"
            error=""
            autoComplete="current-password"
            required
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Logging in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
}