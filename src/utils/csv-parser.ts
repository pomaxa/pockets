import { Expense } from '../types';

/**
 * Revolut CSV format parser
 * Supports standard Revolut transaction export format
 */

/**
 * Map Revolut category to our expense categories
 */
const mapRevolutCategory = (revolutCategory: string): Expense['category'] => {
  const category = revolutCategory.toLowerCase().trim();

  // Housing related
  if (category.includes('home') || category.includes('utilities') || category.includes('bills')) {
    return 'Utilities';
  }

  // Food & Dining
  if (
    category.includes('restaurant') ||
    category.includes('groceries') ||
    category.includes('food') ||
    category.includes('dining') ||
    category.includes('cafe')
  ) {
    return 'Food';
  }

  // Transport
  if (
    category.includes('transport') ||
    category.includes('taxi') ||
    category.includes('fuel') ||
    category.includes('parking') ||
    category.includes('car')
  ) {
    return 'Transport';
  }

  // Entertainment
  if (
    category.includes('entertainment') ||
    category.includes('sport') ||
    category.includes('leisure') ||
    category.includes('hobby')
  ) {
    return 'Entertainment';
  }

  // Health
  if (
    category.includes('health') ||
    category.includes('pharmacy') ||
    category.includes('medical') ||
    category.includes('doctor')
  ) {
    return 'Health';
  }

  // Default to Other
  return 'Other';
};

/**
 * Parse CSV text into array of objects
 */
const parseCSV = (csvText: string): string[][] => {
  const lines = csvText.split('\n').filter((line) => line.trim());
  return lines.map((line) => {
    // Handle quoted fields with commas
    const fields: string[] = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }
    fields.push(currentField.trim());

    return fields;
  });
};

/**
 * Parse Revolut CSV format
 * Expected columns: Date, Description, Amount, Currency, [Category]
 */
export const parseRevolutCSV = (csvText: string): Expense[] => {
  const rows = parseCSV(csvText);

  if (rows.length === 0) {
    throw new Error('CSV file is empty');
  }

  // Get headers
  const headers = rows[0].map((h) => h.toLowerCase().trim());
  const dateIndex = headers.findIndex((h) => h.includes('date'));
  const descIndex = headers.findIndex((h) => h.includes('description') || h.includes('title'));
  const amountIndex = headers.findIndex((h) => h.includes('amount'));
  const categoryIndex = headers.findIndex((h) => h.includes('category') || h.includes('type'));

  if (dateIndex === -1 || amountIndex === -1) {
    throw new Error('CSV must contain Date and Amount columns');
  }

  const expenses: Expense[] = [];

  // Process data rows (skip header)
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];

    if (row.length < 2) continue; // Skip empty rows

    try {
      const dateStr = row[dateIndex]?.trim();
      const description = descIndex !== -1 ? row[descIndex]?.trim() : '';
      const amountStr = row[amountIndex]?.trim().replace(/[^\d.-]/g, ''); // Remove currency symbols
      const revolutCategory = categoryIndex !== -1 ? row[categoryIndex]?.trim() : '';

      if (!dateStr || !amountStr) continue;

      const parsedAmount = parseFloat(amountStr);

      // Only import expenses (negative amounts from Revolut = expenses)
      // Skip income (positive amounts) and zero amounts
      if (parsedAmount >= 0) continue;

      // Convert to positive for storage (we store all expenses as positive)
      const amount = Math.abs(parsedAmount);

      // Parse date - Revolut uses various formats
      let parsedDate: Date;
      if (dateStr.includes('/')) {
        // Format: DD/MM/YYYY or MM/DD/YYYY
        const parts = dateStr.split('/');
        if (parts.length === 3) {
          // Assume DD/MM/YYYY (European format)
          parsedDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        } else {
          parsedDate = new Date(dateStr);
        }
      } else if (dateStr.includes('-')) {
        // Format: YYYY-MM-DD
        parsedDate = new Date(dateStr);
      } else {
        parsedDate = new Date(dateStr);
      }

      if (isNaN(parsedDate.getTime())) {
        console.warn(`Invalid date: ${dateStr}`);
        continue;
      }

      const expense: Expense = {
        id: `import-${Date.now()}-${i}`,
        amount,
        category: revolutCategory ? mapRevolutCategory(revolutCategory) : 'Other',
        date: parsedDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        description: description || undefined,
      };

      expenses.push(expense);
    } catch (error) {
      console.warn(`Error parsing row ${i}:`, error);
      continue;
    }
  }

  return expenses;
};

/**
 * Parse generic CSV format
 * Tries to intelligently detect columns
 */
export const parseGenericCSV = (csvText: string): Expense[] => {
  const rows = parseCSV(csvText);

  if (rows.length === 0) {
    throw new Error('CSV file is empty');
  }

  const headers = rows[0].map((h) => h.toLowerCase().trim());

  // Try to find date column
  const dateIndex = headers.findIndex(
    (h) => h.includes('date') || h.includes('time') || h === 'when'
  );

  // Try to find amount column
  const amountIndex = headers.findIndex(
    (h) => h.includes('amount') || h.includes('sum') || h.includes('total') || h.includes('price')
  );

  // Try to find description column
  const descIndex = headers.findIndex(
    (h) =>
      h.includes('description') ||
      h.includes('title') ||
      h.includes('merchant') ||
      h.includes('name')
  );

  if (dateIndex === -1 || amountIndex === -1) {
    throw new Error(
      'Could not detect required columns. Please ensure CSV has Date and Amount columns.'
    );
  }

  const expenses: Expense[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 2) continue;

    try {
      const dateStr = row[dateIndex]?.trim();
      const amountStr = row[amountIndex]?.trim().replace(/[^\d.-]/g, '');
      const description = descIndex !== -1 ? row[descIndex]?.trim() : '';

      if (!dateStr || !amountStr) continue;

      const parsedAmount = parseFloat(amountStr);

      // Only import expenses (negative amounts = expenses)
      // Skip income (positive amounts) and zero amounts
      if (parsedAmount >= 0) continue;

      // Convert to positive for storage
      const amount = Math.abs(parsedAmount);

      const parsedDate = new Date(dateStr);
      if (isNaN(parsedDate.getTime())) {
        console.warn(`Invalid date: ${dateStr}`);
        continue;
      }

      const expense: Expense = {
        id: `import-${Date.now()}-${i}`,
        amount,
        category: 'Other',
        date: parsedDate.toISOString().split('T')[0],
        description: description || undefined,
      };

      expenses.push(expense);
    } catch (error) {
      console.warn(`Error parsing row ${i}:`, error);
      continue;
    }
  }

  return expenses;
};

/**
 * Auto-detect CSV format and parse
 */
export const parseCSVFile = (csvText: string): Expense[] => {
  // Try Revolut format first
  try {
    const expenses = parseRevolutCSV(csvText);
    if (expenses.length > 0) {
      return expenses;
    }
  } catch (error) {
    console.log('Not Revolut format, trying generic CSV parser');
  }

  // Fallback to generic parser
  return parseGenericCSV(csvText);
};
