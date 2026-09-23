import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { policiesApi } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';
import { PolicyCard } from '../components/PolicyCard';
import { Button } from '../components/Button';
import { Navbar } from '../components/Navbar';
import { Shield, FileText, AlertTriangle, Clock } from 'lucide-react';

export function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    async function loadPolicies() {
      setLoading(true);
      setError('');
      try {
        const data = await policiesApi.getMyPolicies();
        setPolicies(data);
      } catch (err) {
        setError('Failed to load policies. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    loadPolicies();
  }, [isAuthenticated, navigate]);

  const activePolicies = policies.filter(p => p.status === 'ACTIVE' || p.status === 'RENEWED');
  const expiringSoon = policies.filter(p => {
    const expiry = new Date(p.expiryDate);
    const today = new Date();
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0 && (p.status === 'ACTIVE' || p.status === 'RENEWED');
  });

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
            <p className="text-gray-600 mt-1">Manage your insurance policies and stay protected</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{activePolicies.length}</p>
                  <p className="text-sm text-gray-500">Active Policies</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{policies.length}</p>
                  <p className="text-sm text-gray-500">Total Policies</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    ₹{policies.reduce((sum, p) => sum + Number(p.coverageAmount), 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Total Coverage</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{expiringSoon.length}</p>
                  <p className="text-sm text-gray-500">Expiring Soon</p>
                </div>
              </div>
            </div>
          </div>

          {/* Policies List */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Your Policies</h2>
            <Link to="/calculator">
              <Button size="sm">Calculate Premium</Button>
            </Link>
          </div>

          {error && <ErrorMessage message={error} />}

          {loading ? (
            <LoadingSpinner text="Loading your policies..." />
          ) : policies.length === 0 ? (
            <EmptyState
              title="No Policies Found"
              description="You haven't purchased any policies yet. Explore our insurance plans to get started."
              actionLabel="Browse Plans"
              onAction={() => navigate('/plans')}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {policies.map(policy => (
                <PolicyCard
                  key={policy.id}
                  policy={policy}
                  onRenew={() => navigate(`/policy-details/${policy.id}`)}
                  onCancel={() => navigate(`/cancel-policy/${policy.id}`)}
                />
              ))}
            </div>
          )}

          {/* Expiring Soon Alert */}
          {expiringSoon.length > 0 && (
            <div className="mt-8 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-orange-800">Policies Expiring Soon</h3>
                  <p className="text-sm text-orange-600 mt-1">
                    {expiringSoon.length} of your polic{expiringSoon.length === 1 ? 'y is' : 'ies are'} expiring within 30 days.
                    <Link to="/dashboard" className="ml-2 text-orange-700 underline">View details</Link>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}