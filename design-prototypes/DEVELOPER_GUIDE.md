# Developer Implementation Guide

Quick reference for implementing the Pockets design system in your application.

## Quick Start

```bash
# Clone or download the design-prototypes folder
cd design-prototypes

# Open in browser to preview
open index.html
open calculator.html
open icon-showcase.html
```

## File Organization

```
your-project/
├── public/
│   └── assets/          # Copy all SVG files here
├── src/
│   ├── components/      # Extract components from HTML
│   ├── styles/
│   │   └── variables.css  # Copy CSS variables
│   └── pages/
│       ├── Home.jsx
│       └── Calculator.jsx
```

## CSS Variables Reference

```css
/* Copy these to your root stylesheet */
:root {
  /* Colors */
  --color-primary: #10b981;
  --color-primary-dark: #059669;
  --color-secondary: #6b7280;
  --color-accent: #ef4444;
  --color-bg: #f9fafb;
  --color-white: #ffffff;
  --color-text: #1f2937;
  --color-text-light: #6b7280;
  --color-border: #e5e7eb;

  /* Spacing (8px grid) */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;

  /* Visual */
  --radius: 8px;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

  /* Typography */
  --font-sans: 'Inter', sans-serif;
  --font-mono: 'Roboto Mono', monospace;
}
```

## Component Extraction Examples

### Button Component (React)

```jsx
// src/components/Button.jsx
export function Button({ variant = 'primary', children, ...props }) {
  return (
    <button
      className={`btn btn-${variant}`}
      {...props}
    >
      {children}
    </button>
  );
}

// Usage
<Button variant="primary">Calculate My Pockets</Button>
<Button variant="secondary">Find Advisor</Button>
```

### Card Component (React)

```jsx
// src/components/Card.jsx
export function Card({ icon, title, children }) {
  return (
    <div className="card">
      {icon && <img src={icon} alt="" className="card-icon" />}
      {title && <h3>{title}</h3>}
      <p>{children}</p>
    </div>
  );
}

// Usage
<Card
  icon="/assets/icon-calculator.svg"
  title="Pocket Calculator"
>
  Calculate how to divide your income into different "pockets"
</Card>
```

### Info Card Component (React)

```jsx
// src/components/InfoCard.jsx
export function InfoCard({ color, label, value, description }) {
  return (
    <div className={`info-card info-card-${color}`}>
      <h4>{label}</h4>
      <div className="value">{value}</div>
      {description && <p>{description}</p>}
    </div>
  );
}

// Usage
<InfoCard
  color="green"
  label="Savings Pocket (50%)"
  value="€550 / month"
  description="For emergency fund, goals, and future"
/>
```

### Form Input Component (React)

```jsx
// src/components/Input.jsx
export function Input({ label, required, ...props }) {
  return (
    <div className="form-group">
      <label className={required ? 'required' : ''}>
        {label}
      </label>
      <input {...props} />
    </div>
  );
}

// Usage
<Input
  label="Monthly Salary (Gross)"
  type="number"
  required
  placeholder="€2000"
/>
```

## Icon Implementation

### Option 1: Direct SVG Import (React)

```jsx
// src/components/Icon.jsx
import calculator from '../assets/icon-calculator.svg';
import goals from '../assets/icon-goals.svg';

const icons = { calculator, goals };

export function Icon({ name, size = 24 }) {
  return (
    <img
      src={icons[name]}
      alt=""
      width={size}
      height={size}
    />
  );
}

// Usage
<Icon name="calculator" size={48} />
```

### Option 2: SVG as Components (React)

```jsx
// src/components/icons/Calculator.jsx
export function CalculatorIcon({ size = 24, color = "#10b981" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* SVG path content */}
    </svg>
  );
}
```

## Calculator Logic

```javascript
// src/utils/calculator.js
export function calculatePockets({
  salary,
  housingCost,
  utilities,
  emergencyMonths = 6,
  taxRate = 0.20
}) {
  const taxes = salary * taxRate;
  const netIncome = salary - taxes;
  const mandatoryExpenses = housingCost + utilities;
  const remaining = netIncome - mandatoryExpenses;

  return {
    grossSalary: salary,
    taxes,
    netIncome,
    mandatoryExpenses,
    remaining,
    savingsPocket: remaining * 0.50,
    lifestylePocket: remaining * 0.50,
    emergencyFundTarget: mandatoryExpenses * emergencyMonths
  };
}

// Usage
const results = calculatePockets({
  salary: 2000,
  housingCost: 400,
  utilities: 100,
  emergencyMonths: 6
});
```

## Tailwind CSS Configuration

