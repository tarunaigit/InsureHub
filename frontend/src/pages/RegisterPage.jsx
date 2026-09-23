import React, { useState } from 'react';
import { useNavigate, useForm } from 'react-router-dom';
import { FormInput } from '../components/FormInput';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (values) => {
    setLoading(true);
    setError('');
    try {
      await register(values.name, values.email, values.password, values.phone);
      navigate('/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 sm:p-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
          <div>
            <a href="/login" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Already have an account?
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
            label="Full Name"
            type="text"
            error=""
            autoComplete="name"
            required
          />
          <FormInput
            label="Email Address"
            type="email"
            error=""
            autoComplete="email"
            required
          />
          <FormInput
            label="Phone Number"
            type="tel"
            error=""
            autoComplete="tel"
            required
          />
          <FormInput
            label="Password"
            type="password"
            error=""
            autoComplete="new-password"
            required
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Registering...' : 'Create Account'}
          </Button>
        </form>
      </div>
    </div>
  );
}