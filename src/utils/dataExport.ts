import { UserProfile, Goal, Expense, Debt } from '../types';

/**
 * Data export/import utilities
 * Allows users to backup and restore their data
 */

export interface ExportData {
  version: string;
  exportDate: string;
  profile: UserProfile | null;
  goals: Goal[];
  expenses: Expense[];
  debts: Debt[];
}

/**
 * Export all data as JSON
 */
export const exportAllDataAsJSON = (
  profile: UserProfile | null,
  goals: Goal[],
  expenses: Expense[],
  debts: Debt[]
): string => {
  const data: ExportData = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    profile,
    goals,
    expenses,
    debts,
  };

  return JSON.stringify(data, null, 2);
};

/**
 * Download JSON data as file
 */
export const downloadJSONFile = (jsonData: string, filename: string = 'pockets-backup.json') => {
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export goals as CSV
 */
export const exportGoalsAsCSV = (goals: Goal[]): string => {
  if (goals.length === 0) {
    return 'No goals to export';
  }

  const headers = ['Name', 'Target Amount (€)', 'Current Amount (€)', 'Due Date', 'Created At'];
  const rows = goals.map((goal) => [
    goal.name,
    goal.targetAmount.toString(),
    goal.currentAmount.toString(),
    goal.dueDate || '',
    new Date(goal.createdAt).toLocaleDateString('lv-LV'),
  ]);

  const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
  return csvContent;
};

/**
 * Export expenses as CSV
 */
export const exportExpensesAsCSV = (expenses: Expense[]): string => {
  if (expenses.length === 0) {
    return 'No expenses to export';
  }

  const headers = ['Date', 'Category', 'Amount (€)', 'Description'];
  const rows = expenses.map((expense) => [
    expense.date,
    expense.category,
    expense.amount.toString(),
    expense.description || '',
  ]);

  const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
  return csvContent;
};

/**
 * Export debts as CSV
 */
export const exportDebtsAsCSV = (debts: Debt[]): string => {
  if (debts.length === 0) {
    return 'No debts to export';
  }

  const headers = [
    'Name',
    'Type',
    'Total Amount (€)',
    'Current Balance (€)',
    'Interest Rate (%)',
    'Minimum Payment (€)',
    'Monthly Payment (€)',
    'Notes',
    'Created At',
  ];

  const rows = debts.map((debt) => [
    debt.name,
    debt.type,
    debt.totalAmount.toString(),
    debt.currentBalance.toString(),
    debt.interestRate.toString(),
    debt.minimumPayment.toString(),
    debt.monthlyPayment.toString(),
    debt.notes || '',
    new Date(debt.createdAt).toLocaleDateString('lv-LV'),
  ]);

  const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
  return csvContent;
};

/**
 * Download CSV data as file
 */
export const downloadCSVFile = (csvData: string, filename: string) => {
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
