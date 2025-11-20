import { UserProfile, Goal, Expense, Debt } from '../types';
import { ExportData } from './dataExport';

/**
 * Data import utilities
 * Allows users to restore data from JSON backups
 */

export interface ImportResult {
  success: boolean;
  message: string;
  data?: {
    profile: UserProfile | null;
    goals: Goal[];
    expenses: Expense[];
    debts: Debt[];
  };
}

/**
 * Validate export data structure
 */
const validateExportData = (data: any): data is ExportData => {
  if (!data || typeof data !== 'object') {
    return false;
  }

  // Check required fields
  if (!data.version || !data.exportDate) {
    return false;
  }

  // Check data types
  if (data.profile && typeof data.profile !== 'object') {
    return false;
  }

  if (!Array.isArray(data.goals) || !Array.isArray(data.expenses) || !Array.isArray(data.debts)) {
    return false;
  }

  return true;
};

/**
 * Validate user profile structure
 */
const validateProfile = (profile: any): profile is UserProfile => {
  if (!profile || typeof profile !== 'object') {
    return false;
  }

  return (
    typeof profile.monthlySalary === 'number' &&
    typeof profile.housingCost === 'number' &&
    typeof profile.utilitiesCost === 'number' &&
    typeof profile.currentSavings === 'number' &&
    typeof profile.monthlyDebtPayments === 'number' &&
    typeof profile.savingsPercentage === 'number' &&
    ['rent', 'mortgage', 'own'].includes(profile.housingType) &&
    [3, 6, 12].includes(profile.emergencyFundMonths)
  );
};

/**
 * Validate goal structure
 */
const validateGoal = (goal: any): goal is Goal => {
  if (!goal || typeof goal !== 'object') {
    return false;
  }

  return (
    typeof goal.id === 'string' &&
    typeof goal.name === 'string' &&
    typeof goal.targetAmount === 'number' &&
    typeof goal.currentAmount === 'number' &&
    typeof goal.createdAt === 'string'
  );
};

/**
 * Validate expense structure
 */
const validateExpense = (expense: any): expense is Expense => {
  if (!expense || typeof expense !== 'object') {
    return false;
  }

  const validCategories = ['Food', 'Transport', 'Entertainment', 'Health', 'Utilities', 'Shopping', 'Education', 'Other'];

  return (
    typeof expense.id === 'string' &&
    typeof expense.amount === 'number' &&
    validCategories.includes(expense.category) &&
    typeof expense.date === 'string'
  );
};

/**
 * Validate debt structure
 */
const validateDebt = (debt: any): debt is Debt => {
  if (!debt || typeof debt !== 'object') {
    return false;
  }

  const validTypes = ['credit_card', 'personal_loan', 'mortgage', 'auto_loan', 'student_loan', 'other'];

  return (
    typeof debt.id === 'string' &&
    typeof debt.name === 'string' &&
    validTypes.includes(debt.type) &&
    typeof debt.totalAmount === 'number' &&
    typeof debt.currentBalance === 'number' &&
    typeof debt.interestRate === 'number' &&
    typeof debt.minimumPayment === 'number' &&
    typeof debt.monthlyPayment === 'number' &&
    typeof debt.createdAt === 'string'
  );
};

/**
 * Import data from JSON string
 */
export const importFromJSON = (jsonString: string): ImportResult => {
  try {
    const data = JSON.parse(jsonString);

    // Validate structure
    if (!validateExportData(data)) {
      return {
        success: false,
        message: 'Invalid data format. Please ensure you are importing a valid Pockets backup file.',
      };
    }

    // Check version compatibility
    const currentVersion = '1.0.0';
    if (data.version !== currentVersion) {
      return {
        success: false,
        message: `Version mismatch. Backup is version ${data.version}, but app expects ${currentVersion}.`,
      };
    }

    // Validate and filter profile
    let validProfile: UserProfile | null = null;
    if (data.profile) {
      if (validateProfile(data.profile)) {
        validProfile = data.profile;
      } else {
        return {
          success: false,
          message: 'Invalid profile data in backup file.',
        };
      }
    }

    // Validate and filter goals
    const validGoals = data.goals.filter((goal: any) => validateGoal(goal));
    const invalidGoalsCount = data.goals.length - validGoals.length;

    // Validate and filter expenses
    const validExpenses = data.expenses.filter((expense: any) => validateExpense(expense));
    const invalidExpensesCount = data.expenses.length - validExpenses.length;

    // Validate and filter debts
    const validDebts = data.debts.filter((debt: any) => validateDebt(debt));
    const invalidDebtsCount = data.debts.length - validDebts.length;

    // Build warning message if any data was filtered
    let warningMessage = '';
    if (invalidGoalsCount > 0 || invalidExpensesCount > 0 || invalidDebtsCount > 0) {
      const warnings = [];
      if (invalidGoalsCount > 0) warnings.push(`${invalidGoalsCount} invalid goals`);
      if (invalidExpensesCount > 0) warnings.push(`${invalidExpensesCount} invalid expenses`);
      if (invalidDebtsCount > 0) warnings.push(`${invalidDebtsCount} invalid debts`);
      warningMessage = ` (Skipped: ${warnings.join(', ')})`;
    }

    return {
      success: true,
      message: `Successfully imported data: ${validProfile ? 'Profile, ' : ''}${validGoals.length} goals, ${validExpenses.length} expenses, ${validDebts.length} debts${warningMessage}`,
      data: {
        profile: validProfile,
        goals: validGoals,
        expenses: validExpenses,
        debts: validDebts,
      },
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      return {
        success: false,
        message: 'Invalid JSON format. Please ensure the file is not corrupted.',
      };
    }

    return {
      success: false,
      message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

/**
 * Read file as text
 */
export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };

    reader.readAsText(file);
  });
};
