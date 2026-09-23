import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { plansApi, quoteApi, policiesApi } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { FormInput } from '../components/FormInput';
import { Navbar } from '../components/Navbar';
import { Calculator, Shield } from 'lucide-react';

export function PremiumCalculatorPage() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [age, setAge] = useState('');
  const [coverageAmount, setCoverageAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [quoteResult, setQuoteResult] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPlans() {
      setLoadingPlans(true);
      setError('');
      try {
        const data = await plansApi.getAll();
        setPlans(data);
      } catch (err) {
        setError('Failed to load plans. Please try again.');
      } finally {
        setLoadingPlans(false);
      }
    }
    loadPlans();
  }, []);

  const handleCalculate = async (e) => {
    e.preventDefault();

    if (!selectedPlan || !age || !coverageAmount || !duration) {
      setError('Please fill in all fields.');
      return;
    }

    setCalculating(true);
    setError('');
    setQuoteResult(null);

    try {
      const result = await quoteApi.calculate({
        planId: parseInt(selectedPlan),
        age: parseInt(age),
        coverageAmount: parseFloat(coverageAmount),
        duration: parseInt(duration)
      });
      setQuoteResult({ ...result, planId: parseInt(selectedPlan) });
    } catch (err) {
      setError('Failed to calculate premium. Please try again.');
    } finally {
      setCalculating(false);
    }
  };

  const handlePurchase = async () => {
    try {
      await policiesApi.create({
        planId: quoteResult.planId,
        premium: quoteResult.finalPremium,
        coverageAmount: parseFloat(coverageAmount),
        duration: parseInt(duration)
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to purchase policy. Please try again.');
    }
  };

  const selectedPlanData = plans.find(p => p.id === parseInt(selectedPlan));

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-12 pb-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Premium Calculator</h1>
          <p className="text-gray-600 mb-6">
            Calculate your insurance premium based on your details. This is a project simulation formula.
          </p>

          {error && <ErrorMessage message={error} onRetry={() => setError('')} />}

          <form onSubmit={handleCalculate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Plan</label>
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a plan...</option>
                {plans.map(plan => (
                  <option key={plan.id} value={plan.id}>{plan.name} ({plan.type})</option>
                ))}
              </select>
            </div>

            <FormInput
              label="Your Age"
              type="number"
              min="18"
              max="100"
              error=""
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g., 30"
            />

            <FormInput
              label="Coverage Amount (₹)"
              type="number"
              min="10000"
              error=""
              value={coverageAmount}
              onChange={(e) => setCoverageAmount(e.target.value)}
              placeholder="e.g., 500000"
            />

            <FormInput
              label="Duration (Years)"
              type="number"
              min="1"
              max="30"
              error=""
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 1"
            />

            <Button type="submit" variant="primary" className="w-full" disabled={calculating}>
              {calculating ? 'Calculating...' : 'Calculate Premium'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}