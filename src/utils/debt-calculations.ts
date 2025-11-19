import { Debt, DebtWithPlan, DebtStrategy, DebtRestructuringAdvice } from '../types';

/**
 * Calculate months to pay off a single debt
 */
export const calculateDebtPayoffMonths = (
  balance: number,
  monthlyPayment: number,
  annualInterestRate: number
): number => {
  if (monthlyPayment <= 0 || balance <= 0) return 0;

  const monthlyRate = annualInterestRate / 100 / 12;

  // If no interest, simple division
  if (monthlyRate === 0) {
    return Math.ceil(balance / monthlyPayment);
  }

  // If monthly payment is less than or equal to interest, debt will never be paid off
  const monthlyInterest = balance * monthlyRate;
  if (monthlyPayment <= monthlyInterest) {
    return Infinity;
  }

  // Formula: months = -log(1 - (balance * rate / payment)) / log(1 + rate)
  const months = Math.log(1 - (balance * monthlyRate / monthlyPayment)) / Math.log(1 + monthlyRate);
  return Math.ceil(Math.abs(months));
};

/**
 * Calculate total interest paid on a debt
 */
export const calculateTotalInterest = (
  balance: number,
  monthlyPayment: number,
  annualInterestRate: number
): number => {
  const months = calculateDebtPayoffMonths(balance, monthlyPayment, annualInterestRate);
  if (months === Infinity || months === 0) return 0;

  const totalPaid = monthlyPayment * months;
  return totalPaid - balance;
};

/**
 * Debt Avalanche Strategy: Pay highest interest rate first
 */
export const calculateDebtAvalanche = (
  debts: Debt[],
  extraPayment: number = 0
): DebtStrategy => {
  if (debts.length === 0) {
    return {
      type: 'avalanche',
      debts: [],
      totalInterest: 0,
      monthsToPayoff: 0,
      totalPaid: 0,
    };
  }

  // Sort by interest rate (highest first)
  const sortedDebts = [...debts].sort((a, b) => b.interestRate - a.interestRate);

  return calculatePayoffPlan(sortedDebts, extraPayment, 'avalanche');
};

/**
 * Debt Snowball Strategy: Pay smallest balance first
 */
export const calculateDebtSnowball = (
  debts: Debt[],
  extraPayment: number = 0
): DebtStrategy => {
  if (debts.length === 0) {
    return {
      type: 'snowball',
      debts: [],
      totalInterest: 0,
      monthsToPayoff: 0,
      totalPaid: 0,
    };
  }

  // Sort by balance (smallest first)
  const sortedDebts = [...debts].sort((a, b) => a.currentBalance - b.currentBalance);

  return calculatePayoffPlan(sortedDebts, extraPayment, 'snowball');
};

/**
 * Custom Debt Strategy: User-defined order
 */
export const calculateDebtCustom = (
  debts: Debt[],
  customOrder: string[], // Array of debt IDs in priority order
  extraPayment: number = 0
): DebtStrategy => {
  if (debts.length === 0) {
    return {
      type: 'custom',
      debts: [],
      totalInterest: 0,
      monthsToPayoff: 0,
      totalPaid: 0,
    };
  }

  // Sort debts according to custom order
  const sortedDebts = customOrder
    .map(id => debts.find(d => d.id === id))
    .filter(d => d !== undefined) as Debt[];

  return calculatePayoffPlan(sortedDebts, extraPayment, 'custom');
};

/**
 * Calculate payoff plan for sorted debts
 */
