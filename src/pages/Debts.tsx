import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Debt, UserProfile } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { formatCurrency } from '../utils/formatters';
import { validateCost, validateRequired } from '../utils/validators';
import { DEBT_TYPES } from '../utils/latvia-debt-constants';
import {
  compareStrategies,
  calculateTotalMonthlyDebtPayments,
  calculateWeightedAverageRate,
  calculateDebtToIncomeRatio,
  getDebtRestructuringAdvice,
} from '../utils/debt-calculations';
import { exportDebtsAsCSV, downloadCSVFile } from '../utils/dataExport';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import StatCard from '../components/StatCard';
import Button from '../components/Button';

export default function Debts() {
  const {
    getDebts,
    addDebt,
    updateDebt,
    deleteDebt,
    getProfile,
  } = useLocalStorage();

  const [debts, setDebts] = useState<Debt[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<'avalanche' | 'snowball'>('avalanche');
  const [editingDebtId, setEditingDebtId] = useState<string | null>(null);

  // Form state
  const [debtName, setDebtName] = useState('');
  const [debtType, setDebtType] = useState<Debt['type']>('credit_card');
  const [totalAmount, setTotalAmount] = useState('');
  const [currentBalance, setCurrentBalance] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [minimumPayment, setMinimumPayment] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadDebts();
    setProfile(getProfile());
  }, []);

  const loadDebts = () => {
    const savedDebts = getDebts();
    setDebts(savedDebts);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateRequired(debtName)) {
      newErrors.name = 'Debt name is required';
    }

    const total = parseFloat(totalAmount);
    const balance = parseFloat(currentBalance);
    const rate = parseFloat(interestRate);
    const minPayment = parseFloat(minimumPayment);
    const payment = parseFloat(monthlyPayment);

    if (!validateCost(total) || total <= 0) {
      newErrors.total = 'Please enter a valid total amount';
    }

    if (!validateCost(balance) || balance <= 0) {
      newErrors.balance = 'Please enter a valid current balance';
    }

    if (balance > total) {
      newErrors.balance = 'Current balance cannot exceed total amount';
    }

    if (!validateCost(rate)) {
      newErrors.rate = 'Please enter a valid interest rate';
    }

    if (rate > 50) {
      newErrors.rate = 'Interest rate seems unusually high. Please verify.';
    }

    if (!validateCost(minPayment) || minPayment <= 0) {
      newErrors.minPayment = 'Please enter a valid minimum payment';
    }

    if (!validateCost(payment) || payment <= 0) {
      newErrors.payment = 'Please enter a valid monthly payment';
    }

    if (payment < minPayment) {
      newErrors.payment = 'Monthly payment must be at least the minimum payment';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitDebt = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (editingDebtId) {
      // Update existing debt
      updateDebt(editingDebtId, {
        name: debtName,
        type: debtType,
        totalAmount: parseFloat(totalAmount),
        currentBalance: parseFloat(currentBalance),
        interestRate: parseFloat(interestRate),
        minimumPayment: parseFloat(minimumPayment),
        monthlyPayment: parseFloat(monthlyPayment),
        notes: notes || undefined,
      });
      toast.success('Debt updated successfully!');
    } else {
      // Create new debt
      const newDebt: Debt = {
        id: Date.now().toString(),
        name: debtName,
        type: debtType,
        totalAmount: parseFloat(totalAmount),
        currentBalance: parseFloat(currentBalance),
        interestRate: parseFloat(interestRate),
        minimumPayment: parseFloat(minimumPayment),
        monthlyPayment: parseFloat(monthlyPayment),
        notes: notes || undefined,
        createdAt: new Date().toISOString(),
      };
      addDebt(newDebt);
      toast.success('Debt added successfully!');
    }

    loadDebts();
    resetForm();
  };

  const handleEditDebt = (debt: Debt) => {
    setDebtName(debt.name);
    setDebtType(debt.type);
    setTotalAmount(debt.totalAmount.toString());
    setCurrentBalance(debt.currentBalance.toString());
    setInterestRate(debt.interestRate.toString());
    setMinimumPayment(debt.minimumPayment.toString());
    setMonthlyPayment(debt.monthlyPayment.toString());
    setNotes(debt.notes || '');
    setEditingDebtId(debt.id);
    setShowForm(true);
    setErrors({});
  };

  const resetForm = () => {
    setDebtName('');
    setDebtType('credit_card');
    setTotalAmount('');
    setCurrentBalance('');
    setInterestRate('');
    setMinimumPayment('');
    setMonthlyPayment('');
    setNotes('');
    setEditingDebtId(null);
    setShowForm(false);
    setErrors({});
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleDeleteDebt = (debtId: string) => {
    if (confirm('Are you sure you want to delete this debt?')) {
      deleteDebt(debtId);
      loadDebts();
      toast.success('Debt deleted successfully');
    }
  };

  const handleMakePayment = (debtId: string, amount: number) => {
    const debt = debts.find((d) => d.id === debtId);
    if (debt) {
      const newBalance = Math.max(0, debt.currentBalance - amount);
      updateDebt(debtId, { currentBalance: newBalance });
      loadDebts();
      toast.success(`Payment of ${formatCurrency(amount)} recorded!`);
    }
  };

  // Calculate summary stats
  const totalDebtAmount = debts.reduce((sum, d) => sum + d.currentBalance, 0);
  const totalMonthlyPayments = calculateTotalMonthlyDebtPayments(debts);
  const weightedAvgRate = calculateWeightedAverageRate(debts);
  const debtToIncomeRatio = profile
    ? calculateDebtToIncomeRatio(totalMonthlyPayments, profile.monthlySalary)
    : 0;

  // Calculate strategies
  const strategyComparison = debts.length > 0 ? compareStrategies(debts, 0) : null;
  const currentStrategy =
    selectedStrategy === 'avalanche'
      ? strategyComparison?.avalanche
      : strategyComparison?.snowball;

  // Get restructuring advice
  const restructuringAdvice =
    debts.length > 0 && profile
      ? getDebtRestructuringAdvice(debts, profile.monthlySalary)
      : null;

  // Helper to get debt type info
  const getDebtTypeInfo = (type: Debt['type']) => {
    return DEBT_TYPES.find((t) => t.value === type);
  };

  const handleExportDebts = () => {
    if (debts.length === 0) {
      toast.error('No debts to export');
      return;
    }

    try {
      const csvData = exportDebtsAsCSV(debts);
      const filename = `debts-export-${new Date().toISOString().split('T')[0]}.csv`;
      downloadCSVFile(csvData, filename);
      toast.success(`Exported ${debts.length} debts to CSV`);
    } catch (error) {
      toast.error('Failed to export debts');
      console.error('Export error:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="Debt Management"
        description="Track debts and create a payoff strategy"
        actions={
          <>
            {debts.length > 0 && (
              <Button variant="blue" onClick={handleExportDebts}>
                Export CSV
              </Button>
            )}
            <Button
              onClick={() => {
                if (showForm) {
                  handleCancelEdit();
                } else {
                  setShowForm(true);
                }
              }}
            >
              {showForm ? 'Cancel' : 'Add Debt'}
            </Button>
          </>
        }
      />

      {/* Add/Edit Debt Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900">
            {editingDebtId ? 'Edit Debt' : 'Add New Debt'}
          </h2>
          <form onSubmit={handleSubmitDebt}>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Debt Name *
                </label>
                <input
                  type="text"
                  value={debtName}
                  onChange={(e) => setDebtName(e.target.value)}
                  placeholder="e.g., Visa Credit Card, Car Loan"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                {errors.name && <p className="text-accent text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Debt Type *
                </label>
                <select
                  value={debtType}
                  onChange={(e) => setDebtType(e.target.value as Debt['type'])}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {DEBT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.emoji} {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Original Amount (€) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  placeholder="e.g., 5000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                {errors.total && <p className="text-accent text-sm mt-1">{errors.total}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Current Balance (€) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={currentBalance}
                  onChange={(e) => setCurrentBalance(e.target.value)}
                  placeholder="e.g., 3500"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                {errors.balance && <p className="text-accent text-sm mt-1">{errors.balance}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Interest Rate (% APR) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="e.g., 15.5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                {errors.rate && <p className="text-accent text-sm mt-1">{errors.rate}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Minimum Payment (€) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={minimumPayment}
                  onChange={(e) => setMinimumPayment(e.target.value)}
                  placeholder="e.g., 50"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                {errors.minPayment && (
                  <p className="text-accent text-sm mt-1">{errors.minPayment}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Your Monthly Payment (€) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={monthlyPayment}
                  onChange={(e) => setMonthlyPayment(e.target.value)}
                  placeholder="e.g., 100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                {errors.payment && <p className="text-accent text-sm mt-1">{errors.payment}</p>}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this debt..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-primary text-white py-2 rounded-md font-semibold hover:bg-green-600 transition-colors"
              >
                {editingDebtId ? 'Update Debt' : 'Add Debt'}
              </button>
              {editingDebtId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-md font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Summary Dashboard */}
      {debts.length > 0 && (
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Total Debt"
            value={formatCurrency(totalDebtAmount)}
            variant="accent"
          />
          <StatCard
            label="Monthly Payments"
            value={formatCurrency(totalMonthlyPayments)}
          />
          <StatCard
            label="Avg Interest Rate"
            value={`${weightedAvgRate.toFixed(1)}%`}
            variant="orange"
          />
          <StatCard
            label="Debt-to-Income"
            value={`${debtToIncomeRatio.toFixed(1)}%`}
            variant={
              debtToIncomeRatio > 43
                ? 'accent'
                : debtToIncomeRatio > 36
                ? 'orange'
                : 'primary'
            }
          />
        </div>
      )}

      {/* No Debts State */}
      {debts.length === 0 ? (
        <EmptyState
          icon="💳"
          title="No Debts Tracked"
          description="Start by adding your debts to create a payoff strategy and track your progress toward becoming debt-free."
          action={
            <Button onClick={() => setShowForm(true)}>
              Add Your First Debt
            </Button>
          }
        />
      ) : (
        <>
          {/* Repayment Strategy Selector */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Payoff Strategy</h2>
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setSelectedStrategy('avalanche')}
                className={`flex-1 py-3 rounded-md font-semibold transition-colors ${
                  selectedStrategy === 'avalanche'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ⛰️ Debt Avalanche
              </button>
              <button
                onClick={() => setSelectedStrategy('snowball')}
                className={`flex-1 py-3 rounded-md font-semibold transition-colors ${
                  selectedStrategy === 'snowball'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ⛄ Debt Snowball
              </button>
            </div>

            {currentStrategy && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-600">Months to Debt-Free</p>
                    <p className="text-2xl font-bold text-primary">
                      {currentStrategy.monthsToPayoff} months
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-600">Total Interest Paid</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {formatCurrency(currentStrategy.totalInterest)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-600">Total Amount Paid</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(currentStrategy.totalPaid)}
                    </p>
                  </div>
                </div>

                {strategyComparison && strategyComparison.savings > 0 && (
                  <div className="bg-green-50 p-4 rounded-md">
                    <p className="text-sm font-semibold text-green-800 mb-1">
                      💰 Avalanche Advantage
                    </p>
                    <p className="text-sm text-green-700">
                      The Debt Avalanche method will save you{' '}
                      <strong>{formatCurrency(strategyComparison.savings)}</strong> in interest and
                      get you debt-free <strong>{strategyComparison.monthsSaved} months</strong>{' '}
                      faster compared to Debt Snowball.
                    </p>
                  </div>
                )}

                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-sm font-semibold text-blue-800 mb-2">
                    {selectedStrategy === 'avalanche' ? '⛰️ Avalanche Strategy' : '⛄ Snowball Strategy'}
                  </p>
                  <p className="text-sm text-blue-700">
                    {selectedStrategy === 'avalanche'
                      ? 'Pay off debts with highest interest rates first to save the most money.'
                      : 'Pay off smallest debts first for quick wins and motivation.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Debt List with Strategy Order */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Your Debts</h2>
            <div className="space-y-4">
              {currentStrategy?.debts.map((debt, index) => {
                const typeInfo = getDebtTypeInfo(debt.type);
                const progress = ((debt.totalAmount - debt.currentBalance) / debt.totalAmount) * 100;
                const isHighInterest = debt.interestRate > 15;

                return (
                  <div
                    key={debt.id}
                    className={`border rounded-lg p-6 ${
                      index === 0 ? 'border-primary border-2 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    {index === 0 && (
                      <div className="mb-4 pb-4 border-b border-green-200">
                        <p className="text-sm font-semibold text-primary">
                          🎯 FOCUS ON THIS DEBT NEXT
                        </p>
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{typeInfo?.emoji}</span>
                          <h3 className="text-xl font-bold text-gray-900">{debt.name}</h3>
                          {isHighInterest && (
                            <span className="bg-accent text-white text-xs px-2 py-1 rounded">
                              High Interest
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{typeInfo?.label}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 mb-2">Priority #{debt.order}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditDebt(debt)}
                            className="text-primary hover:text-green-700 text-sm font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteDebt(debt.id)}
                            className="text-accent hover:text-red-600 text-sm font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-600">Current Balance</p>
                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(debt.currentBalance)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Interest Rate</p>
                        <p className="text-lg font-bold text-orange-600">{debt.interestRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Monthly Payment</p>
                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(debt.monthlyPayment)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Payoff In</p>
                        <p className="text-lg font-bold text-primary">
                          {debt.payoffMonth} {debt.payoffMonth === 1 ? 'month' : 'months'}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold text-gray-900">{progress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {debt.notes && (
                      <p className="text-sm text-gray-600 italic mb-4">Note: {debt.notes}</p>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMakePayment(debt.id, 50)}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm font-semibold"
                      >
                        +€50
                      </button>
                      <button
                        onClick={() => handleMakePayment(debt.id, 100)}
                        className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm font-semibold"
                      >
                        +€100
                      </button>
                      <button
                        onClick={() => {
                          const amount = prompt('Enter payment amount (€):');
                          if (amount && !isNaN(parseFloat(amount))) {
                            handleMakePayment(debt.id, parseFloat(amount));
                          }
                        }}
                        className="flex-1 bg-primary text-white py-2 rounded-md hover:bg-green-600 transition-colors text-sm font-semibold"
                      >
                        Custom Payment
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Restructuring Advice */}
          {restructuringAdvice &&
            (restructuringAdvice.consolidationSuggestion ||
              restructuringAdvice.refinancingSuggestion) && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">💡 Restructuring Options</h2>

                {restructuringAdvice.reasons.length > 0 && (
                  <div className="bg-yellow-50 p-4 rounded-md mb-4">
                    <p className="font-semibold text-yellow-800 mb-2">Consider These Options:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {restructuringAdvice.reasons.map((reason, index) => (
                        <li key={index} className="text-sm text-yellow-700">
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {restructuringAdvice.potentialSavings > 0 && (
                  <div className="bg-green-50 p-4 rounded-md mb-4">
                    <p className="font-semibold text-green-800 mb-1">Potential Savings</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(restructuringAdvice.potentialSavings)}
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      Estimated interest savings from consolidation
                    </p>
                  </div>
                )}

                {restructuringAdvice.resources.length > 0 && (
                  <div>
                    <p className="font-semibold text-gray-900 mb-3">Latvia Resources:</p>
                    <div className="space-y-2">
                      {restructuringAdvice.resources.map((resource, index) => (
                        <div key={index} className="border border-gray-200 p-3 rounded-md">
                          <p className="font-semibold text-gray-900">{resource.name}</p>
                          <p className="text-sm text-gray-600">{resource.description}</p>
                          {resource.url && (
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              Visit Website →
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
        </>
      )}
    </div>
  );
}
