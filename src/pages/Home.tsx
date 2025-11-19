import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // For MVP, just show success message
      // In production, integrate with Mailchimp
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
            <span className="text-2xl font-bold text-primary">Pockets</span>
            <Link
              to="/app/calculator"
              className="bg-primary text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              Start Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Stop Living Paycheck to Paycheck
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-green-50">
            Take control of your finances with simple tools designed for young people in Latvia
          </p>
          <Link
            to="/app/calculator"
            className="inline-block bg-white text-primary px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Your Financial Journey
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            How Pockets Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">1. Calculate Your Pockets</h3>
              <p className="text-gray-600">
                Enter your salary and expenses. We'll show you how much you should save and spend each month.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">2. Set Your Goals</h3>
              <p className="text-gray-600">
                Create savings goals and track your progress. See how many months until you reach them.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">3. Track Your Spending</h3>
              <p className="text-gray-600">
                Log your expenses and see where your money goes. Make better financial decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Email Subscribe */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
            <button
              type="submit"
              className="bg-primary text-white px-8 py-3 rounded-md hover:bg-green-600 transition-colors font-semibold"
            >
              Subscribe
            </button>
          </form>
          {subscribed && (
            <p className="mt-4 text-primary font-semibold">
              Thanks for subscribing! Check your email soon.
            </p>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Pockets</h3>
              <p className="text-gray-400">
                Financial literacy tools for young people in Latvia
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/app/calculator" className="hover:text-white transition-colors">
                    Calculator
                  </Link>
                </li>
                <li>
                  <Link to="/app/info" className="hover:text-white transition-colors">
                    Learn More
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <p className="text-gray-400">
                Questions? Reach out at{' '}
                <a href="mailto:hello@pockets.lv" className="text-primary hover:underline">
                  hello@pockets.lv
                </a>
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 Pockets. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