If using Tailwind, add these to your config:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#10b981',
        'primary-dark': '#059669',
        secondary: '#6b7280',
        accent: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '8px',
      },
      spacing: {
        // Already in Tailwind, but for reference:
        // 1: 4px, 2: 8px, 4: 16px, 6: 24px, 8: 32px, 12: 48px, 16: 64px
      }
    }
  }
}
```

## Responsive Grid Utilities

```css
/* Three-column grid (collapses to 1 column on mobile) */
.grid-3 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

/* Four-column grid */
.grid-4 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
}

/* Two-column grid */
.grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: var(--spacing-lg);
}
```

## Currency Formatting

```javascript
// src/utils/formatCurrency.js
export function formatCurrency(value, locale = 'en-US') {
  return '€' + value.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}

// Usage
formatCurrency(1234); // "€1,234"
formatCurrency(550.50); // "€550"
```

## Form Validation Example

```javascript
// src/utils/validation.js
export function validateCalculatorForm(values) {
  const errors = {};

  if (!values.salary || values.salary <= 0) {
    errors.salary = 'Please enter a valid salary';
  }

  if (!values.housingCost || values.housingCost < 0) {
    errors.housingCost = 'Please enter a valid housing cost';
  }

  if (!values.utilities || values.utilities < 0) {
    errors.utilities = 'Please enter a valid utilities amount';
  }

  const totalExpenses = (values.housingCost || 0) + (values.utilities || 0);
  const netIncome = (values.salary || 0) * 0.8; // After 20% tax

  if (totalExpenses > netIncome) {
    errors.general = 'Your expenses exceed your net income';
  }

  return errors;
}
```

## State Management (React Example)

```jsx
// src/pages/Calculator.jsx
import { useState } from 'react';
import { calculatePockets } from '../utils/calculator';

export function Calculator() {
  const [formData, setFormData] = useState({
    salary: 2000,
    housingCost: 400,
    utilities: 100,
    emergencyMonths: 6,
    currentSavings: 500
  });

  const [results, setResults] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const calculatedResults = calculatePockets(formData);
    setResults(calculatedResults);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: parseFloat(e.target.value) || 0
    });
  };

  return (
    <div className="grid-2">
      <CalculatorForm
        data={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
      <ResultsDisplay results={results} />
    </div>
  );
}
```

## API Integration Points

```javascript
// src/api/calculations.js
export async function saveCalculation(userId, calculationData) {
  const response = await fetch('/api/calculations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      ...calculationData,
      timestamp: new Date().toISOString()
    })
  });
  return response.json();
}

export async function getCalculationHistory(userId) {
  const response = await fetch(`/api/calculations/${userId}`);
  return response.json();
}
```

## Testing Examples

```javascript
// src/utils/calculator.test.js
import { calculatePockets } from './calculator';

describe('calculatePockets', () => {
  test('calculates correct net income', () => {
    const result = calculatePockets({
      salary: 2000,
      housingCost: 400,
      utilities: 100,
    });

    expect(result.netIncome).toBe(1600); // 2000 - 20% tax
  });

  test('splits remaining 50/50', () => {
    const result = calculatePockets({
      salary: 2000,
      housingCost: 400,
      utilities: 100,
    });

    expect(result.savingsPocket).toBe(550);
    expect(result.lifestylePocket).toBe(550);
  });
});
```

## Deployment Checklist

- [ ] Copy all SVG assets to public/assets
- [ ] Import Google Fonts (Inter, Roboto Mono)
- [ ] Set up CSS variables
- [ ] Create reusable components
- [ ] Implement calculator logic
- [ ] Add form validation
- [ ] Set up state management
- [ ] Add responsive breakpoints
- [ ] Test on mobile devices
- [ ] Optimize images/SVGs
- [ ] Add loading states
- [ ] Implement error handling
- [ ] Add analytics tracking
- [ ] Set up API endpoints
- [ ] Configure authentication
- [ ] Add accessibility features
- [ ] Test cross-browser compatibility

## Performance Tips

1. **Lazy load pages**: Use React.lazy() or next/dynamic
2. **Optimize SVGs**: Already optimized in this package
3. **Use CSS variables**: Faster than inline styles
4. **Memoize calculations**: Use useMemo for calculator results
5. **Code splitting**: Separate calculator logic from landing page

## Accessibility Checklist

- [ ] All images have alt text
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Form inputs have labels
- [ ] Focus states visible
- [ ] Keyboard navigation works
- [ ] Color contrast meets WCAG AA
- [ ] ARIA labels where needed
- [ ] Screen reader tested

## Resources

- **Fonts**: [Google Fonts](https://fonts.google.com)
- **Icons**: All included in `/assets` folder
- **Color palette**: See README.md
- **Design system**: See icon-showcase.html

## Support

For questions about implementation:
1. Check README.md for design decisions
2. Review icon-showcase.html for visual reference
3. Inspect styles.css for exact CSS implementations
4. Test prototypes in browser for interaction patterns

---

**Last Updated**: 2025-11-19
**Version**: 1.0
**Package Size**: ~104KB
