/**
 * Latvia-specific constants and configuration
 */

// Tax rates for Latvia
export const LATVIA_TAX = {
  PIT_RATE: 0.20, // Personal Income Tax (simplified)
  SOCIAL_SECURITY_RATE: 0.1095, // Employee social security contributions
};

// Currency
export const CURRENCY = 'EUR';
export const LOCALE = 'lv-LV';

// Expense categories in Latvian and English
export const EXPENSE_CATEGORIES = [
  { value: 'Housing', label: 'Housing / Mājoklis', emoji: '🏠' },
  { value: 'Food', label: 'Food / Pārtika', emoji: '🍽️' },
  { value: 'Transport', label: 'Transport / Transports', emoji: '🚗' },
  { value: 'Entertainment', label: 'Entertainment / Izklaide', emoji: '🎉' },
  { value: 'Health', label: 'Health / Veselība', emoji: '💊' },
  { value: 'Utilities', label: 'Utilities / Komunālie', emoji: '💡' },
  { value: 'Other', label: 'Other / Citi', emoji: '📦' },
] as const;

// Housing types
export const HOUSING_TYPES = [
  { value: 'rent', label: 'Rent / Īre' },
  { value: 'mortgage', label: 'Mortgage / Hipotēka' },
  { value: 'own', label: 'Own / Pašam pieder' },
] as const;

// Emergency fund options (in months)
export const EMERGENCY_FUND_MONTHS = [3, 6, 12] as const;

// Recommended savings percentage
export const RECOMMENDED_SAVINGS_PERCENTAGE = 50; // 50% of remaining income

// Average costs in Latvia (approximate, for reference)
export const AVERAGE_COSTS_LATVIA = {
  rentRiga: 400, // Average rent in Riga (1-room apartment)
  rentOther: 250, // Average rent outside Riga
  utilities: 100, // Average utilities
  food: 250, // Average monthly food cost
  transport: 50, // Average monthly transport
};
