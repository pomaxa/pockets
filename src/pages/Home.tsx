import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import HeroSection from '../components/HeroSection';
import Section from '../components/Section';
import SectionHeader from '../components/SectionHeader';
import FeatureCard from '../components/FeatureCard';
import CategoryCard from '../components/CategoryCard';

export default function Home() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src="/assets/logo.svg" alt="Pockets" className="h-8 w-auto" width="32" height="32" />
            </div>
            <Link to="/app/calculator">
              <Button variant="primary">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection variant="default">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
            Take Control of Your Money
          </h1>
          <p className="text-xl sm:text-2xl mb-8 text-gray-600 max-w-3xl mx-auto">
            Financial literacy made simple for young people in Latvia. Learn to budget, save, and achieve your financial goals.
          </p>
          <Link to="/app/calculator">
            <Button variant="primary" size="lg">
              Start Managing Your Money
            </Button>
          </Link>

          {/* Hero Graphic */}
          <div className="mt-16 flex justify-center">
            <svg viewBox="0 0 500 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-lg h-auto">
              {/* Background circles */}
              <circle cx="250" cy="150" r="120" fill="#d1fae5" opacity="0.3"/>
              <circle cx="250" cy="150" r="90" fill="#a7f3d0" opacity="0.3"/>

              {/* Main wallet/pocket illustration */}
              <rect x="150" y="80" width="200" height="160" rx="16" fill="#10b981"/>
              <rect x="170" y="60" width="160" height="40" rx="8" fill="#059669"/>

              {/* Card slot */}
              <rect x="180" y="120" width="140" height="20" rx="4" fill="white" opacity="0.3"/>

              {/* Coins */}
              <circle cx="220" cy="180" r="25" fill="#fef3c7"/>
              <circle cx="220" cy="180" r="20" fill="#fcd34d"/>
              <text x="220" y="188" textAnchor="middle" fontFamily="Inter" fontSize="20" fontWeight="700" fill="#92400e">€</text>

              <circle cx="270" cy="170" r="25" fill="#fef3c7"/>
              <circle cx="270" cy="170" r="20" fill="#fcd34d"/>
              <text x="270" y="178" textAnchor="middle" fontFamily="Inter" fontSize="20" fontWeight="700" fill="#92400e">€</text>

              {/* Decorative elements */}
              <circle cx="100" cy="100" r="8" fill="#10b981" opacity="0.5"/>
              <circle cx="400" cy="120" r="12" fill="#10b981" opacity="0.3"/>
              <circle cx="80" cy="200" r="6" fill="#6b7280" opacity="0.4"/>
              <circle cx="420" cy="220" r="10" fill="#6b7280" opacity="0.3"/>
            </svg>
          </div>
        </div>
      </HeroSection>

      {/* Value Propositions Section */}
      <Section variant="gray">
        <SectionHeader
          title="Why Pockets?"
          subtitle="Simple tools to help you understand and improve your financial situation"
          centered
        />

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon="/assets/icon-chart.svg"
            title="Understand Your Money"
            description="Get clear insights into your income, expenses, and spending patterns. See where your money goes and identify opportunities to save."
          />
          <FeatureCard
            icon="/assets/icon-money.svg"
            title="Build Savings"
            description="Set realistic savings goals and track your progress. Our tools help you allocate money for emergencies and future plans."
          />
          <FeatureCard
            icon="/assets/icon-trending-down.svg"
            title="Pay Off Debts"
            description="Create a plan to tackle your debts systematically. Track payments and see your progress toward becoming debt-free."
          />
        </div>
      </Section>

      {/* Features Section */}
      <Section variant="white">
        <SectionHeader
          title="Financial Tools for Every Need"
          subtitle="Everything you need to manage your money, all in one place"
          centered
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon="/assets/icon-calculator.svg"
            title="Pocket Calculator"
            description="Calculate how to divide your income into different pockets for rent, savings, lifestyle, and more."
            link="/app/calculator"
          />
          <FeatureCard
            icon="/assets/icon-goals.svg"
            title="Savings Goals"
            description="Set and track your savings goals. Whether it's a vacation or emergency fund, stay motivated."
            link="/app/goals"
          />
          <FeatureCard
            icon="/assets/icon-expenses.svg"
            title="Expense Tracker"
            description="Record your daily expenses and see exactly where your money is going each month."
            link="/app/expenses"
          />
          <FeatureCard
            icon="/assets/icon-debts.svg"
            title="Debt Manager"
            description="Track all your debts in one place and create a repayment plan that works for you."
            link="/app/debts"
          />
        </div>

        <div className="text-center mt-12">
          <Link to="/app/calculator">
            <Button variant="primary" size="lg">
              Try the Pocket Calculator
            </Button>
          </Link>
        </div>
      </Section>

      {/* Expense Categories Preview Section */}
      <Section variant="gray">
        <SectionHeader
          title="Track Every Category"
          subtitle="Organize your expenses by category and understand your spending habits"
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CategoryCard
            icon="/assets/icon-housing.svg"
            title="Housing"
            description="Your main living costs including rent or mortgage payments"
            examples={[
              "Monthly rent payment",
              "Mortgage installment",
              "Property insurance",
              "Home maintenance"
            ]}
          />
          <CategoryCard
            icon="/assets/icon-food.svg"
            title="Food & Dining"
            description="All food-related expenses from groceries to eating out"
            examples={[
              "Grocery shopping (Rimi, Maxima)",
              "Restaurants and cafes",
              "Food delivery (Wolt, Bolt Food)",
              "Work lunches"
            ]}
          />
          <CategoryCard
            icon="/assets/icon-transport.svg"
            title="Transport"
            description="Getting around - public transport, fuel, and travel"
            examples={[
              "Public transport tickets",
              "Fuel and car maintenance",
              "Taxi and Bolt rides",
              "Parking fees"
            ]}
          />
          <CategoryCard
            icon="/assets/icon-entertainment.svg"
            title="Entertainment"
            description="Leisure activities and fun spending"
            examples={[
              "Streaming services (Netflix, Spotify)",
              "Cinema and events",
              "Hobbies and sports",
              "Shopping for fun"
            ]}
          />
          <CategoryCard
            icon="/assets/icon-health.svg"
            title="Health"
            description="Medical expenses and wellness"
            examples={[
              "Doctor visits and prescriptions",
              "Pharmacy purchases",
              "Gym membership",
              "Health insurance"
            ]}
          />
          <CategoryCard
            icon="/assets/icon-utilities.svg"
            title="Utilities"
            description="Essential home services and bills"
            examples={[
              "Electricity and water",
              "Internet and phone",
              "Heating",
              "TV subscription"
            ]}
          />
        </div>
      </Section>

      {/* Email Subscribe Section */}
      <Section variant="white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Stay Updated</h2>
          <p className="text-gray-600 mb-8">
            Get financial tips and updates delivered to your inbox
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary flex-1 max-w-md"
              required
            />
            <Button type="submit" variant="primary">
              Subscribe
            </Button>
          </form>
          {subscribed && (
            <p className="mt-4 text-primary font-semibold">
              Thanks for subscribing! Check your email soon.
            </p>
          )}
        </div>
      </Section>

      {/* FAQ Section */}
      <Section variant="gray">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-2 text-gray-900">Is Pockets really free?</h3>
              <p className="text-gray-600">
                Yes! Pockets is completely free to use. No hidden fees, no credit card required.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-2 text-gray-900">Is my data secure?</h3>
              <p className="text-gray-600">
                All your data is stored locally in your browser. We don't collect or store any personal information on our servers.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-2 text-gray-900">Do I need to create an account?</h3>
              <p className="text-gray-600">
                No! You can start using Pockets immediately without creating an account. Your data stays on your device.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-2 text-gray-900">Does it work with Latvian banks?</h3>
              <p className="text-gray-600">
                Pockets uses manual entry for MVP. You don't need to connect your bank. Just enter your income and expenses manually.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold mb-2 text-gray-900">How are taxes calculated?</h3>
              <p className="text-gray-600">
                We use simplified Latvia tax rates (~20% PIT). For accurate tax advice, consult a financial advisor.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Final Call to Action Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
            Ready to Take Control?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Start with our free Pocket Calculator and see how you can optimize your budget today.
          </p>
          <Link to="/app/calculator">
            <Button variant="primary" size="lg">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer - Using unified design */}
      <footer className="bg-white border-t border-secondary-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-secondary-900">Pockets</h3>
              <p className="text-secondary-600">
                Financial literacy tools for young people in Latvia
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-secondary-900">Quick Links</h3>
              <ul className="space-y-2 text-secondary-600">
                <li>
                  <Link to="/app/calculator" className="hover:text-primary-600 transition-colors">
                    Calculator
                  </Link>
                </li>
                <li>
                  <Link to="/app/goals" className="hover:text-primary-600 transition-colors">
                    Goals
                  </Link>
                </li>
                <li>
                  <Link to="/app/expenses" className="hover:text-primary-600 transition-colors">
                    Expenses
                  </Link>
                </li>
                <li>
                  <Link to="/app/debts" className="hover:text-primary-600 transition-colors">
                    Debts
                  </Link>
                </li>
                <li>
                  <Link to="/app/info" className="hover:text-primary-600 transition-colors">
                    Learn More
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 text-secondary-900">Contact</h3>
              <p className="text-secondary-600">
                Questions? Reach out at{' '}
                <a href="mailto:hello@pockets.lv" className="text-primary-600 hover:underline">
                  hello@pockets.lv
                </a>
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-secondary-200 text-center text-secondary-600">
            <p>&copy; 2025 Pockets. Making financial literacy accessible.</p>
            <p className="mt-2 space-x-4 text-sm">
              <Link to="/privacy" className="text-primary-600 hover:underline">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link to="/terms" className="text-primary-600 hover:underline">
                Terms of Service
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
