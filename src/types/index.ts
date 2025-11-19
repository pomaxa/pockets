export interface UserProfile {
  monthlySalary: number;
  housingType: 'rent' | 'mortgage' | 'own';
  housingCost: number;
  utilitiesCost: number;
  monthlyDebtPayments: number; // Total monthly debt payments
  currentSavings: number;
  emergencyFundMonths: 3 | 6 | 12;
  savingsPercentage: number; // 0-100
  createdAt: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  createdAt: string;
  dueDate?: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: 'Housing' | 'Food' | 'Transport' | 'Entertainment' | 'Health' | 'Utilities' | 'Debt' | 'Other';
  date: string;
  description?: string;
  debtId?: string; // Link to specific debt if this is a debt payment
}

export interface PocketCalculation {
  grossSalary: number;
  mandatoryExpenses: number;
  estimatedTaxes: number;
  netIncome: number;
  remaining: number;
  recommendedSavings: number;
  recommendedLifestyle: number;
  emergencyFundTarget: number;
  monthsToEmergencyFund: number;
}

export interface Consultant {
  id: string;
  name: string;
  specialty: string;
  description: string;
  email: string;
  phone?: string;
  website?: string;
}

export interface Debt {
  id: string;
  name: string;
  type: 'credit_card' | 'personal_loan' | 'mortgage' | 'car_loan' | 'student_loan' | 'other';
  totalAmount: number;
  currentBalance: number;
  interestRate: number; // APR as percentage (e.g., 15.5 for 15.5%)
  minimumPayment: number;
  monthlyPayment: number;
  createdAt: string;
  notes?: string;
}

export interface DebtWithPlan extends Debt {
  payoffMonth: number; // Month number when this debt will be paid off
  totalInterestPaid: number;
  order: number; // Payment priority order
}

export interface DebtStrategy {
  type: 'avalanche' | 'snowball' | 'custom';
  debts: DebtWithPlan[];
  totalInterest: number;
  monthsToPayoff: number;
  totalPaid: number;
}

export interface DebtRestructuringAdvice {
  consolidationSuggestion: boolean;
  refinancingSuggestion: boolean;
  potentialSavings: number;
  reasons: string[];
  resources: {
    name: string;
    description: string;
    url?: string;
  }[];
}
