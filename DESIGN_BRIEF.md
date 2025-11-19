# Pockets - Design Brief for Figma

## Project Overview

**Project Name:** Pockets
**Tagline:** Financial literacy for Latvia
**Purpose:** A financial literacy web application designed specifically for young people in Latvia to help them manage their money, set savings goals, track expenses, manage debts, and build financial independence.

**Target Audience:**
- Young professionals (ages 20-35) in Latvia
- People new to financial planning
- Individuals looking to pay off debts strategically
- Users who want simple, actionable financial guidance
- Latvian speakers (bilingual interface: English/Latvian)

---

## Brand Identity

### Color Palette
- **Primary:** `#10b981` (Emerald Green) - Growth, prosperity, financial health
- **Secondary:** `#6b7280` (Gray) - Stability, reliability
- **Accent:** `#ef4444` (Red) - Warnings, debts, urgent actions
- **Success/Positive:** Green shades (50-600)
- **Warning:** Yellow shades (50-700)
- **Info:** Blue shades (50-600)

### Design Philosophy
- Clean, modern, approachable
- Not intimidating or overly corporate
- Data visualization should be clear and actionable
- Mobile-first responsive design
- Accessibility-focused (WCAG AA minimum)

### Typography
- Modern sans-serif fonts (similar to Inter, Geist, or system fonts)
- Monospace for currency amounts and numbers
- Clear hierarchy: headings, body text, labels

---

## Application Structure

### Navigation Flow
```
Home (Landing Page)
  ↓
App Layout (with header navigation)
  ├── Calculator
  ├── Goals
  ├── Expenses
  ├── Debts
  └── Info
```

---

## Pages & Features to Design

### 1. Home Page (Landing)
**Purpose:** Introduce the app and convince users to start using it

**Components:**
- Hero section with catchy headline
- Value propositions (why use Pockets?)
- Feature highlights (Calculator, Goals, Expenses, Debts)
- Call-to-action button: "Start Managing Your Money"
- Footer with copyright and links

**Design Notes:**
- Welcoming, friendly, not overwhelming
- Illustrations or icons representing financial concepts
- Should build trust and reduce anxiety about money management

---

### 2. App Layout (Header & Navigation)
**Purpose:** Consistent navigation across all app pages

**Components:**
- **Header:**
  - Logo/brand "Pockets"
  - Desktop navigation: Calculator | Goals | Expenses | Debts | Info
  - Active state highlighting

- **Mobile Navigation:**
  - Horizontal scrollable tabs below header
  - Same navigation items

- **Footer:**
  - Copyright info
  - Link to Info page

**Design Notes:**
- Sticky header for easy navigation
- Clear active states
- Responsive breakpoints for mobile/tablet/desktop

---

### 3. Calculator Page
**Purpose:** Calculate income breakdown and recommended savings/spending

**Components:**

**Form Section (Left/Top):**
- Monthly Salary (Gross) - number input
- Housing Type - dropdown (Rent, Mortgage, Own Home)
- Housing Cost (Monthly) - number input
- Utilities (Monthly) - number input
- Emergency Fund Target - dropdown (3, 6, 12 months)
- Current Savings - number input (optional)
- "Calculate My Pockets" button (primary, full-width)

**Results Section (Right/Bottom):**
- **Income Breakdown:**
  - Gross Salary (value)
  - Estimated Taxes ~20% (negative, red)
  - Net Income (green, emphasized)

- **Expenses:**
  - Mandatory Expenses (negative, red)
  - Remaining (green, bold, large)

- **Recommended Split:**
  - Savings Pocket (50%) - green background card
    - Amount in large font
    - Description: "Save this amount each month..."
  - Lifestyle Pocket (50%) - blue background card
    - Amount in large font
    - Description: "Use this for food, transport, entertainment..."

- **Emergency Fund Target:**
  - Yellow background card
  - Target amount
  - Description: "X months of mandatory expenses"

**Action Buttons:**
- "Set a Savings Goal" → navigates to Goals page
- "Find Financial Advisor" → navigates to Info page

