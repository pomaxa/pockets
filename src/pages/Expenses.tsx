import { useState, useEffect, useRef } from 'react';
import { Expense } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { formatCurrency, formatDateShort } from '../utils/formatters';
import { calculateMonthlyExpenses, calculateExpensesByCategory, calculateDailyAverage } from '../utils/calculations';
import { validateCost } from '../utils/validators';
import { EXPENSE_CATEGORIES } from '../utils/latvian-constants';
import { parseCSVFile } from '../utils/csv-parser';

export default function Expenses() {
  const { getExpenses, addExpense, updateExpense, deleteExpense } = useLocalStorage();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);

  // Form state
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Expense['category']>('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter state
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));

  // Sort state
  type SortField = 'date' | 'category' | 'description' | 'amount';
  type SortDirection = 'asc' | 'desc';
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // CSV Import state
  const [showImportPreview, setShowImportPreview] = useState(false);
  const [importedExpenses, setImportedExpenses] = useState<Expense[]>([]);
  const [selectedImports, setSelectedImports] = useState<Set<string>>(new Set());
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmitExpense = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (editingExpenseId) {
      // Update existing expense
      updateExpense(editingExpenseId, {
        amount: parseFloat(amount),
        category,
        date,
        description: description || undefined,
      });
    } else {
      // Create new expense
      const newExpense: Expense = {
        id: Date.now().toString(),
        amount: parseFloat(amount),
        category,
        date,
        description: description || undefined,
      };
      addExpense(newExpense);
    }

    loadExpenses();
    resetForm();
  };

  const handleEditExpense = (expense: Expense) => {
    setAmount(expense.amount.toString());
    setCategory(expense.category);
    setDate(expense.date);
    setDescription(expense.description || '');
    setEditingExpenseId(expense.id);
    setShowForm(true);
    setErrors({});
  };

  const resetForm = () => {
    setAmount('');
    setCategory('Food');
    setDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setEditingExpenseId(null);
    setShowForm(false);
    setErrors({});
  };

  const handleCancelEdit = () => {
    resetForm();
  };

  const handleDeleteExpense = (expenseId: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      deleteExpense(expenseId);
      loadExpenses();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const parsed = parseCSVFile(csvText);

        if (parsed.length === 0) {
          setImportError('No valid expenses found in CSV file');
          return;
        }

        setImportedExpenses(parsed);
        setSelectedImports(new Set(parsed.map((exp) => exp.id)));
        setShowImportPreview(true);
      } catch (error) {
        setImportError(error instanceof Error ? error.message : 'Failed to parse CSV file');
        console.error('CSV parsing error:', error);
      }
    };

    reader.onerror = () => {
      setImportError('Failed to read file');
    };

    reader.readAsText(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImportConfirm = () => {
    const expensesToImport = importedExpenses.filter((exp) => selectedImports.has(exp.id));

    expensesToImport.forEach((expense) => {
      addExpense(expense);
    });

    loadExpenses();
    setShowImportPreview(false);
    setImportedExpenses([]);
    setSelectedImports(new Set());
  };

  const handleImportCancel = () => {
    setShowImportPreview(false);
    setImportedExpenses([]);
    setSelectedImports(new Set());
    setImportError(null);
  };

  const toggleImportSelection = (expenseId: string) => {
    const newSelected = new Set(selectedImports);
    if (newSelected.has(expenseId)) {
      newSelected.delete(expenseId);
    } else {
      newSelected.add(expenseId);
    }
    setSelectedImports(newSelected);
  };

  const selectAllImports = () => {
    setSelectedImports(new Set(importedExpenses.map((exp) => exp.id)));
  };

  const deselectAllImports = () => {
    setSelectedImports(new Set());
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter expenses by selected month
  const filteredExpenses = expenses.filter((exp) => exp.date.startsWith(filterMonth));

  // Sort filtered expenses
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case 'date':
        comparison = a.date.localeCompare(b.date);
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      case 'description':
        const descA = a.description || '';
        const descB = b.description || '';
        comparison = descA.localeCompare(descB);
        break;
      case 'amount':
        comparison = a.amount - b.amount;
        break;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const monthTotal = calculateMonthlyExpenses(sortedExpenses);

  // Calculate number of days to use for daily average
  const getDaysForAverage = (monthStr: string): number => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    if (monthStr === currentMonth) {
      // For current month, use current day of month
      return now.getDate();
    } else {
      // For past months, use total days in that month
      const [year, month] = monthStr.split('-').map(Number);
      const lastDay = new Date(year, month, 0).getDate(); // Day 0 of next month = last day of current month
      return lastDay;
    }
  };

  const dailyAverage = calculateDailyAverage(sortedExpenses, getDaysForAverage(filterMonth));
  const expensesByCategory = calculateExpensesByCategory(sortedExpenses);

  // Get unique months from expenses
  const availableMonths = Array.from(new Set(expenses.map((exp) => exp.date.slice(0, 7)))).sort().reverse();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Expense Tracker</h1>
          <p className="text-gray-600">Track where your money goes</p>
        </div>
        <div className="flex gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors font-semibold cursor-pointer"
          >
            Import CSV
          </label>
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
            {showForm ? 'Cancel' : 'Add Expense'}
          </button>
        </div>
      </div>

      {/* Import Error Message */}
      {importError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 font-semibold">Import Error</p>
          <p className="text-red-600 text-sm mt-1">{importError}</p>
        </div>
      )}

      {/* Add/Edit Expense Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900">
            {editingExpenseId ? 'Edit Expense' : 'Add New Expense'}
          </h2>
          <form onSubmit={handleSubmitExpense}>
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

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-primary text-white py-2 rounded-md font-semibold hover:bg-green-600 transition-colors"
              >
                {editingExpenseId ? 'Update Expense' : 'Add Expense'}
              </button>
              {editingExpenseId && (
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

      {/* Import Preview Modal */}
      {showImportPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Import Preview</h2>
              <p className="text-gray-600 mt-1">
                Found {importedExpenses.length} transactions. Select which ones to import.
              </p>
            </div>

            <div className="p-6 flex gap-3 border-b border-gray-200">
              <button
                onClick={selectAllImports}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-semibold"
              >
                Select All
              </button>
              <button
                onClick={deselectAllImports}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-semibold"
              >
                Deselect All
              </button>
              <div className="ml-auto text-sm text-gray-600 flex items-center">
                {selectedImports.size} of {importedExpenses.length} selected
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-2">
                {importedExpenses.map((expense) => {
                  const categoryInfo = EXPENSE_CATEGORIES.find((c) => c.value === expense.category);
                  const isSelected = selectedImports.has(expense.id);

                  return (
                    <div
                      key={expense.id}
                      onClick={() => toggleImportSelection(expense.id)}
                      className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                        isSelected
                          ? 'border-primary bg-green-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                      />
                      <div className="flex-1 grid grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Date</p>
                          <p className="font-semibold text-gray-900">
                            {formatDateShort(expense.date)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Category</p>
                          <p className="font-semibold text-gray-900">
                            {categoryInfo?.emoji} {expense.category}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Description</p>
                          <p className="font-semibold text-gray-900 truncate">
                            {expense.description || '-'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Amount</p>
                          <p className="font-mono font-bold text-gray-900">
                            {formatCurrency(expense.amount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={handleImportCancel}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleImportConfirm}
                disabled={selectedImports.size === 0}
                className="flex-1 px-6 py-3 bg-primary text-white rounded-md hover:bg-green-600 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Import {selectedImports.size} Expenses
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expenses List */}
      {sortedExpenses.length === 0 ? (
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
                  <th
                    onClick={() => handleSort('date')}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
                  >
                    <div className="flex items-center gap-2">
                      Date
                      {sortField === 'date' && (
                        <span className="text-primary">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('category')}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
                  >
                    <div className="flex items-center gap-2">
                      Category
                      {sortField === 'category' && (
                        <span className="text-primary">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('description')}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
                  >
                    <div className="flex items-center gap-2">
                      Description
                      {sortField === 'description' && (
                        <span className="text-primary">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('amount')}
                    className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
                  >
                    <div className="flex items-center justify-end gap-2">
                      Amount
                      {sortField === 'amount' && (
                        <span className="text-primary">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedExpenses.map((expense) => {
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
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => handleEditExpense(expense)}
                            className="text-primary hover:text-green-700 font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="text-accent hover:text-red-600 font-semibold"
                          >
                            Delete
                          </button>
                        </div>
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
