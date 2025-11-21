import { useState } from 'react';
import { Consultant } from '../types';

const consultants: Consultant[] = [
  {
    id: '1',
    name: 'Anna Bērziņa',
    specialty: 'Personal Finance Planning',
    description: 'Specializes in helping young professionals build emergency funds and savings plans.',
    email: 'anna.berzina@example.lv',
    phone: '+371 2000 0001',
    website: 'https://example.lv',
  },
  {
    id: '2',
    name: 'Jānis Kalniņš',
    specialty: 'Investment Planning',
    description: 'Expert in long-term investment strategies and retirement planning for Latvia.',
    email: 'janis.kalnins@example.lv',
    phone: '+371 2000 0002',
  },
  {
    id: '3',
    name: 'Līga Ozoliņa',
    specialty: 'Debt Management',
    description: 'Helps individuals manage and eliminate debt with sustainable payment plans.',
    email: 'liga.ozolina@example.lv',
    website: 'https://example.lv',
  },
  {
    id: '4',
    name: 'Māris Liepiņš',
    specialty: 'Tax Optimization',
    description: 'Latvian tax specialist helping optimize tax obligations and maximize savings.',
    email: 'maris.liepins@example.lv',
    phone: '+371 2000 0004',
  },
  {
    id: '5',
    name: 'Elīna Krūmiņa',
    specialty: 'First-time Home Buyers',
    description: 'Guides young people through the process of buying their first home in Latvia.',
    email: 'elina.krumina@example.lv',
    phone: '+371 2000 0005',
    website: 'https://example.lv',
  },
];

