# Testing Checklist

Use this checklist to test all features of the Pockets application.

## Setup

1. Start development server: `npm run dev`
2. Open browser to `http://localhost:5173`
3. Open browser DevTools (F12)
4. Clear localStorage before testing: `localStorage.clear()`

## Test Scenarios

### 1. Home Page (Landing)

- [ ] Page loads without errors
- [ ] "Start Free" button in header navigates to Calculator
- [ ] Hero section displays correctly
- [ ] "How It Works" section shows 3 steps
- [ ] Email subscribe form accepts input
- [ ] Subscribe button shows success message
- [ ] FAQ section displays 5 questions
- [ ] Footer links work
- [ ] Responsive on mobile (test at 375px width)

**Test Data:**
- Email: test@example.com

---

### 2. Calculator Page

#### Basic Functionality
- [ ] Form displays all required fields
- [ ] Can enter salary (e.g., 2000)
- [ ] Can select housing type
- [ ] Can enter housing cost (e.g., 400)
- [ ] Can enter utilities cost (e.g., 100)
- [ ] Can select emergency fund months (3, 6, or 12)
- [ ] Calculate button works

#### Validation
- [ ] Negative salary shows error
- [ ] Empty required fields show error
- [ ] Non-numeric values show error

#### Calculations
- [ ] Gross salary displays correctly
- [ ] Estimated taxes calculated (~20% = €400 for €2000)
- [ ] Net income = Gross - Taxes (€1600 for €2000)
- [ ] Mandatory expenses = Housing + Utilities (€500)
- [ ] Remaining = Net - Mandatory (€1100)
- [ ] Recommended Savings = 50% of Remaining (€550)
- [ ] Recommended Lifestyle = 50% of Remaining (€550)
- [ ] Emergency Fund Target = Mandatory × Months (€1500 for 3 months)

#### Persistence
- [ ] Data saves to localStorage on calculate
- [ ] Refresh page and data persists
- [ ] Can update values and recalculate

#### Navigation
- [ ] "Set a Savings Goal" button goes to Goals page
- [ ] "Find Financial Advisor" button goes to Info page

**Test Data:**
```
Salary: 2000
Housing Type: Rent
Housing Cost: 400
Utilities: 100
Emergency Fund: 3 months
Current Savings: 500
```

**Expected Results:**
```
Gross Salary: €2,000.00
Estimated Taxes: €400.00
Net Income: €1,600.00
Mandatory Expenses: €500.00
Remaining: €1,100.00
Recommended Savings: €550.00
Recommended Lifestyle: €550.00
Emergency Fund Target: €1,500.00
```

---

### 3. Goals Page

#### When Empty
- [ ] Shows "No Goals Yet" message
- [ ] "Create Your First Goal" button opens form

#### Adding Goals
- [ ] "Add Goal" button shows form
- [ ] Can enter goal name (e.g., "Emergency Fund")
- [ ] Can enter target amount (e.g., 5000)
- [ ] Can enter current amount (e.g., 500)
- [ ] Can set target date (optional)
- [ ] "Create Goal" saves the goal
- [ ] Form validation works (negative numbers rejected)

#### Goal Display
- [ ] Goal card shows name and target amount
- [ ] Progress bar displays correct percentage (10% for 500/5000)
- [ ] Shows remaining amount (€4,500)
- [ ] Shows estimated months to reach goal
- [ ] Can add €50, €100, or custom amount
- [ ] Adding money updates progress bar
- [ ] When goal reaches 100%, shows "Goal Reached!" message

#### Goal Management
- [ ] Can delete goal (with confirmation)
- [ ] Multiple goals can exist simultaneously
- [ ] Data persists after refresh

**Test Data:**
```
Goal 1:
Name: Emergency Fund
Target: 5000
Current: 500
Due Date: 2025-12-31

Goal 2:
Name: New Laptop
Target: 1500
Current: 300
Due Date: 2025-06-30
```

---

### 4. Expenses Page

#### When Empty
- [ ] Shows "No Expenses Yet" message
- [ ] "Add Your First Expense" button opens form

#### Adding Expenses
- [ ] "Add Expense" button shows form
- [ ] Can enter amount (e.g., 25.50)
- [ ] Can select category (dropdown with emojis)
- [ ] Can select date
- [ ] Can enter description (optional)
- [ ] "Add Expense" saves the expense
- [ ] Form validation works (negative/zero amounts rejected)

#### Expense Display
- [ ] Summary cards show:
  - Month total
  - Daily average
  - Total count
