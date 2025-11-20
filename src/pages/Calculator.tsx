import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserProfile, PocketCalculation } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calculatePockets } from '../utils/calculations';
import { calculateTotalMonthlyDebtPayments } from '../utils/debt-calculations';
import { formatCurrency } from '../utils/formatters';
import { validateSalary, validateCost } from '../utils/validators';
import { HOUSING_TYPES, EMERGENCY_FUND_MONTHS } from '../utils/latvian-constants';
import Button from '../components/Button';
import PocketChart from '../components/PocketChart';

export default function Calculator() {
  const { getProfile, saveProfile, getDebts } = useLocalStorage();
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

    // Calculate total monthly debt payments from debts
    const debts = getDebts();
    const monthlyDebtPayments = calculateTotalMonthlyDebtPayments(debts);

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
      monthlyDebtPayments,
      currentSavings: savings,
      emergencyFundMonths,
      savingsPercentage: 50,
      createdAt: new Date().toISOString(),
    };
    saveProfile(profile);
    toast.success('Profile saved successfully!');

    // Clear draft since we've now saved the complete profile
    localStorage.removeItem('pockets_calculator_draft');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-secondary-900">Pocket Calculator</h1>
      <p className="text-secondary-600 mb-6">
        Enter your income and expenses to see how much you should save and spend
      </p>

      {/* Calculator Form */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <form onSubmit={handleCalculate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Monthly Salary */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                Monthly Salary (After Tax) *
              </label>
              <input
                type="number"
                value={monthlySalary}
                onChange={(e) => setMonthlySalary(e.target.value)}
                placeholder="e.g., 1600"
                className="w-full px-3 py-3 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                required
              />
              {errors.salary && <p className="text-accent text-xs mt-1">{errors.salary}</p>}
            </div>

            {/* Housing Type */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">Housing Type *</label>
              <select
                value={housingType}
                onChange={(e) => setHousingType(e.target.value as 'rent' | 'mortgage' | 'own')}
                className="w-full px-3 py-3 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              >
                {HOUSING_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Housing Cost */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                Housing Cost *
              </label>
              <input
                type="number"
                value={housingCost}
                onChange={(e) => setHousingCost(e.target.value)}
                placeholder="e.g., 400"
                className="w-full px-3 py-3 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                required
              />
              {errors.housing && <p className="text-accent text-xs mt-1">{errors.housing}</p>}
            </div>

            {/* Utilities Cost */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                Utilities *
              </label>
              <input
                type="number"
                value={utilitiesCost}
                onChange={(e) => setUtilitiesCost(e.target.value)}
                placeholder="e.g., 100"
                className="w-full px-3 py-3 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                required
              />
              {errors.utilities && <p className="text-accent text-xs mt-1">{errors.utilities}</p>}
            </div>

            {/* Emergency Fund */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                Emergency Fund
              </label>
              <select
                value={emergencyFundMonths}
                onChange={(e) => setEmergencyFundMonths(parseInt(e.target.value) as 3 | 6 | 12)}
                className="w-full px-3 py-3 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              >
                {EMERGENCY_FUND_MONTHS.map((months) => (
                  <option key={months} value={months}>
                    {months} months
                  </option>
                ))}
              </select>
            </div>

            {/* Current Savings */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                Current Savings
              </label>
              <input
                type="number"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(e.target.value)}
                placeholder="e.g., 500"
                className="w-full px-3 py-3 border border-secondary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            className="mt-4"
          >
            Calculate My Pockets
          </Button>
        </form>
      </div>

      {/* Results Display */}
      {showResults && calculation && (
        <>
          {/* Pocket Distribution Chart */}
          <PocketChart
            savings={calculation.recommendedSavings}
            lifestyle={calculation.recommendedLifestyle}
            mandatory={calculation.mandatoryExpenses}
          />

          {/* Detailed Breakdown */}
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h2 className="text-2xl font-bold mb-4 text-secondary-900">Detailed Breakdown</h2>

          <div className="space-y-3 mb-6">
            {/* Net Income */}
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-700">Net Income</span>
              <span className="font-mono text-lg font-semibold text-primary">
                {formatCurrency(calculation.netIncome)}
              </span>
            </div>

            {/* Mandatory Expenses */}
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-sm text-gray-700">Mandatory Expenses</span>
              <span className="font-mono text-lg font-semibold text-accent">
                -{formatCurrency(calculation.mandatoryExpenses)}
              </span>
            </div>

            {/* Remaining */}
            <div className="flex justify-between items-center py-2 border-b-2 border-gray-300">
              <span className="text-sm text-gray-700 font-semibold">Available</span>
              <span className="font-mono text-xl font-bold text-primary">
                {formatCurrency(calculation.remaining)}
              </span>
            </div>
          </div>

          {/* Pocket Recommendations */}
          <div className="grid gap-3 mb-6">
            {/* Recommended Savings */}
            <div className="bg-green-50 p-3 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm font-semibold text-gray-700">Savings (50%)</span>
                  <p className="text-xs text-gray-600 mt-0.5">For emergency fund & goals</p>
                </div>
                <span className="font-mono text-lg font-bold text-primary">
                  {formatCurrency(calculation.recommendedSavings)}
                </span>
              </div>
            </div>

            {/* Recommended Lifestyle */}
            <div className="bg-blue-50 p-3 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm font-semibold text-gray-700">Lifestyle (50%)</span>
                  <p className="text-xs text-gray-600 mt-0.5">Food, transport, entertainment</p>
                </div>
                <span className="font-mono text-lg font-bold text-blue-600">
                  {formatCurrency(calculation.recommendedLifestyle)}
                </span>
              </div>
            </div>

            {/* Emergency Fund */}
            <div className="bg-yellow-50 p-3 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm font-semibold text-gray-700">Emergency Fund Target</span>
                  <p className="text-xs text-gray-600 mt-0.5">{emergencyFundMonths} months of expenses</p>
                </div>
                <span className="font-mono text-lg font-bold text-yellow-700">
                  {formatCurrency(calculation.emergencyFundTarget)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => navigate('/app/goals')}
              variant="primary"
              size="sm"
            >
              Set a Goal
            </Button>
            <Button
              onClick={() => navigate('/app/expenses')}
              variant="secondary"
              size="sm"
            >
              Track Expenses
            </Button>
          </div>
          </div>
        </>
      )}
    </div>
  );
}
