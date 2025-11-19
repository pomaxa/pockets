import { UserProfile, Goal, Expense } from '../types';

/**
 * Custom hook for managing localStorage operations
 * Provides methods to get and save user profile, goals, and expenses
 */
export const useLocalStorage = () => {
  // User Profile operations
  const getProfile = (): UserProfile | null => {
    try {
      const data = localStorage.getItem('pockets_profile');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading profile from localStorage:', error);
      return null;
    }
  };

  const saveProfile = (profile: UserProfile): void => {
    try {
      localStorage.setItem('pockets_profile', JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving profile to localStorage:', error);
    }
  };

  const clearProfile = (): void => {
    try {
      localStorage.removeItem('pockets_profile');
    } catch (error) {
      console.error('Error clearing profile from localStorage:', error);
    }
  };

  // Goals operations
  const getGoals = (): Goal[] => {
    try {
      const data = localStorage.getItem('pockets_goals');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading goals from localStorage:', error);
      return [];
    }
  };

  const saveGoals = (goals: Goal[]): void => {
    try {
      localStorage.setItem('pockets_goals', JSON.stringify(goals));
    } catch (error) {
      console.error('Error saving goals to localStorage:', error);
    }
  };

  const addGoal = (goal: Goal): void => {
    const goals = getGoals();
    goals.push(goal);
    saveGoals(goals);
  };

  const updateGoal = (goalId: string, updatedGoal: Partial<Goal>): void => {
    const goals = getGoals();
    const index = goals.findIndex((g) => g.id === goalId);
    if (index !== -1) {
      goals[index] = { ...goals[index], ...updatedGoal };
      saveGoals(goals);
    }
  };

  const deleteGoal = (goalId: string): void => {
    const goals = getGoals();
    const filtered = goals.filter((g) => g.id !== goalId);
    saveGoals(filtered);
  };

  // Expenses operations
  const getExpenses = (): Expense[] => {
    try {
      const data = localStorage.getItem('pockets_expenses');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading expenses from localStorage:', error);
      return [];
    }
  };

  const saveExpenses = (expenses: Expense[]): void => {
    try {
      localStorage.setItem('pockets_expenses', JSON.stringify(expenses));
    } catch (error) {
      console.error('Error saving expenses to localStorage:', error);
    }
  };

  const addExpense = (expense: Expense): void => {
    const expenses = getExpenses();
    expenses.push(expense);
    saveExpenses(expenses);
  };

  const deleteExpense = (expenseId: string): void => {
    const expenses = getExpenses();
    const filtered = expenses.filter((e) => e.id !== expenseId);
    saveExpenses(filtered);
  };

  // Clear all data
  const clearAllData = (): void => {
    try {
      localStorage.removeItem('pockets_profile');
      localStorage.removeItem('pockets_goals');
      localStorage.removeItem('pockets_expenses');
    } catch (error) {
      console.error('Error clearing all data from localStorage:', error);
    }
  };

  return {
    // Profile methods
    getProfile,
    saveProfile,
    clearProfile,
    // Goals methods
    getGoals,
    saveGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    // Expenses methods
    getExpenses,
    saveExpenses,
    addExpense,
    deleteExpense,
    // General methods
    clearAllData,
  };
};