const calculatePayoffPlan = (
  sortedDebts: Debt[],
  extraPayment: number,
  strategyType: 'avalanche' | 'snowball' | 'custom'
): DebtStrategy => {
  const debtsWithPlan: DebtWithPlan[] = [];
  let currentMonth = 0;
  let totalInterest = 0;
  let totalPaid = 0;

  // Create working copies of debts
  const workingDebts = sortedDebts.map(d => ({
    ...d,
    workingBalance: d.currentBalance,
  }));

  // Available extra payment (snowball effect)
  let availableExtraPayment = extraPayment;

  while (workingDebts.some(d => d.workingBalance > 0)) {
    currentMonth++;

    // Prevent infinite loop
    if (currentMonth > 1000) break;

    workingDebts.forEach((debt, index) => {
      if (debt.workingBalance <= 0) return;

      const monthlyRate = debt.interestRate / 100 / 12;
      const interestCharge = debt.workingBalance * monthlyRate;

      // Determine payment for this debt this month
      let payment = debt.monthlyPayment;

      // If this is the focus debt (first unpaid), add extra payment
      const isFirstUnpaid = workingDebts.findIndex(d => d.workingBalance > 0) === index;
      if (isFirstUnpaid) {
        payment += availableExtraPayment;
      }

      // Pay at least minimum, but not more than balance + interest
      payment = Math.min(payment, debt.workingBalance + interestCharge);

      // Apply payment
      const principalPayment = payment - interestCharge;
      debt.workingBalance -= principalPayment;

      totalInterest += interestCharge;
      totalPaid += payment;

      // If paid off, add freed-up payment to snowball
      if (debt.workingBalance <= 0) {
        debt.workingBalance = 0;
        availableExtraPayment += debt.monthlyPayment;
      }
    });
  }

  // Build final result
  workingDebts.forEach((debt, index) => {
    const months = calculateDebtPayoffMonths(
      debt.currentBalance,
      debt.monthlyPayment,
      debt.interestRate
    );

    const interest = calculateTotalInterest(
      debt.currentBalance,
      debt.monthlyPayment,
      debt.interestRate
    );

    debtsWithPlan.push({
      ...debt,
      payoffMonth: months,
      totalInterestPaid: interest,
      order: index + 1,
    });
  });

  return {
    type: strategyType,
    debts: debtsWithPlan,
    totalInterest,
    monthsToPayoff: currentMonth,
    totalPaid,
  };
};

/**
 * Compare Avalanche vs Snowball strategies
 */
export const compareStrategies = (
  debts: Debt[],
  extraPayment: number = 0
): {
  avalanche: DebtStrategy;
  snowball: DebtStrategy;
  savings: number; // Money saved with avalanche
  monthsSaved: number; // Months saved with avalanche
} => {
  const avalanche = calculateDebtAvalanche(debts, extraPayment);
  const snowball = calculateDebtSnowball(debts, extraPayment);

  return {
    avalanche,
    snowball,
    savings: snowball.totalInterest - avalanche.totalInterest,
    monthsSaved: snowball.monthsToPayoff - avalanche.monthsToPayoff,
  };
};

/**
 * Calculate total monthly debt payments
 */
export const calculateTotalMonthlyDebtPayments = (debts: Debt[]): number => {
  return debts.reduce((sum, debt) => sum + debt.monthlyPayment, 0);
};

/**
 * Calculate weighted average interest rate
 */
export const calculateWeightedAverageRate = (debts: Debt[]): number => {
  if (debts.length === 0) return 0;

  const totalBalance = debts.reduce((sum, debt) => sum + debt.currentBalance, 0);
  if (totalBalance === 0) return 0;

  const weightedSum = debts.reduce(
    (sum, debt) => sum + (debt.currentBalance * debt.interestRate),
    0
  );

  return weightedSum / totalBalance;
};

/**
 * Calculate debt-to-income ratio
 */
export const calculateDebtToIncomeRatio = (
  monthlyDebtPayments: number,
  monthlyIncome: number
): number => {
  if (monthlyIncome === 0) return 0;
  return (monthlyDebtPayments / monthlyIncome) * 100;
};

/**
 * Determine if consolidation makes sense
 */