- [ ] Category breakdown shows bars with percentages
- [ ] Expenses sorted by date (newest first)
- [ ] Table shows: Date, Category, Description, Amount
- [ ] Category emojis display correctly

#### Filtering
- [ ] Month filter dropdown appears when expenses exist
- [ ] Can filter by different months
- [ ] Summary updates based on selected month

#### Expense Management
- [ ] Can delete expense (with confirmation)
- [ ] Multiple expenses can exist
- [ ] Data persists after refresh

**Test Data:**
```
Expense 1:
Amount: 25.50
Category: Food
Date: 2024-11-15
Description: Lunch at Rimi

Expense 2:
Amount: 50.00
Category: Transport
Date: 2024-11-14
Description: Monthly bus pass

Expense 3:
Amount: 120.00
Category: Utilities
Date: 2024-11-01
Description: Electricity bill

Expense 4:
Amount: 15.00
Category: Entertainment
Date: 2024-11-13
Description: Cinema ticket
```

**Expected Monthly Total:** €210.50

---

### 5. Info Page

#### Navigation
- [ ] Tab navigation shows 4 sections
- [ ] Clicking tabs switches content
- [ ] Active tab is highlighted

#### Content Sections
- [ ] "Financial Independence" section displays
- [ ] "Emergency Fund" section displays
- [ ] "Latvia Pension System" section displays with 3 pillars
- [ ] "Find a Financial Advisor" section displays

#### Consultants List
- [ ] Shows 5 consultant cards
- [ ] Each card shows: Name, Specialty, Description
- [ ] Contact info displays (Email, Phone, Website)
- [ ] Email links work (mailto:)
- [ ] Phone links work (tel:)
- [ ] Website links open in new tab
- [ ] Disclaimer shown at bottom

---

### 6. Navigation & Layout

#### Header
- [ ] Logo/title links to home page
- [ ] Navigation shows all 4 sections
- [ ] Active page highlighted
- [ ] Mobile menu works on small screens

#### Responsive Design
- [ ] Test at 375px (mobile)
- [ ] Test at 768px (tablet)
- [ ] Test at 1024px (desktop)
- [ ] Navigation collapses on mobile
- [ ] Forms stack vertically on mobile
- [ ] Tables scroll horizontally on mobile

#### Footer
- [ ] Footer displays on all app pages
- [ ] Links work

---

### 7. Data Persistence

#### localStorage
- [ ] Open DevTools → Application → Local Storage
- [ ] Verify keys exist:
  - `pockets_profile`
  - `pockets_goals`
  - `pockets_expenses`
- [ ] Add data, refresh page, data persists
- [ ] Clear localStorage, data disappears

---

### 8. Browser Compatibility

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on Mac)

---

### 9. Performance

- [ ] Initial page load < 2 seconds
- [ ] No console errors
- [ ] No console warnings (or minimal)
- [ ] No memory leaks (check in DevTools)

---

### 10. Edge Cases

#### Calculator
- [ ] Very large salary (e.g., 100,000) handles correctly
- [ ] Very small salary (e.g., 100) handles correctly
- [ ] Zero housing cost works
- [ ] Decimal values work (e.g., 1234.56)

#### Goals
- [ ] Goal with current amount > target amount shows 100%
- [ ] Goal with 0 target amount (should not allow)
- [ ] Adding huge amount to goal (e.g., 999999) works

#### Expenses
- [ ] Expense with very long description displays correctly
- [ ] Expense with special characters works
- [ ] Filtering month with no expenses shows empty state

---

## Bug Report Template

If you find a bug, report it with:

```
**Bug Description:**
Clear description of what went wrong

**Steps to Reproduce:**
1. Go to...
2. Click on...
3. Enter...
4. See error

**Expected Behavior:**
What should have happened

**Actual Behavior:**
What actually happened

**Screenshots:**
If applicable

**Environment:**
- Browser: Chrome 119
- OS: macOS 14
- Screen Size: 1920x1080
```

---

## Success Criteria

All checkboxes above should be checked before considering the app production-ready.

Priority Bugs:
- [ ] No critical bugs (app crashes, data loss)
- [ ] No high priority bugs (major feature broken)

Nice to Have:
- [ ] No medium priority bugs (minor issues)
- [ ] No low priority bugs (cosmetic issues)

---

## Next Steps After Testing

1. Fix all critical and high priority bugs
2. Document known issues
3. Create user guide/tutorial
4. Prepare for beta testing with real users
5. Set up error tracking (e.g., Sentry)
6. Plan v1.1 features based on feedback
