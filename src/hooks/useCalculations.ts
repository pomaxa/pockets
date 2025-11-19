import { useState, useEffect } from 'react';
import { PocketCalculation, UserProfile } from '../types';
import { calculatePockets } from '../utils/calculations';
import { useLocalStorage } from './useLocalStorage';

/**
 * Custom hook for handling pocket calculations
 * Automatically calculates pockets when profile changes
 */
export const useCalculations = () => {
  const { getProfile } = useLocalStorage();
  const [calculation, setCalculation] = useState<PocketCalculation | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const savedProfile = getProfile();
    if (savedProfile) {
      setProfile(savedProfile);
      const calc = calculatePockets(
        savedProfile.monthlySalary,
        savedProfile.housingCost,
        savedProfile.utilitiesCost,
        savedProfile.emergencyFundMonths
      );
      setCalculation(calc);
    }
  }, []);

  const recalculate = (newProfile: UserProfile): PocketCalculation => {
    const calc = calculatePockets(
      newProfile.monthlySalary,
      newProfile.housingCost,
      newProfile.utilitiesCost,
      newProfile.emergencyFundMonths
    );
    setCalculation(calc);
    setProfile(newProfile);
    return calc;
  };

  return {
    calculation,
    profile,
    recalculate,
  };
};
