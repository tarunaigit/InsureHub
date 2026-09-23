import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { policiesApi } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { Navbar } from '../components/Navbar';
import { XCircle, Shield, CheckCircle } from 'lucide-react';

export function CancelPolicyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadPolicy() {
      setLoading(true);
      setError('');
      try {
        const data = await policiesApi.getById(parseInt(id));
        setPolicy(data);
      } catch (err) {
        setError('Failed to load policy.');
      } finally {
        setLoading(false);
      }
    }
    loadPolicy();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide a reason for cancellation.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await policiesApi.cancel(parseInt(id), reason);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to submit cancellation request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-12">
        <LoadingSpinner text="Loading policy..." />
      </main>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-12 max-w-7xl mx-auto px-4">
        <ErrorMessage message={error} onRetry={() => navigate('/dashboard')} />
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <button onClick={() => navigate('/dashboard')} className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-3">
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Request Cancellation</h1>
            <p className="text-gray-600 mt-1">Cancel policy {policy.policyNumber} ({policy.planName})</p>
          </div>

          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-800">{policy.policyNumber}</p>
                <p className="text-sm text-gray-500">{policy.planName}</p>
              </div>
              <StatusBadge status={policy.status} className="ml-auto" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Cancellation</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={5}
                  placeholder="Please explain why you want to cancel this policy..."
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-700 flex items-start space-x-2">
                <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p>This request will be reviewed by an administrator. You will be notified once a decision is made.</p>
              </div>

              {error && <ErrorMessage message={error} />}

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => navigate('/dashboard')}>
                  Cancel
                </Button>
                <Button variant="danger" className="flex-1" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}