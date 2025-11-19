# Pockets - Financial Literacy for Latvia

A web application designed to help young people in Latvia take control of their finances through simple, practical tools.

## Features

- **Pocket Calculator**: Calculate how much you should save and spend based on your salary and expenses
- **Goals Tracking**: Set and track financial goals with progress visualization
- **Expense Tracker**: Log and categorize expenses with monthly breakdowns
- **Financial Education**: Learn about financial independence, emergency funds, and Latvia's pension system
- **Financial Advisor Directory**: Find recommended financial consultants in Latvia

## Tech Stack

- React 18 + TypeScript
- Tailwind CSS
- React Router DOM
- Zustand for state management
- Vite for build tooling
- localStorage for data persistence (no backend required)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The development server will start at `http://localhost:5173` (or another port if 5173 is busy).

## Project Structure

```
src/
├── components/       # Reusable React components
├── pages/           # Main page components
├── hooks/           # Custom React hooks
├── utils/           # Utility functions and calculations
├── types/           # TypeScript type definitions
└── App.tsx          # Main app component with routing
```

## Key Components

### Calculator
- Input salary, housing costs, utilities
- Calculates net income after taxes (~20% Latvia PIT)
- Shows recommended savings (50% of remaining income)
- Displays emergency fund targets

### Goals
- Create financial goals with target amounts
- Track progress with visual progress bars
- Calculate months to reach goals
- Add contributions to goals

### Expenses
- Log expenses with categories
- View monthly totals and daily averages
- Category breakdown with visual charts
- Filter by month

### Info
- Educational content on financial topics
- Latvia-specific pension system information
- Directory of financial advisors

## Data Storage

All data is stored locally in the browser using localStorage:
- `pockets_profile`: User profile and salary information
- `pockets_goals`: List of financial goals
- `pockets_expenses`: List of expenses

No backend or authentication required for MVP.

## Latvia-Specific Features

- Currency in EUR
- Tax calculations based on Latvia's ~20% Personal Income Tax
- Information about Latvia's 3-pillar pension system
- Localized date and number formatting (lv-LV)

## Deployment

### Option 1: Vercel (Easiest)

1. Push code to GitHub
2. Import project in Vercel
3. Vercel will auto-detect Vite and deploy

See `DEPLOYMENT.md` for detailed instructions.

### Option 2: Netlify

1. Push code to GitHub
2. Import project in Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

See `DEPLOYMENT.md` for detailed instructions.

### Option 3: Your Own Server (nginx)

For deploying to your own VPS or dedicated server:

**Initial Setup:**
```bash
# On your server
sudo ./setup.sh
```

**Install SSL Certificate:**
```bash
sudo ./scripts/install-ssl.sh
```

**Deploy Updates:**
```bash
sudo ./deploy.sh
```

See `DEPLOYMENT_SERVER.md` for complete server deployment guide.

### Build Manually

If you need to build locally:

```bash
npm run build
```

The `dist/` folder will contain the production-ready files.

## Future Enhancements

- Bank integration for automatic transaction import
- Multi-currency support
- Data export/import
- User accounts with cloud sync
- Mobile app (React Native)
- Budget templates
- Financial goal templates
- Notifications and reminders
- Advanced charts and analytics

## Contributing

This is an MVP project. Contributions are welcome!

## License

MIT

## Contact

For questions or feedback: hello@pockets.lv

---

Built with ❤️ for the people of Latvia