**Design Notes:**
- Visual hierarchy: form → breakdown → recommendations
- Clear visual separation between income and expenses
- Large, readable currency amounts with monospace font
- Color coding: green = money in, red = money out
- Card-based layout for different pockets
- Progress visualization could be added

---

### 4. Goals Page
**Purpose:** Set and track savings goals

**Components:**

**Add Goal Form:**
- Goal Name - text input
- Goal Amount - number input
- Target Date - date picker
- Category - dropdown (Emergency Fund, Vacation, Education, etc.)
- "Add Goal" button

**Goals Dashboard:**
- Summary cards:
  - Total Goals Amount
  - Total Saved (from profile)
  - Completion Progress (%)

**Individual Goal Cards:**
Each goal displays:
- Goal name and category icon
- Progress bar (current/target)
- Amount saved / Target amount
- Remaining amount
- Target date
- Status indicator
- Actions: Edit | Delete

**Empty State:**
- Illustration or icon
- Message: "No savings goals yet"
- CTA: "Create your first goal"

**Design Notes:**
- Visual progress bars with percentage
- Color-coded by status (on track, behind, completed)
- Celebration state for completed goals
- Date countdown or "days remaining"
- Category icons for quick identification

---

### 5. Expenses Page
**Purpose:** Track daily expenses and analyze spending patterns

**Components:**

**Add Expense Form:**
- Amount - number input
- Category - dropdown with emojis:
  - 🏠 Housing
  - 🍔 Food
  - 🚗 Transport
  - 🎉 Entertainment
  - 💊 Health
  - 💡 Utilities
  - 💳 Debt Payment
  - 📦 Other
- Date - date picker
- Description - text input (optional)
- "Add Expense" button

**Spending Summary:**
- Total Expenses (current month)
- Breakdown by category (pie chart or bars)
- Top spending categories

**Expense List:**
- Chronological list of expenses
- Each entry shows:
  - Category emoji and name
  - Amount (prominent)
  - Date
  - Description (if any)
  - Delete button

**Filters:**
- By category
- By date range
- Sort options

**Empty State:**
- "No expenses tracked yet"
- CTA to add first expense

**Design Notes:**
- Category colors consistent throughout
- Visual spending patterns (charts)
- Easy-to-scan list view
- Quick delete/edit functionality
- Month-to-month comparison could be added

---

### 6. Debts Page
**Purpose:** Manage debts and visualize repayment strategies

**Components:**

**Add Debt Form:**
- Debt Name - text input
- Debt Type - dropdown:
  - 💳 Credit Card
  - 💵 Personal Loan
  - 🏠 Mortgage
  - 🚗 Car Loan
  - 🎓 Student Loan
  - 📋 Other
- Total Amount - number input
- Current Balance - number input
- Interest Rate (APR %) - number input
- Minimum Payment - number input
- Monthly Payment - number input
- Notes - textarea (optional)
- "Add Debt" button

**Debt Summary Dashboard:**
- Total Debt (large, prominent)
- Total Monthly Payments
- Average Interest Rate
- Debt-to-Income Ratio (with warning if high)

**Strategy Selector:**
- Toggle/tabs: Avalanche vs Snowball
- Brief explanation of each strategy
- Comparison metrics:
  - Total interest paid
  - Months to payoff
  - Potential savings

