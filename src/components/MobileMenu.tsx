import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) =>
    `block px-4 py-3 rounded-md transition-colors font-semibold ${
      isActive(path)
        ? 'bg-[#10b981] text-white'
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Menu */}
      <div
        className="fixed top-0 right-0 bottom-0 w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-secondary-200">
          <span className="text-lg font-bold text-primary-600">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-2">
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
      </div>
    </>
  );
}
