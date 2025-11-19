import { useState, useEffect } from 'react';
import { Expense } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { formatCurrency, formatDateShort } from '../utils/formatters';
import { calculateMonthlyExpenses, calculateExpensesByCategory, calculateDailyAverage } from '../utils/calculations';
import { validateCost } from '../utils/validators';
import { EXPENSE_CATEGORIES } from '../utils/latvian-constants';

export default function Expenses() {
  const { getExpenses, addExpense, deleteExpense } = useLocalStorage();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Expense['category']>('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter state
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = () => {
    const savedExpenses = getExpenses();
    // Sort by date (newest first)
    const sorted = savedExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setExpenses(sorted);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const expenseAmount = parseFloat(amount);
    if (!validateCost(expenseAmount) || expenseAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount (greater than 0)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      category,
      date,
      description: description || undefined,
    };

    addExpense(newExpense);
    loadExpenses();

    // Reset form
    setAmount('');
    setCategory('Food');
    setDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setShowForm(false);
    setErrors({});
  };

  const handleDeleteExpense = (expenseId: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(expenseId);
      loadExpenses();
    }
  };

  // Filter expenses by selected month
  const filteredExpenses = expenses.filter((exp) => exp.date.startsWith(filterMonth));

  const monthTotal = calculateMonthlyExpenses(filteredExpenses);
  const dailyAverage = calculateDailyAverage(filteredExpenses, new Date(filterMonth + '-01').getDate());
  const expensesByCategory = calculateExpensesByCategory(filteredExpenses);

  // Get unique months from expenses
  const availableMonths = Array.from(new Set(expenses.map((exp) => exp.date.slice(0, 7)))).sort().reverse();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Expense Tracker</h1>
          <p className="text-gray-600">Track where your money goes</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors font-semibold"
        >
          {showForm ? 'Cancel' : 'Add Expense'}
        </button>
      </div>

      {/* Add Expense Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Add New Expense</h2>
          <form onSubmit={handleAddExpense}>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Amount (€) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g., 25.50"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                {errors.amount && <p className="text-accent text-sm mt-1">{errors.amount}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Expense['category'])}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.emoji} {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Description (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Grocery shopping at Rimi"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-md font-semibold hover:bg-green-600 transition-colors"
            >
              Add Expense
            </button>
          </form>
        </div>
      )}

      {/* Summary Cards */}
      {expenses.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-1">Month Total</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(monthTotal)}</p>
            <p className="text-sm text-gray-500 mt-2">{filterMonth}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-1">Daily Average</p>
            <p className="text-3xl font-bold text-blue-600">{formatCurrency(dailyAverage)}</p>
            <p className="text-sm text-gray-500 mt-2">This month</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
            <p className="text-3xl font-bold text-primary">{expenses.length}</p>
            <p className="text-sm text-gray-500 mt-2">All time</p>
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      {filteredExpenses.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-6 text-gray-900">Spending by Category</h2>
          <div className="space-y-4">
            {Object.entries(expensesByCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, amount]) => {
                const percentage = (amount / monthTotal) * 100;
                const categoryInfo = EXPENSE_CATEGORIES.find((c) => c.value === cat);
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-700">
                        {categoryInfo?.emoji} {cat}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(amount)} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Month Filter */}
      {availableMonths.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-2 text-gray-700">Filter by Month</label>
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {availableMonths.map((month) => (
              <option key={month} value={month}>
                {new Date(month + '-01').toLocaleDateString('lv-LV', {
                  year: 'numeric',
                  month: 'long',
                })}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Expenses List */}
      {filteredExpenses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-bold mb-2 text-gray-900">
            {expenses.length === 0 ? 'No Expenses Yet' : 'No Expenses This Month'}
          </h3>
          <p className="text-gray-600 mb-6">
            {expenses.length === 0
              ? 'Start tracking your spending by adding your first expense.'
              : 'No expenses recorded for this month. Try selecting a different month.'}
          </p>
          {expenses.length === 0 && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors font-semibold"
            >
              Add Your First Expense
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredExpenses.map((expense) => {
                  const categoryInfo = EXPENSE_CATEGORIES.find((c) => c.value === expense.category);
                  return (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDateShort(expense.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {categoryInfo?.emoji} {expense.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {expense.description || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono font-semibold text-gray-900">
                        {formatCurrency(expense.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <button
                          onClick={() => handleDeleteExpense(expense.id)}
                          className="text-accent hover:text-red-600 font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