export const shouldConsolidate = (debts: Debt[]): boolean => {
  if (debts.length < 2) return false;

  // Check if multiple high-interest debts exist
  const highInterestDebts = debts.filter(d => d.interestRate > 10);
  if (highInterestDebts.length < 2) return false;

  // Check if total debt is manageable for consolidation (< €20,000)
  const totalDebt = debts.reduce((sum, d) => sum + d.currentBalance, 0);
  if (totalDebt > 20000) return false;

  return true;
};

/**
 * Determine if refinancing makes sense
 */
export const shouldRefinance = (debt: Debt): boolean => {
  // Suggest refinancing for high-interest debts
  if (debt.type === 'credit_card' && debt.interestRate > 15) return true;
  if (debt.type === 'personal_loan' && debt.interestRate > 12) return true;
  if (debt.type === 'car_loan' && debt.interestRate > 8) return true;

  return false;
};

/**
 * Calculate potential savings from consolidation
 */
export const calculateConsolidationSavings = (
  debts: Debt[],
  consolidatedRate: number
): number => {
  const currentStrategy = calculateDebtAvalanche(debts, 0);

  // Create consolidated debt
  const totalBalance = debts.reduce((sum, d) => sum + d.currentBalance, 0);
  const totalMonthlyPayment = debts.reduce((sum, d) => sum + d.monthlyPayment, 0);

  const consolidatedDebt: Debt = {
    id: 'consolidated',
    name: 'Consolidated Loan',
    type: 'personal_loan',
    totalAmount: totalBalance,
    currentBalance: totalBalance,
    interestRate: consolidatedRate,
    minimumPayment: totalMonthlyPayment * 0.5,
    monthlyPayment: totalMonthlyPayment,
    createdAt: new Date().toISOString(),
  };

  const consolidatedStrategy = calculateDebtAvalanche([consolidatedDebt], 0);

  return currentStrategy.totalInterest - consolidatedStrategy.totalInterest;
};

/**
 * Get debt restructuring advice
 */
export const getDebtRestructuringAdvice = (
  debts: Debt[],
  monthlyIncome: number
): DebtRestructuringAdvice => {
  const reasons: string[] = [];
  const resources: { name: string; description: string; url?: string }[] = [];

  const consolidationSuggestion = shouldConsolidate(debts);
  const refinancingSuggestion = debts.some(d => shouldRefinance(d));

  // Calculate potential savings
  let potentialSavings = 0;
  if (consolidationSuggestion) {
    // Assume consolidation at 10% APR (typical personal loan in Latvia)
    potentialSavings = calculateConsolidationSavings(debts, 10);
  }

  // Build reasons
  if (consolidationSuggestion) {
    reasons.push(`You have ${debts.length} debts with varying interest rates.`);
    reasons.push('Consolidating into one loan could simplify payments and potentially save money.');
  }

  if (refinancingSuggestion) {
    const highInterestDebts = debts.filter(d => shouldRefinance(d));
    reasons.push(
      `You have ${highInterestDebts.length} high-interest debt(s) that could be refinanced.`
    );
  }

  const dti = calculateDebtToIncomeRatio(
    calculateTotalMonthlyDebtPayments(debts),
    monthlyIncome
  );

  if (dti > 43) {
    reasons.push(
      `Your debt-to-income ratio (${dti.toFixed(1)}%) is above the recommended 43% limit.`
    );
    reasons.push('Consider seeking professional debt counseling.');
  }

  // Add Latvia-specific resources
  if (consolidationSuggestion || refinancingSuggestion) {
    resources.push({
      name: 'Latvian Financial and Capital Market Commission',
      description: 'Regulatory authority for financial services in Latvia',
      url: 'https://www.fktk.lv/en/',
    });

    resources.push({
      name: 'Consumer Rights Protection Centre (PTAC)',
      description: 'Consumer protection and debt counseling services',
      url: 'https://www.ptac.gov.lv/en',
    });
  }

  return {
    consolidationSuggestion,
    refinancingSuggestion,
    potentialSavings,
    reasons,
    resources,
  };
};
