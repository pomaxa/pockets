import { Expense, PocketCalculation } from '../types';

/**
 * Calculate total mandatory expenses (housing + utilities)
 */
export const calculateMandatory = (housing: number, utilities: number): number => {
  return housing + utilities;
};

/**
 * Calculate estimated taxes for Latvia
 * Simplified: ~20% Personal Income Tax (PIT) for Latvia
 * Note: Actual calculation may vary based on allowances and other factors
 */
export const calculateTaxes = (salary: number): number => {
  return salary * 0.20;
};

/**
 * Calculate all pockets (mandatory, remaining, recommended savings, etc.)
 * Based on Latvian tax system and user's housing costs
 */
export const calculatePockets = (
  salary: number,
  housing: number,
  utilities: number,
  emergencyFundMonths: number = 3
): PocketCalculation => {
  const mandatory = calculateMandatory(housing, utilities);
  const taxes = calculateTaxes(salary);
  const netIncome = salary - taxes;
  const totalMandatory = mandatory;
  const remaining = netIncome - totalMandatory;

  return {
    grossSalary: salary,
    mandatoryExpenses: mandatory,
    estimatedTaxes: taxes,
    netIncome,
    remaining: remaining > 0 ? remaining : 0,
    recommendedSavings: remaining > 0 ? remaining * 0.5 : 0,
    recommendedLifestyle: remaining > 0 ? remaining * 0.5 : 0,
    emergencyFundTarget: mandatory * emergencyFundMonths,
    monthsToEmergencyFund: emergencyFundMonths,
  };
};

/**
 * Calculate number of months needed to reach a financial goal
 */
export const calculateMonthsToGoal = (
  targetAmount: number,
  monthlyAllocation: number,
  currentAmount: number = 0
): number => {
  if (monthlyAllocation <= 0) return 0;
  const remainingAmount = targetAmount - currentAmount;
  if (remainingAmount <= 0) return 0;
  return Math.ceil(remainingAmount / monthlyAllocation);
};

/**
 * Calculate total monthly expenses from expense array
 */
export const calculateMonthlyExpenses = (expenses: Expense[]): number => {
  return expenses.reduce((sum, exp) => sum + exp.amount, 0);
};

/**
 * Group expenses by category and calculate totals
 */
export const calculateExpensesByCategory = (expenses: Expense[]): Record<string, number> => {
  return expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);
};

/**
 * Calculate daily average spending from expenses
 */
export const calculateDailyAverage = (expenses: Expense[], days: number = 30): number => {
  const total = calculateMonthlyExpenses(expenses);
  return days > 0 ? total / days : 0;
};

/**
 * Format currency for Latvia (EUR)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('lv-LV', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};

/**
 * Validate salary input (must be positive number)
 */
export const validateSalary = (salary: number): boolean => {
  return salary > 0 && !isNaN(salary) && isFinite(salary);
};

/**
 * Validate expense/cost input (must be non-negative number)
 */
export const validateCost = (cost: number): boolean => {
  return cost >= 0 && !isNaN(cost) && isFinite(cost);
};
