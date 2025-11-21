import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import SkipLink from './SkipLink';
import MobileMenu from './MobileMenu';

export default function Layout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinkClass = (path: string) =>
    `px-4 py-2 rounded-md transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
      isActive(path)
        ? 'bg-[#10b981] text-white'
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SkipLink />

      {/* Header */}
      <header className="bg-white shadow-sm" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/"
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
              aria-label="Pockets home"
            >
              <img src="/assets/logo.svg" alt="Pockets" className="h-8 w-auto" width="32" height="32" />
            </Link>
            <nav className="hidden md:flex space-x-2" aria-label="Main navigation">
              <Link
                to="/app/calculator"
                className={navLinkClass('/app/calculator')}
                aria-current={isActive('/app/calculator') ? 'page' : undefined}
              >
                Calculator
              </Link>
              <Link
                to="/app/goals"
                className={navLinkClass('/app/goals')}
                aria-current={isActive('/app/goals') ? 'page' : undefined}
              >
                Goals
              </Link>
              <Link
                to="/app/expenses"
                className={navLinkClass('/app/expenses')}
                aria-current={isActive('/app/expenses') ? 'page' : undefined}
              >
                Expenses
              </Link>
              <Link
                to="/app/debts"
                className={navLinkClass('/app/debts')}
                aria-current={isActive('/app/debts') ? 'page' : undefined}
              >
                Debts
              </Link>
              <Link
                to="/app/info"
                className={navLinkClass('/app/info')}
                aria-current={isActive('/app/info') ? 'page' : undefined}
              >
                Info
              </Link>
            </nav>
            {/* Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-md text-secondary-600 hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Component */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content */}
      <main
        id="main-content"
        className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full"
        role="main"
      >
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>&copy; 2025 Pockets. Financial literacy for Latvia.</p>
            <p className="mt-2 space-x-4">
              <Link to="/app/info" className="text-primary hover:underline">
                Learn more
              </Link>
              <span>•</span>
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link to="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
