import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { plansApi } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PlanCard } from '../components/PlanCard';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/Button';
import { Navbar } from '../components/Navbar';

export function PlansPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadPlans() {
      setLoading(true);
      try {
        const data = await plansApi.getAll();
        setPlans(data);
      } catch (err) {
        console.error('Failed to load plans:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPlans();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {user?.role === 'ADMIN' ? 'Manage Insurance Plans' : 'Insurance Plans'}
            </h1>
            {user?.role === 'ADMIN' && (
              <Link to="/admin-dashboard">
                <Button variant="outline" size="sm">
                  Admin Dashboard
                </Button>
              </Link>
            )}
          </div>

          {loading ? (
            <LoadingSpinner text="Loading plans..." />
          ) : plans.length === 0 ? (
            <EmptyState
              title="No Plans Found"
              description="Insurance plans will appear here once available."
              actionLabel="Browse Plans"
              onAction={() => navigate('/')}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}