import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { plansApi } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Navbar } from '../components/Navbar';
import { Shield, Calendar, FileText, Clock, CheckCircle } from 'lucide-react';

export function PlanDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPlan() {
      setLoading(true);
      setError('');
      try {
        const data = await plansApi.getById(parseInt(id));
        setPlan(data);
      } catch (err) {
        setError('Failed to load plan details. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    loadPlan();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-12">
        <LoadingSpinner text="Loading plan details..." />
      </main>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-12 max-w-7xl mx-auto px-4">
        <ErrorMessage message={error} onRetry={() => navigate('/plans')} />
      </main>
    </div>
  );

  if (!plan) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-12">
        <EmptyState title="Plan Not Found" description="The requested plan could not be found." actionLabel="Back to Plans" onAction={() => navigate('/plans')} />
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link to="/plans" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              ← Back to Plans
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{plan.name}</h1>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 mt-2">
                      {plan.type}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">{plan.description}</p>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-500">Duration</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{plan.durationYears} Year(s)</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-500">Status</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{plan.status}</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Plan Features</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">Comprehensive coverage for {plan.type.toLowerCase()} insurance</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">Instant policy issuance and digital delivery</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">24/7 customer support and claims assistance</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">Easy renewal and cancellation process</span>
                    </li>
                  </ul>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Plan Summary</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Base Premium</span>
                    <span className="font-bold text-gray-800">₹{Number(plan.basePremium).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Max Coverage</span>
                    <span className="font-bold text-gray-800">₹{Number(plan.coverageAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Duration</span>
                    <span className="font-bold text-gray-800">{plan.durationYears} Year(s)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Status</span>
                    <span className="font-bold text-gray-800">{plan.status}</span>
                  </div>
                </div>

                <Link to="/calculator" className="block">
                  <Button variant="primary" size="lg" className="w-full">
                    <Calendar className="w-5 h-5 mr-2" />
                    Calculate Premium
                  </Button>
                </Link>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Premium calculation is a project simulation. Actual insurance premiums may vary.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}