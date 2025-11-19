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

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate required string field
 */
export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Validate percentage (0-100)
 */
export const validatePercentage = (value: number): boolean => {
  return value >= 0 && value <= 100 && !isNaN(value) && isFinite(value);
};

/**
 * Validate date format (YYYY-MM-DD)
 */
export const validateDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};
