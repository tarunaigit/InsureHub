import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { policiesApi } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { Navbar } from '../components/Navbar';
import { Shield, Calendar, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

export function PolicyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    async function loadPolicyData() {
      setLoading(true);
      setError('');
      try {
        const [policyData, historyData] = await Promise.all([
          policiesApi.getById(parseInt(id)),
          policiesApi.getHistory(parseInt(id))
        ]);
        setPolicy(policyData);
        setHistory(historyData.actionList || []);
      } catch (err) {
        setError('Failed to load policy details.');
      } finally {
        setLoading(false);
      }
    }
    loadPolicyData();
  }, [id]);

  const handleCancel = async () => {
    if (!cancelReason.trim()) return;
    setCancelLoading(true);
    try {
      await policiesApi.cancel(parseInt(id), cancelReason);
      setShowCancelModal(false);
      setCancelReason('');
      // Reload data
      const [policyData, historyData] = await Promise.all([
        policiesApi.getById(parseInt(id)),
        policiesApi.getHistory(parseInt(id))
      ]);
      setPolicy(policyData);
      setHistory(historyData.actionList || []);
    } catch (err) {
      setError('Failed to submit cancellation request.');
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-12">
        <LoadingSpinner text="Loading policy details..." />
      </main>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-12 max-w-7xl mx-auto px-4">
        <ErrorMessage message={error} onRetry={() => navigate(`/policy-details/${id}`)} />
      </main>
    </div>
  );

  if (!policy) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-12">
        <EmptyState title="Policy Not Found" description="The requested policy could not be found." actionLabel="Back to Dashboard" onAction={() => navigate('/dashboard')} />
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4 inline-block">
            ← Back to Dashboard
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Policy Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Policy Header */}
              <Card className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                    <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Shield className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{policy.policyNumber}</h1>
                      <p className="text-gray-500">{policy.planName}</p>
                    </div>
                  </div>
                  <StatusBadge status={policy.status} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Premium</p>
                    <p className="text-xl font-bold text-gray-800">₹{Number(policy.premium).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Coverage Amount</p>
                    <p className="text-xl font-bold text-gray-800">₹{Number(policy.coverageAmount).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Duration</p>
                    <p className="text-xl font-bold text-gray-800">{policy.durationYears} Year(s)</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Start Date</p>
                    <p className="text-xl font-bold text-gray-800">{new Date(policy.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Expiry Date</p>
                    <p className="text-xl font-bold text-gray-800">{new Date(policy.expiryDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Plan Type</p>
                    <p className="text-xl font-bold text-gray-800">{policy.planType}</p>
                  </div>
                </div>
              </Card>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                {policy.status === 'ACTIVE' && (
                  <>
                    <Button variant="primary" className="flex-1" onClick={() => navigate(`/policy-details/${policy.id}`)}>
                      <Calendar className="w-4 h-4 mr-2" />
                      Renew Policy
                    </Button>
                    <Button variant="danger" className="flex-1" onClick={() => setShowCancelModal(true)}>
                      <XCircle className="w-4 h-4 mr-2" />
                      Request Cancellation
                    </Button>
                  </>
                )}
              </div>

              {/* Policy History */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Policy History</h2>
                {history.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No history available.</p>
                ) : (
                  <div className="space-y-3">
                    {history.map((entry, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="font-medium text-gray-800">{entry.action}</p>
                            <p className="text-xs text-gray-400">{new Date(entry.timestamp).toLocaleString()}</p>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{entry.description}</p>
                          <p className="text-xs text-gray-400 mt-1">Performed by: {entry.performedBy}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {policy.status === 'ACTIVE' && (
                    <>
                      <Button variant="primary" className="w-full" onClick={() => navigate(`/policy-details/${policy.id}`)}>
                        Renew Policy
                      </Button>
                      <Button variant="danger" className="w-full" onClick={() => setShowCancelModal(true)}>
                        Cancel Policy
                      </Button>
                    </>
                  )}
                  <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard')}>
                    Back to Dashboard
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Policy Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <StatusBadge status={policy.status} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Duration</span>
                    <span className="text-gray-800">{policy.durationYears} Year(s)</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Cancel Policy Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Request Cancellation"
      >
        <p className="text-gray-600 mb-4">Are you sure you want to cancel this policy? This action requires admin approval.</p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Cancellation</label>
          <textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            rows={4}
            placeholder="Please provide a reason..."
          />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setShowCancelModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" className="flex-1" onClick={handleCancel} disabled={cancelLoading || !cancelReason.trim()}>
            {cancelLoading ? 'Submitting...' : 'Submit Request'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}