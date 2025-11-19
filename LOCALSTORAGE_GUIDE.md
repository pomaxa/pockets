# LocalStorage Implementation Guide

## Overview

The Pockets app uses browser localStorage to persist all user data locally without any backend server. All data is stored in the browser and persists across sessions.

## Storage Keys

The app uses the following localStorage keys:

| Key | Purpose | Data Type |
|-----|---------|-----------|
| `pockets_profile` | User's financial profile (salary, housing, etc.) | `UserProfile` object |
| `pockets_calculator_draft` | Auto-saved calculator form inputs (draft state) | Form data object |
| `pockets_goals` | Array of savings goals | `Goal[]` array |
| `pockets_expenses` | Array of tracked expenses | `Expense[]` array |
| `pockets_debts` | Array of debts with repayment info | `Debt[]` array |

## How It Works

### Calculator Page - Auto-Save Form Drafts

**Feature:** Calculator form inputs are automatically saved as you type.

**Implementation:**
- Form state auto-saves to `pockets_calculator_draft` whenever any input changes
- On page load, checks for saved draft first, then loads completed profile
- When user clicks "Calculate", saves complete profile to `pockets_profile` and clears draft
- This allows users to partially fill the form and come back later without losing data

**User Experience:**
1. User starts typing salary: `€2000` - **Auto-saved instantly**
2. User closes browser/tab
3. User returns later - **Form is pre-filled with draft data**
4. User completes form and clicks "Calculate" - **Profile saved, draft cleared**

### Goals Page - Immediate Persistence

**Feature:** Goals are saved immediately when created, updated, or deleted.

**Implementation:**
- `addGoal()` - Adds goal and saves array to localStorage
- `updateGoal()` - Updates goal (e.g., adding money) and saves
- `deleteGoal()` - Removes goal and saves updated array
- On page load, retrieves all goals from `pockets_goals`

**User Experience:**
1. User creates goal "Emergency Fund - €5000"
2. Goal appears instantly in list - **Saved to localStorage**
3. User refreshes page - **Goal is still there**
4. User adds €100 to goal - **Updated amount saved**

### Expenses Page - Immediate Persistence

**Feature:** Expenses are tracked and saved immediately.

**Implementation:**
- `addExpense()` - Adds expense and saves array
- `deleteExpense()` - Removes expense and saves array
- Expenses sorted by date (newest first)
- On page load, retrieves all expenses from `pockets_expenses`

**User Experience:**
1. User adds expense "Grocery - €45.50"
2. Expense appears in list - **Saved to localStorage**
3. Monthly totals and category breakdown update
4. Data persists across browser sessions

### Debts Page - Immediate Persistence

**Feature:** Debts and payments are tracked with full history.

**Implementation:**
- `addDebt()` - Adds debt and saves array
- `updateDebt()` - Updates debt (e.g., making payment) and saves
- `deleteDebt()` - Removes debt and saves array
- On page load, retrieves all debts from `pockets_debts`

**User Experience:**
1. User adds debt "Credit Card - €1500 @ 18%"
2. Debt appears with repayment strategy - **Saved to localStorage**
3. User makes €100 payment
4. Balance updates, new payoff timeline calculated - **Saved to localStorage**

## Benefits of LocalStorage Approach

### Advantages
✅ **Privacy** - All data stays on user's device, never sent to servers
✅ **Offline** - Works completely offline, no internet required
✅ **Fast** - Instant reads/writes, no network latency
✅ **Simple** - No backend infrastructure, accounts, or authentication needed
✅ **Free** - No hosting costs for database/backend

### Limitations
⚠️ **Device-Specific** - Data doesn't sync across devices
⚠️ **Browser-Specific** - Clearing browser data erases all information
⚠️ **No Backup** - Users should manually backup important data
⚠️ **Storage Limit** - ~5-10MB limit (sufficient for this app)

## Data Structure Examples

### Profile
```json
{
  "monthlySalary": 2000,
  "housingType": "rent",
  "housingCost": 400,
  "utilitiesCost": 100,
  "monthlyDebtPayments": 150,
  "currentSavings": 500,
  "emergencyFundMonths": 6,
  "savingsPercentage": 50,
  "createdAt": "2024-11-19T12:00:00.000Z"
}
```