export default function Info() {
  const [activeSection, setActiveSection] = useState<string>('financial-independence');

  const sections = [
    { id: 'financial-independence', title: 'Financial Independence' },
    { id: 'emergency-fund', title: 'Emergency Fund' },
    { id: 'pension-system', title: 'Latvia Pension System' },
    { id: 'find-advisor', title: 'Find a Financial Advisor' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-gray-900">Financial Education</h1>
      <p className="text-gray-600 mb-8">Learn the basics and find expert help</p>

      {/* Navigation */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8 overflow-x-auto">
        <div className="flex space-x-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-2 rounded-md whitespace-nowrap transition-colors font-semibold ${
                activeSection === section.id
                  ? 'bg-[#10b981] text-white shadow-md'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <div className="bg-white rounded-lg shadow-sm p-8">
        {activeSection === 'financial-independence' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">What is Financial Independence?</h2>
            <div className="prose max-w-none text-gray-700">
              <p className="mb-4">
                Financial independence means having enough income or savings to cover your living expenses
                without relying on employment or others. It's about having the freedom to make life choices
                without being overly stressed about money.
              </p>

              <h3 className="text-xl font-bold mb-3 mt-6 text-gray-900">Key Principles:</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  <strong>Live Below Your Means:</strong> Spend less than you earn and save the difference
                </li>
                <li>
                  <strong>Build Multiple Income Streams:</strong> Don't rely on just one source of income
                </li>
                <li>
                  <strong>Invest for the Future:</strong> Let your money work for you through investments
                </li>
                <li>
                  <strong>Eliminate Debt:</strong> High-interest debt prevents you from building wealth
                </li>
                <li>
                  <strong>Continuous Learning:</strong> Keep educating yourself about personal finance
                </li>
              </ul>

              <h3 className="text-xl font-bold mb-3 mt-6 text-gray-900">Steps to Get Started:</h3>
              <ol className="list-decimal pl-6 mb-4 space-y-2">
                <li>Track your income and expenses (use our Expense Tracker!)</li>
                <li>Build an emergency fund (3-6 months of expenses)</li>
                <li>Pay off high-interest debt</li>
                <li>Start saving 20% or more of your income</li>
                <li>Learn about and start investing</li>
              </ol>

              <div className="bg-green-50 p-4 rounded-md mt-6">
                <p className="text-sm text-gray-700">
                  <strong>Remember:</strong> Financial independence doesn't happen overnight. It's a journey
                  that requires patience, discipline, and consistent effort. Start small and build from there.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'emergency-fund' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">What is an Emergency Fund?</h2>
            <div className="prose max-w-none text-gray-700">
              <p className="mb-4">
                An emergency fund is money you set aside to cover unexpected expenses or financial emergencies.
                It's your financial safety net that protects you from going into debt when life throws
                curveballs.
              </p>

              <h3 className="text-xl font-bold mb-3 mt-6 text-gray-900">Why You Need One:</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Job loss or reduced income</li>
                <li>Medical emergencies not covered by insurance</li>
                <li>Car repairs or breakdowns</li>
                <li>Home repairs (broken boiler, leaking roof, etc.)</li>
                <li>Unexpected travel expenses (family emergencies)</li>
              </ul>

              <h3 className="text-xl font-bold mb-3 mt-6 text-gray-900">How Much Should You Save?</h3>
              <div className="bg-blue-50 p-4 rounded-md mb-4">
                <ul className="space-y-2">
                  <li>
                    <strong>Minimum (Starter):</strong> €500-1,000 for small emergencies
                  </li>
                  <li>
                    <strong>Basic:</strong> 3 months of essential expenses
                  </li>
                  <li>
                    <strong>Comfortable:</strong> 6 months of essential expenses
                  </li>
                  <li>
                    <strong>Extra Security:</strong> 12 months of essential expenses
                  </li>
                </ul>
              </div>

              <h3 className="text-xl font-bold mb-3 mt-6 text-gray-900">Where to Keep It:</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  <strong>Savings Account:</strong> Easy access, but low interest (good for most people)
                </li>
                <li>
                  <strong>Money Market Account:</strong> Slightly higher interest, still accessible
                </li>
                <li>
                  <strong>NOT in investments:</strong> Emergency funds should be liquid and stable, not in
                  stocks or crypto
                </li>
              </ul>

              <h3 className="text-xl font-bold mb-3 mt-6 text-gray-900">How to Build It:</h3>
              <ol className="list-decimal pl-6 mb-4 space-y-2">
                <li>Start small - even €20/month is progress</li>
                <li>Automate your savings (set up automatic transfers)</li>
                <li>Save windfalls (tax refunds, bonuses, gifts)</li>
                <li>Cut unnecessary expenses temporarily</li>
                <li>Use our Calculator to see how long it will take!</li>
              </ol>

              <div className="bg-yellow-50 p-4 rounded-md mt-6">
                <p className="text-sm text-gray-700">
                  <strong>Pro Tip:</strong> Keep your emergency fund in a separate account from your daily
                  spending. This reduces the temptation to dip into it for non-emergencies.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'pension-system' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Latvia Pension System</h2>
            <div className="prose max-w-none text-gray-700">
              <p className="mb-4">
                Understanding Latvia's pension system is crucial for planning your financial future. The
                system has three levels (pillars) designed to provide income in retirement.
              </p>

              <h3 className="text-xl font-bold mb-3 mt-6 text-gray-900">The Three Pillars:</h3>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-md">
                  <h4 className="font-bold text-lg mb-2 text-gray-900">1st Pillar: State Pension</h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Mandatory for all employed persons</li>
                    <li>Funded through social security contributions</li>
                    <li>Pay-as-you-go system (current workers fund current retirees)</li>
                    <li>Benefit based on years worked and contributions made</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-md">
                  <h4 className="font-bold text-lg mb-2 text-gray-900">2nd Pillar: Funded State Pension</h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Mandatory for those born after July 1, 1971</li>
                    <li>6% of gross salary goes to personal pension account</li>
                    <li>Invested in pension funds (you choose the fund)</li>
                    <li>Your personal savings that grow over time</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-4 rounded-md">
                  <h4 className="font-bold text-lg mb-2 text-gray-900">3rd Pillar: Private Pension</h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Voluntary private pension savings</li>
                    <li>Tax benefits for contributions</li>
                    <li>Additional savings on top of state pensions</li>
                    <li>Flexible - you decide how much to contribute</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-3 mt-6 text-gray-900">Important Facts:</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  <strong>Retirement Age:</strong> Currently 64 years and increasing
                </li>
                <li>
                  <strong>Early Retirement:</strong> Possible 2 years early with reduced benefits
                </li>
                <li>
                  <strong>Required Service:</strong> Need at least 15 years of service for state pension
                </li>
                <li>
                  <strong>Indexation:</strong> Pensions are adjusted based on economic indicators
                </li>
              </ul>

              <h3 className="text-xl font-bold mb-3 mt-6 text-gray-900">What This Means for You:</h3>
              <p className="mb-4">
                State pensions alone may not provide the lifestyle you want in retirement. That's why it's
                important to:
              </p>
              <ol className="list-decimal pl-6 mb-4 space-y-2">
                <li>Check your 2nd pillar pension fund performance regularly</li>
                <li>Consider contributing to a 3rd pillar pension (voluntary savings)</li>
                <li>Start saving early - compound growth is powerful</li>
                <li>Don't rely solely on state pensions for retirement</li>
              </ol>

              <div className="bg-gray-50 p-4 rounded-md mt-6">
                <p className="text-sm text-gray-700">
                  <strong>Need Help?</strong> Consult with a financial advisor who specializes in retirement
                  planning in Latvia. They can help you optimize your pension strategy.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'find-advisor' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">How to Find a Financial Advisor</h2>
            <div className="prose max-w-none text-gray-700 mb-8">
              <p className="mb-4">
                A good financial advisor can help you create a personalized plan, avoid costly mistakes, and
                achieve your financial goals faster. Here's what to look for:
              </p>

              <h3 className="text-xl font-bold mb-3 mt-6 text-gray-900">What to Look For:</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>
                  <strong>Credentials:</strong> Check for professional certifications (CFP, CFA, etc.)
                </li>
                <li>
                  <strong>Experience:</strong> Ask about their experience with clients like you
                </li>
                <li>
                  <strong>Fee Structure:</strong> Understand how they're paid (flat fee, hourly, commission)
                </li>
                <li>
                  <strong>Fiduciary Duty:</strong> Ensure they're legally required to act in your best interest
                </li>
                <li>
                  <strong>Specialization:</strong> Some advisors specialize in areas like debt, investing, or retirement
                </li>
              </ul>

              <h3 className="text-xl font-bold mb-3 mt-6 text-gray-900">Questions to Ask:</h3>
              <ol className="list-decimal pl-6 mb-4 space-y-2">
                <li>What are your qualifications and certifications?</li>
                <li>How do you charge for your services?</li>
                <li>Do you have experience working with young professionals?</li>
                <li>What's your investment philosophy?</li>
                <li>Can you provide references from current clients?</li>
              </ol>

              <div className="bg-yellow-50 p-4 rounded-md mb-8">
                <p className="text-sm text-gray-700">
                  <strong>Warning:</strong> Be cautious of advisors who push specific products, promise
                  guaranteed returns, or pressure you to make quick decisions. A good advisor will educate and
                  guide, not pressure.
                </p>
              </div>
            </div>

            {/* Consultants List */}
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Recommended Financial Advisors in Latvia</h2>
            <p className="text-gray-600 mb-6">
              These advisors have experience helping young people in Latvia with financial planning.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {consultants.map((consultant) => (
                <div key={consultant.id} className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{consultant.name}</h3>
                  <p className="text-primary font-semibold mb-3">{consultant.specialty}</p>
                  <p className="text-gray-700 mb-4 text-sm">{consultant.description}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <span className="font-semibold w-20">Email:</span>
                      <a
                        href={`mailto:${consultant.email}`}
                        className="text-primary hover:underline"
                      >
                        {consultant.email}
                      </a>
                    </div>

                    {consultant.phone && (
                      <div className="flex items-center text-gray-600">
                        <span className="font-semibold w-20">Phone:</span>
                        <a
                          href={`tel:${consultant.phone}`}
                          className="text-primary hover:underline"
                        >
                          {consultant.phone}
                        </a>
                      </div>
                    )}

                    {consultant.website && (
                      <div className="flex items-center text-gray-600">
                        <span className="font-semibold w-20">Website:</span>
                        <a
                          href={consultant.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Disclaimer:</strong> These are example listings for MVP purposes. In production,
                verify credentials and do your own research before engaging any financial advisor. Pockets
                does not endorse or guarantee the services of any listed advisor.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
