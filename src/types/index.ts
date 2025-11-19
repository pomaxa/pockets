export interface UserProfile {
  monthlySalary: number;
  housingType: 'rent' | 'mortgage' | 'own';
  housingCost: number;
  utilitiesCost: number;
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
  category: 'Housing' | 'Food' | 'Transport' | 'Entertainment' | 'Health' | 'Utilities' | 'Other';
  date: string;
  description?: string;
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