### Calculator Draft
```json
{
  "monthlySalary": "2000",
  "housingType": "rent",
  "housingCost": "400",
  "utilitiesCost": "100",
  "emergencyFundMonths": 6,
  "currentSavings": "500"
}
```

### Goals Array
```json
[
  {
    "id": "1700000000001",
    "name": "Emergency Fund",
    "targetAmount": 3000,
    "currentAmount": 500,
    "createdAt": "2024-11-19T12:00:00.000Z",
    "dueDate": "2025-06-01"
  }
]
```

### Expenses Array
```json
[
  {
    "id": "1700000000002",
    "amount": 45.50,
    "category": "Food",
    "date": "2024-11-19",
    "description": "Grocery shopping at Rimi"
  }
]
```

### Debts Array
```json
[
  {
    "id": "1700000000003",
    "name": "Credit Card",
    "type": "credit_card",
    "totalAmount": 2000,
    "currentBalance": 1500,
    "interestRate": 18,
    "minimumPayment": 50,
    "monthlyPayment": 100,
    "createdAt": "2024-11-19T12:00:00.000Z"
  }
]
```

## Testing LocalStorage

### View Data in Browser DevTools
1. Open browser DevTools (F12)
2. Go to "Application" tab (Chrome) or "Storage" tab (Firefox)
3. Click "Local Storage" → Your domain
4. See all `pockets_*` keys and their values

### Clear All Data
```javascript
// In browser console
localStorage.removeItem('pockets_profile');
localStorage.removeItem('pockets_calculator_draft');
localStorage.removeItem('pockets_goals');
localStorage.removeItem('pockets_expenses');
localStorage.removeItem('pockets_debts');
```

Or use the `clearAllData()` function from useLocalStorage hook (if implemented in UI).

## Future Enhancements

### Possible Improvements
- **Export/Import** - Allow users to download/upload JSON backup files
- **Cloud Sync** - Optional cloud storage with user authentication
- **Data Validation** - Check for corrupted localStorage data on load
- **Migration** - Version control for data structure changes
- **Compression** - Compress data to maximize storage space

## Technical Details

### useLocalStorage Hook

Located at: `src/hooks/useLocalStorage.ts`

**Key Functions:**
- `getProfile()`, `saveProfile()`, `clearProfile()`
- `getGoals()`, `addGoal()`, `updateGoal()`, `deleteGoal()`
- `getExpenses()`, `addExpense()`, `deleteExpense()`
- `getDebts()`, `addDebt()`, `updateDebt()`, `deleteDebt()`
- `clearAllData()` - Clears everything

**Error Handling:**
All functions include try-catch blocks to handle:
- Corrupted JSON data
- Storage quota exceeded
- Browser security restrictions

### Auto-Save Implementation (Calculator)

```typescript
// Save draft whenever form inputs change
useEffect(() => {
  const draftData = {
    monthlySalary,
    housingType,
    housingCost,
    utilitiesCost,
    emergencyFundMonths,
    currentSavings,
  };

  if (monthlySalary || housingCost || utilitiesCost) {
    localStorage.setItem('pockets_calculator_draft', JSON.stringify(draftData));
  }
}, [monthlySalary, housingType, housingCost, utilitiesCost, emergencyFundMonths, currentSavings]);
```

## User Guidelines

### What Users Should Know

**Data Persistence:**
- All data is stored locally in your browser
- Data persists even after closing the browser
- Each browser stores data separately (Chrome data won't appear in Firefox)

**Data Loss Prevention:**
- Don't clear browser data unless you want to reset the app
- Use "Private/Incognito" mode carefully - data won't persist
- Consider taking screenshots of important information

**Privacy:**
- Your data never leaves your device
- No accounts, no tracking, no cloud storage
- Completely private and secure

**Limitations:**
- Data doesn't sync across devices
- If you use multiple devices, data will be separate on each
- Clearing browser data will erase all app information

---

**Last Updated:** 2024-11-19
**Version:** 1.0
