import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile, PocketCalculation } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calculatePockets } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';
import { validateSalary, validateCost } from '../utils/validators';
import { HOUSING_TYPES, EMERGENCY_FUND_MONTHS } from '../utils/latvian-constants';

export default function Calculator() {
  const { getProfile, saveProfile } = useLocalStorage();
  const navigate = useNavigate();

  // Form state
  const [monthlySalary, setMonthlySalary] = useState<string>('');
  const [housingType, setHousingType] = useState<'rent' | 'mortgage' | 'own'>('rent');
  const [housingCost, setHousingCost] = useState<string>('');
  const [utilitiesCost, setUtilitiesCost] = useState<string>('');
  const [emergencyFundMonths, setEmergencyFundMonths] = useState<3 | 6 | 12>(3);
  const [currentSavings, setCurrentSavings] = useState<string>('0');

  // Calculation result
  const [calculation, setCalculation] = useState<PocketCalculation | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load existing profile or draft on mount
  useEffect(() => {
    // First try to load saved draft (form in progress)
    const draft = localStorage.getItem('pockets_calculator_draft');
    if (draft) {
      try {
        const draftData = JSON.parse(draft);
        setMonthlySalary(draftData.monthlySalary || '');
        setHousingType(draftData.housingType || 'rent');
        setHousingCost(draftData.housingCost || '');
        setUtilitiesCost(draftData.utilitiesCost || '');
        setEmergencyFundMonths(draftData.emergencyFundMonths || 3);
        setCurrentSavings(draftData.currentSavings || '0');
      } catch (error) {
        console.error('Error loading calculator draft:', error);
      }
    }

    // Then load completed profile to show results
    const profile = getProfile();
    if (profile) {
      // If no draft, populate form with profile data
      if (!draft) {
        setMonthlySalary(profile.monthlySalary.toString());
        setHousingType(profile.housingType);
        setHousingCost(profile.housingCost.toString());
        setUtilitiesCost(profile.utilitiesCost.toString());
        setEmergencyFundMonths(profile.emergencyFundMonths);
        setCurrentSavings(profile.currentSavings.toString());
      }

      // Calculate and show results
      const calc = calculatePockets(
        profile.monthlySalary,
        profile.housingCost,
        profile.utilitiesCost,
        profile.emergencyFundMonths
      );
      setCalculation(calc);
      setShowResults(true);
    }
  }, []);

  // Auto-save form draft to localStorage whenever inputs change
  useEffect(() => {
    const draftData = {
      monthlySalary,
      housingType,
      housingCost,
      utilitiesCost,
      emergencyFundMonths,
      currentSavings,
    };

    // Only save if at least one field has a value
    if (monthlySalary || housingCost || utilitiesCost) {
      localStorage.setItem('pockets_calculator_draft', JSON.stringify(draftData));
    }
  }, [monthlySalary, housingType, housingCost, utilitiesCost, emergencyFundMonths, currentSavings]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const salary = parseFloat(monthlySalary);
    const housing = parseFloat(housingCost);
    const utilities = parseFloat(utilitiesCost);

    if (!validateSalary(salary)) {
      newErrors.salary = 'Please enter a valid salary (greater than 0)';
    }
    if (!validateCost(housing)) {
      newErrors.housing = 'Please enter a valid housing cost (0 or greater)';
    }
    if (!validateCost(utilities)) {
      newErrors.utilities = 'Please enter a valid utilities cost (0 or greater)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const salary = parseFloat(monthlySalary);
    const housing = parseFloat(housingCost);
    const utilities = parseFloat(utilitiesCost);
    const savings = parseFloat(currentSavings);

    // Calculate pockets
    const calc = calculatePockets(salary, housing, utilities, emergencyFundMonths);
    setCalculation(calc);
    setShowResults(true);

    // Save profile
    const profile: UserProfile = {
      monthlySalary: salary,
      housingType,
      housingCost: housing,
      utilitiesCost: utilities,
      monthlyDebtPayments: 0, // TODO: Calculate from debts
      currentSavings: savings,
      emergencyFundMonths,
      savingsPercentage: 50,
      createdAt: new Date().toISOString(),
    };
    saveProfile(profile);

    // Clear draft since we've now saved the complete profile
    localStorage.removeItem('pockets_calculator_draft');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">Pocket Calculator</h1>
      <p className="text-gray-600 mb-8">
        Enter your income and expenses to see how much you should save and spend
      </p>

      {/* Calculator Form */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <form onSubmit={handleCalculate}>
          {/* Monthly Salary */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Monthly Salary (Gross) *
            </label>
            <input
              type="number"
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(e.target.value)}
              placeholder="e.g., 2000"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            {errors.salary && <p className="text-accent text-sm mt-1">{errors.salary}</p>}
          </div>

          {/* Housing Type */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-gray-700">Housing Type *</label>
            <select
              value={housingType}
              onChange={(e) => setHousingType(e.target.value as 'rent' | 'mortgage' | 'own')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {HOUSING_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Housing Cost */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Housing Cost (Monthly) *
            </label>
            <input
              type="number"
              value={housingCost}
              onChange={(e) => setHousingCost(e.target.value)}
              placeholder="e.g., 400"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            {errors.housing && <p className="text-accent text-sm mt-1">{errors.housing}</p>}
          </div>

          {/* Utilities Cost */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Utilities (Monthly) *
            </label>
            <input
              type="number"
              value={utilitiesCost}
              onChange={(e) => setUtilitiesCost(e.target.value)}
              placeholder="e.g., 100"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            {errors.utilities && <p className="text-accent text-sm mt-1">{errors.utilities}</p>}
          </div>

          {/* Emergency Fund */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Emergency Fund Target (Months)
            </label>
            <select
              value={emergencyFundMonths}
              onChange={(e) => setEmergencyFundMonths(parseInt(e.target.value) as 3 | 6 | 12)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {EMERGENCY_FUND_MONTHS.map((months) => (
                <option key={months} value={months}>
                  {months} months
                </option>
              ))}
            </select>
          </div>

          {/* Current Savings */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              Current Savings (Optional)
            </label>
            <input
              type="number"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(e.target.value)}
              placeholder="e.g., 500"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-md font-semibold hover:bg-green-600 transition-colors"
          >
            Calculate My Pockets
          </button>
        </form>
      </div>

      {/* Results Display */}
      {showResults && calculation && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Your Pockets</h2>

          <div className="space-y-4 mb-8">
            {/* Gross Salary */}
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-700">Gross Salary</span>
              <span className="font-mono text-lg font-semibold text-gray-900">
                {formatCurrency(calculation.grossSalary)}
              </span>
            </div>

            {/* Taxes */}
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-700">Estimated Taxes (~20%)</span>
              <span className="font-mono text-lg font-semibold text-accent">
                -{formatCurrency(calculation.estimatedTaxes)}
              </span>
            </div>

            {/* Net Income */}
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-700 font-semibold">Net Income</span>
              <span className="font-mono text-lg font-semibold text-primary">
                {formatCurrency(calculation.netIncome)}
              </span>
            </div>

            {/* Mandatory Expenses */}
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="text-gray-700">Mandatory Expenses</span>
              <span className="font-mono text-lg font-semibold text-accent">
                -{formatCurrency(calculation.mandatoryExpenses)}
              </span>
            </div>

            {/* Remaining */}
            <div className="flex justify-between items-center pb-3 border-b-2 border-gray-300">
              <span className="text-gray-700 font-semibold">Remaining</span>
              <span className="font-mono text-xl font-bold text-primary">
                {formatCurrency(calculation.remaining)}
              </span>
            </div>

            {/* Recommended Savings */}
            <div className="bg-green-50 p-4 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-semibold">Recommended Savings (50%)</span>
                <span className="font-mono text-xl font-bold text-primary">
                  {formatCurrency(calculation.recommendedSavings)}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Save this amount each month to build your emergency fund and reach your goals
              </p>
            </div>

            {/* Recommended Lifestyle */}
            <div className="bg-blue-50 p-4 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-semibold">Available for Lifestyle (50%)</span>
                <span className="font-mono text-xl font-bold text-blue-600">
                  {formatCurrency(calculation.recommendedLifestyle)}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Use this for food, transport, entertainment, and other expenses
              </p>
            </div>

            {/* Emergency Fund */}
            <div className="bg-yellow-50 p-4 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-semibold">Emergency Fund Target</span>
                <span className="font-mono text-xl font-bold text-yellow-700">
                  {formatCurrency(calculation.emergencyFundTarget)}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {emergencyFundMonths} months of mandatory expenses for emergencies
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/app/goals')}
              className="flex-1 bg-primary text-white py-3 rounded-md font-semibold hover:bg-green-600 transition-colors"
            >
              Set a Savings Goal
            </button>
            <button
              onClick={() => navigate('/app/info')}
              className="flex-1 bg-secondary text-white py-3 rounded-md font-semibold hover:bg-gray-600 transition-colors"
            >
              Find Financial Advisor
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
