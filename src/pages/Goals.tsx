import { useState, useEffect } from 'react';
import { Goal, UserProfile } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { formatCurrency } from '../utils/formatters';
import { calculateMonthsToGoal, calculatePockets } from '../utils/calculations';
import { validateRequired, validateCost } from '../utils/validators';

export default function Goals() {
  const { getGoals, addGoal, deleteGoal, updateGoal, getProfile } = useLocalStorage();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

  // Form state
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadGoals();
    setProfile(getProfile());
  }, []);

  const loadGoals = () => {
    const savedGoals = getGoals();
    setGoals(savedGoals);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validateRequired(goalName)) {
      newErrors.name = 'Goal name is required';
    }

    const target = parseFloat(targetAmount);
    if (!validateCost(target) || target <= 0) {
      newErrors.target = 'Please enter a valid target amount (greater than 0)';
    }

    const current = parseFloat(currentAmount);
    if (!validateCost(current)) {
      newErrors.current = 'Please enter a valid current amount (0 or greater)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitGoal = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (editingGoalId) {
      // Update existing goal
      updateGoal(editingGoalId, {
        name: goalName,
        targetAmount: parseFloat(targetAmount),
        currentAmount: parseFloat(currentAmount),
        dueDate: dueDate || undefined,
      });
    } else {
      // Create new goal
      const newGoal: Goal = {
        id: Date.now().toString(),
        name: goalName,
        targetAmount: parseFloat(targetAmount),
        currentAmount: parseFloat(currentAmount),
        createdAt: new Date().toISOString(),
        dueDate: dueDate || undefined,
      };
      addGoal(newGoal);
    }

    loadGoals();
    resetForm();
  };

  const handleEditGoal = (goal: Goal) => {
    setGoalName(goal.name);
    setTargetAmount(goal.targetAmount.toString());
    setCurrentAmount(goal.currentAmount.toString());
    setDueDate(goal.dueDate || '');
    setEditingGoalId(goal.id);
    setShowForm(true);
    setErrors({});
  };

  const resetForm = () => {
    setGoalName('');
    setTargetAmount('');
    setCurrentAmount('0');
    setDueDate('');
    setEditingGoalId(null);
    setShowForm(false);
    setErrors({});
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleDeleteGoal = (goalId: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(goalId);
      loadGoals();
    }
  };

  const handleAddToGoal = (goalId: string, amount: number) => {
    const goal = goals.find((g) => g.id === goalId);
    if (goal) {
      const newCurrentAmount = goal.currentAmount + amount;
      updateGoal(goalId, { currentAmount: newCurrentAmount });
      loadGoals();
    }
  };

  const calculateProgress = (goal: Goal): number => {
    if (goal.targetAmount === 0) return 0;
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  const monthsToReachGoal = (goal: Goal): number => {
    if (!profile) return 0;

    // Calculate actual recommended savings based on income and expenses
    const calculation = calculatePockets(
      profile.monthlySalary,
      profile.housingCost,
      profile.utilitiesCost,
      profile.emergencyFundMonths
    );

    // Use the recommended savings amount (already accounts for taxes and expenses)
    // If user has multiple goals, they'll need to distribute savings between them
    // For now, we assume all recommended savings go to this goal
    const monthlyAllocation = calculation.recommendedSavings;

    return calculateMonthsToGoal(goal.targetAmount, monthlyAllocation, goal.currentAmount);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Savings Goals</h1>
          <p className="text-gray-600">Track your progress toward financial goals</p>
        </div>
        <button
          onClick={() => {
            if (showForm) {
              handleCancelEdit();
            } else {
              setShowForm(true);
            }
          }}
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors font-semibold"
        >
          {showForm ? 'Cancel' : 'Add Goal'}
        </button>
      </div>

      {/* Add/Edit Goal Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900">
            {editingGoalId ? 'Edit Goal' : 'Create New Goal'}
          </h2>
          <form onSubmit={handleSubmitGoal}>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Goal Name *
              </label>
              <input
                type="text"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                placeholder="e.g., Emergency Fund, New Laptop, Vacation"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              {errors.name && <p className="text-accent text-sm mt-1">{errors.name}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Target Amount (€) *
                </label>
                <input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="e.g., 5000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                {errors.target && <p className="text-accent text-sm mt-1">{errors.target}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Current Amount (€)
                </label>
                <input
                  type="number"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  placeholder="e.g., 500"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.current && <p className="text-accent text-sm mt-1">{errors.current}</p>}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Target Date (Optional)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-primary text-white py-2 rounded-md font-semibold hover:bg-green-600 transition-colors"
              >
                {editingGoalId ? 'Update Goal' : 'Create Goal'}
              </button>
              {editingGoalId && (
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

      {/* Goals List */}
      {goals.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-bold mb-2 text-gray-900">No Goals Yet</h3>
          <p className="text-gray-600 mb-6">
            Start by creating your first savings goal. It could be an emergency fund, a vacation, or anything you're saving for.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors font-semibold"
          >
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {goals.map((goal) => {
            const progress = calculateProgress(goal);
            const remaining = goal.targetAmount - goal.currentAmount;
            const isComplete = progress >= 100;

            return (
              <div key={goal.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{goal.name}</h3>
                    {goal.dueDate && (
                      <p className="text-sm text-gray-600 mt-1">
                        Target: {new Date(goal.dueDate).toLocaleDateString('lv-LV')}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditGoal(goal)}
                      className="text-primary hover:text-green-700 text-sm font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="text-accent hover:text-red-600 text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">
                      {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                    </span>
                    <span className="font-semibold text-gray-900">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isComplete ? 'bg-green-500' : 'bg-primary'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-600">Remaining</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(remaining > 0 ? remaining : 0)}
                    </p>
                  </div>
                  {profile && !isComplete && (
                    <div className="bg-blue-50 p-3 rounded-md">
                      <p className="text-sm text-gray-600">Est. Months to Goal</p>
                      <p className="text-lg font-bold text-blue-600">
                        {monthsToReachGoal(goal) > 0
                          ? `~${monthsToReachGoal(goal)} months`
                          : 'Set up calculator first'}
                      </p>
                    </div>
                  )}
                  {isComplete && (
                    <div className="bg-green-50 p-3 rounded-md">
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="text-lg font-bold text-green-600">Goal Reached! 🎉</p>
                    </div>
                  )}
                </div>

                {!isComplete && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToGoal(goal.id, 50)}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm font-semibold"
                    >
                      +€50
                    </button>
                    <button
                      onClick={() => handleAddToGoal(goal.id, 100)}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm font-semibold"
                    >
                      +€100
                    </button>
                    <button
                      onClick={() => {
                        const amount = prompt('Enter amount to add (€):');
                        if (amount && !isNaN(parseFloat(amount))) {
                          handleAddToGoal(goal.id, parseFloat(amount));
                        }
                      }}
                      className="flex-1 bg-primary text-white py-2 rounded-md hover:bg-green-600 transition-colors text-sm font-semibold"
                    >
                      Custom Amount
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
