# Quick Start Guide

Get up and running with Pockets in 5 minutes.

## Prerequisites

- Node.js 18+ and npm
- Modern web browser
- Code editor (VS Code recommended)

## Installation

```bash
# Clone/download the project
cd pockets-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

## First-Time Setup

No setup required! The app works immediately. All data is stored locally in your browser.

## Test the App

### 1. Try the Calculator (2 minutes)

1. Click "Start Free" on the home page
2. Enter test data:
   - Salary: 2000
   - Housing Type: Rent
   - Housing Cost: 400
   - Utilities: 100
   - Emergency Fund: 3 months
3. Click "Calculate My Pockets"
4. See your results: €550 recommended savings!

### 2. Create a Goal (1 minute)

1. Click "Set a Savings Goal"
2. Add a goal:
   - Name: Emergency Fund
   - Target: 5000
   - Current: 500
3. Watch the progress bar appear!
4. Try adding €50 to your goal

### 3. Track an Expense (1 minute)

1. Go to "Expenses" in the navigation
2. Add an expense:
   - Amount: 25.50
   - Category: Food
   - Description: Lunch at Rimi
3. See it appear in your expense table!

### 4. Learn (1 minute)

1. Go to "Info" page
2. Browse the 4 education sections
3. Check out the financial advisor directory

## Project Structure

```
src/
├── pages/          # Main pages (Home, Calculator, Goals, etc.)
├── components/     # Reusable components (Layout, etc.)
├── hooks/          # Custom React hooks
├── utils/          # Helper functions
└── types/          # TypeScript types
```

## Key Files

- `src/App.tsx` - Main app with routing
- `src/pages/Calculator.tsx` - Pocket calculator
- `src/hooks/useLocalStorage.ts` - Data persistence
- `src/utils/calculations.ts` - Financial math

## Common Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Quality
npm run lint         # Check code quality
```

## Making Changes

### Add a New Page

1. Create `src/pages/NewPage.tsx`
2. Add route in `src/App.tsx`:
   ```tsx
   <Route path="newpage" element={<NewPage />} />
   ```
3. Add navigation link in `src/components/Layout.tsx`

### Add a New Feature

1. Add types in `src/types/index.ts`
2. Add logic in `src/utils/` or `src/hooks/`
3. Create UI in `src/pages/` or `src/components/`
4. Test manually

### Modify Styling

This project uses Tailwind CSS. Common classes:
- `bg-primary` - Green background
- `text-gray-900` - Dark text
- `rounded-lg` - Rounded corners
- `shadow-sm` - Subtle shadow

See `tailwind.config.js` for custom colors.

## Troubleshooting

### Port Already in Use
```bash
# Use a different port
npm run dev -- --port 3000
```

### Build Errors
```bash
# Check TypeScript errors
npm run build

# Clear cache and reinstall
rm -rf node_modules dist
npm install
```

### Data Not Saving
- Check browser console for errors
- Ensure localStorage is enabled
- Try incognito mode

## Deployment

### Quick Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Done! Your app is live.

See `DEPLOYMENT.md` for full deployment guide.

## Sample Data

### Calculator Test Data
```
Salary: 2000
Housing: 400
Utilities: 100
Result: €550 savings recommended
```

### Goal Test Data
```
Name: Emergency Fund
Target: 5000
Current: 500
Progress: 10%
```

### Expense Test Data
```
Amount: 25.50
Category: Food
Date: Today
Description: Lunch
```

## Resources

- **README.md** - Full project documentation
- **TESTING.md** - Complete testing checklist
- **DEPLOYMENT.md** - Deployment instructions
- **PROJECT_SUMMARY.md** - Detailed project overview

## Getting Help

1. Check the docs (README.md)
2. Look for errors in browser console (F12)
3. Search existing issues on GitHub
4. Create a new issue with details

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Make your changes
4. Test thoroughly (see TESTING.md)
5. Commit (`git commit -m 'Add amazing feature'`)
6. Push (`git push origin feature/amazing`)
7. Open a Pull Request

## Tips

- Use browser DevTools to inspect localStorage
- Test on mobile using Chrome DevTools device emulation
- Keep components small and focused
- Follow existing code patterns
- Add TypeScript types for everything

## Next Steps

Now that you're set up:

1. ✅ Explore the code
2. ✅ Make a small change
3. ✅ Test it works
4. ✅ Read TESTING.md
5. ✅ Try deploying

Happy coding! 🚀

---

**Need more help?** Read the full documentation in README.md
