import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminApi } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Navbar } from '../components/Navbar';
import { Shield, CheckCircle, XCircle } from 'lucide-react';

export function AdminCancellationRequestsPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [comment, setComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
      return;
    }

    async function loadRequests() {
      setLoading(true);
      setError('');
      try {
        const data = await adminApi.getCancellationRequests();
        setRequests(data);
      } catch (err) {
        setError('Failed to load cancellation requests.');
      } finally {
        setLoading(false);
      }
    }
    loadRequests();
  }, [isAdmin, navigate]);

  const handleApprove = async () => {
    if (!selectedRequest) return;
    setActionLoading(true);
    try {
      await adminApi.approveCancellation(selectedRequest.id, {
        adminName: 'Admin',
        comment: comment || 'Approved by admin'
      });
      setRequests(requests.map(r =>
        r.id === selectedRequest.id ? { ...r, status: 'APPROVED', adminComment: comment } : r
      ));
      setShowModal(false);
    } catch (err) {
      setError('Failed to approve cancellation. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    setActionLoading(true);
    try {
      await adminApi.rejectCancellation(selectedRequest.id, {
        adminName: 'Admin',
        comment: comment || 'Rejected by admin'
      });
      setRequests(requests.map(r =>
        r.id === selectedRequest.id ? { ...r, status: 'REJECTED', adminComment: comment } : r
      ));
      setShowModal(false);
    } catch (err) {
      setError('Failed to reject cancellation. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Cancellation Requests</h1>
            <p className="text-gray-600">Review and manage policy cancellation requests</p>
          </div>

          {error && <ErrorMessage message={error} />}

          {loading ? (
            <LoadingSpinner text="Loading cancellation requests..." />
          ) : requests.length === 0 ? (
            <EmptyState
              title="No Pending Requests"
              description="All cancellation requests have been processed."
              actionLabel="Admin Dashboard"
              onAction={() => navigate('/admin-dashboard')}
            />
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id} className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-semibold text-gray-800">{request.policyNumber}</span>
                        <StatusBadge status={request.status} />
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><span className="font-medium">Customer:</span> {request.customerName} ({request.customerEmail})</p>
                        <p><strong className="text-gray-800">Plan:</strong> {request.planName}</p>
                        <p><strong className="text-gray-800">Reason:</strong> {request.reason}</p>
                        {request.adminComment && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                            <strong className="text-gray-600">Admin Note:</strong> {request.adminComment}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs text-gray-400">
                        {new Date(request.requestedAt).toLocaleString()}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowModal(true);
                          }}
                        >
                          Review
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Review Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Review Cancellation Request"
      >
        {selectedRequest && (
          <div>
            <div className="mb-4 p-3 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Policy:</span> {selectedRequest.policyNumber}<br />
                <span className="font-medium">Customer:</span> {selectedRequest.customerName}<br />
                <span className="font-medium">Plan:</span> {selectedRequest.planName}<br />
                <span className="font-medium">Reason:</span> {selectedRequest.reason}
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Add a comment..."
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="primary"
                className="flex-1"
                onClick={handleApprove}
                disabled={actionLoading}
              >
                {actionLoading ? 'Processing...' : 'Approve'}
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={handleReject}
                disabled={actionLoading}
              >
                {actionLoading ? 'Processing...' : 'Reject'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}