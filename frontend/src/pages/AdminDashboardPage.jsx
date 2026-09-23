import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminApi } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { Navbar } from '../components/Navbar';
import { Shield, BarChart3, FileText, AlertTriangle, Clock } from 'lucide-react';

export function AdminDashboardPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cancellationRequests, setCancellationRequests] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
      return;
    }
    async function loadData() {
      setLoading(true);
      setError('');
      try {
        const requests = await adminApi.getCancellationRequests();
        setCancellationRequests(requests);
      } catch (err) {
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage policies and cancellation requests</p>
            </div>
            <div className="hidden sm:block">
              <Button variant="secondary" size="sm" onClick={() => navigate('/admin/cancellation-requests')}>
                <Shield className="w-4 h-4 mr-1" />
                View Cancellations
              </Button>
            </div>
          </div>

          {error && <ErrorMessage message={error} />}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pending Cancellations */}
            <Card className="lg:col-span-2">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  Pending Cancellation Requests ({cancellationRequests.length})
                </h2>
                {loading ? (
                  <LoadingSpinner text="Loading cancellation requests..." />
                ) : cancellationRequests.length === 0 ? (
                  <p className="text-gray-500 text-sm py-4">No pending cancellation requests.</p>
                ) : (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {cancellationRequests.map((req) => (
                      <div key={req.id} className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{req.policyNumber}</p>
                            <p className="text-sm text-gray-500">
                              {req.customerName} ({req.customerEmail})
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-orange-600">{req.status}</p>
                            <p className="text-xs text-gray-400">{new Date(req.requestedAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="mt-3 p-3 bg-orange-50 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Reason:</p>
                          <p className="text-xs text-gray-600">{req.reason}</p>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            className="flex-1"
                            onClick={() => navigate('/admin/cancellation-requests')}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Stats Cards */}
            <div className="space-y-6">
              <Card>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Policy Overview</h3>
                  <p className="text-3xl font-bold text-gray-900">25</p>
                  <p className="text-sm text-gray-500">Active Policies</p>
                </div>
              </Card>
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h3>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li><a href="/admin/cancellation-requests" className="hover:text-blue-600">View All Cancellation Requests</a></li>
                    <li><a href="#" className="hover:text-blue-600">Generate Reports</a></li>
                    <li><a href="#" className="hover:text-blue-600">Send Notifications</a></li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>

          {/* Bottom section */}
          <div className="mt-8 pt-8 border-t border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">This Week</h3>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li><span>3 new policies purchased</span></li>
                    <li><span>1 cancellation approved</span></li>
                    <li><span>2 policies renewed</span></li>
                  </ul>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Upcoming</h3>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li><span>5 policies expiring soon</span></li>
                    <li><span>3 pending approvals</span></li>
                  </ul>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Insurance Plans</h3>
                  <p className="text-gray-500 text-sm">6 active plans available</p>
                  <Button variant="outline" size="sm" className="w-full text-left mt-3">
                    Manage Plans →
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}