import { Outlet, Link, useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinkClass = (path: string) =>
    `px-4 py-2 rounded-md transition-colors ${
      isActive(path)
        ? 'bg-primary text-white'
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">Pockets</span>
            </Link>
            <nav className="hidden md:flex space-x-2">
              <Link to="/app/calculator" className={navLinkClass('/app/calculator')}>
                Calculator
              </Link>
              <Link to="/app/goals" className={navLinkClass('/app/goals')}>
                Goals
              </Link>
              <Link to="/app/expenses" className={navLinkClass('/app/expenses')}>
                Expenses
              </Link>
              <Link to="/app/debts" className={navLinkClass('/app/debts')}>
                Debts
              </Link>
              <Link to="/app/info" className={navLinkClass('/app/info')}>
                Info
              </Link>
            </nav>
            {/* Mobile menu button - simplified */}
            <div className="md:hidden">
              <Link to="/" className="text-sm text-gray-600">
                Menu
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white border-b border-gray-200 px-4 py-2 flex space-x-2 overflow-x-auto">
        <Link to="/app/calculator" className={navLinkClass('/app/calculator')}>
          Calculator
        </Link>
        <Link to="/app/goals" className={navLinkClass('/app/goals')}>
          Goals
        </Link>
        <Link to="/app/expenses" className={navLinkClass('/app/expenses')}>
          Expenses
        </Link>
        <Link to="/app/debts" className={navLinkClass('/app/debts')}>
          Debts
        </Link>
        <Link to="/app/info" className={navLinkClass('/app/info')}>
          Info
        </Link>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>&copy; 2024 Pockets. Financial literacy for Latvia.</p>
            <p className="mt-2">
              <Link to="/app/info" className="text-primary hover:underline">
                Learn more
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