**Debt List (Ordered by Strategy):**
Each debt card shows:
- Priority order number (#1, #2, etc.)
- Debt name and type icon
- Progress bar (paid/total)
- Current balance / Original amount
- Interest rate badge
- Monthly payment
- Payoff timeline estimate
- "Make Payment" button
- Edit | Delete actions

**Strategy Comparison Panel:**
- Side-by-side comparison of Avalanche vs Snowball
- Highlighted savings amount
- Visual timeline comparison

**Restructuring Advice:**
- Consolidation suggestion (if applicable)
- Refinancing suggestion (if applicable)
- Potential savings amount
- Latvia-specific resources:
  - FKTK (Financial regulator)
  - PTAC (Consumer protection)
  - Credit Bureau of Latvia
  - Links and descriptions

**Empty State:**
- Positive message: "No debts! Great job!"
- Or: "Add your first debt to create a payoff plan"

**Design Notes:**
- Serious but hopeful tone
- Clear visual priority order
- Progress visualization is key
- Color coding: red for high interest, yellow for medium, green for low
- Strategy comparison should be easy to understand
- Restructuring advice in highlighted panel
- Latvia-specific information clearly marked

---

### 7. Info Page
**Purpose:** Financial education and resources

**Components:**

**Educational Content Sections:**
- About Pockets
- Financial literacy tips
- Latvia-specific financial information
- How to use each feature

**Financial Advisors/Resources:**
- List of consultants/resources
- Contact information
- Services offered
- Links to external resources

**Latvia-Specific Info:**
- Tax information (20% PIT)
- Social contributions
- Banking regulations
- Consumer protection agencies
- Helpful links

**Design Notes:**
- Easy-to-read content layout
- Accordion or tabbed sections
- External links clearly marked
- Trust indicators (official sources)
- Bilingual content where appropriate

---

## Design Deliverables Needed

### Desktop Designs (1440px+)
1. Home page (landing)
2. Calculator page (empty state)
3. Calculator page (with results)
4. Goals page (with 2-3 sample goals)
5. Expenses page (with sample expenses and chart)
6. Debts page (with 2-3 sample debts)
7. Info page

### Tablet Designs (768px - 1439px)
- Key responsive breakpoints for main pages

### Mobile Designs (375px - 767px)
- All pages optimized for mobile
- Mobile navigation states
- Touch-friendly buttons and inputs

### Components Library
- Buttons (primary, secondary, danger)
- Form inputs (text, number, dropdown, date)
- Cards (goal card, debt card, expense item)
- Progress bars
- Navigation (desktop, mobile)
- Summary cards/badges
- Charts (pie chart, bar chart)
- Modals/dialogs
- Empty states
- Loading states
- Error states

---

## Technical Constraints

**Technology Stack:**
- React 18 + TypeScript
- Tailwind CSS (utility-first styling)
- React Router (navigation)
- No backend (localStorage only)

**Browser Support:**
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)

**Performance:**
- Lightweight assets
- Optimized images/icons
- Fast load times

---

## User Experience Priorities

1. **Simplicity:** Don't overwhelm with financial jargon
2. **Clarity:** Make numbers and progress visible and understandable
3. **Actionability:** Every page should have clear next steps
4. **Encouragement:** Positive language, celebrate progress
5. **Trust:** Professional but approachable design
6. **Accessibility:** High contrast, readable fonts, keyboard navigation
7. **Responsiveness:** Works seamlessly on all devices

---

## Visual Style References

**Inspiration:**
- Modern fintech apps (Revolut, N26, but simpler)
- Personal finance tools (Mint, YNAB, but friendlier)
- Clean dashboard designs
- Soft shadows and rounded corners
- Plenty of white space
- Data visualization that tells a story

**Avoid:**
- Overly corporate/banking aesthetic
- Cluttered interfaces
- Intimidating financial terminology
- Dark patterns or hidden information

---

## Success Metrics for Design

A successful design will:
- Make financial planning feel approachable, not scary
- Clearly communicate the user's financial situation
- Motivate users to save and reduce debt
- Work seamlessly on mobile devices
- Be usable by people with varying financial literacy
- Reflect Latvian cultural context while being modern and international

---

## Next Steps

1. Review this brief and provide feedback
2. Create wireframes for each page
3. Design high-fidelity mockups
4. Create component library in Figma
5. Prepare design system documentation
6. Export assets for development
7. Collaborate on implementation

---

## Contact & Questions

For questions about functionality, calculations, or technical implementation, please refer to:
- Source code in `/src` directory
- Type definitions in `/src/types/index.ts`
- Calculation logic in `/src/utils/`
- Existing Tailwind styling in components

---

**Last Updated:** 2024
**Project Status:** MVP Implementation Complete, Ready for Design Enhancement
