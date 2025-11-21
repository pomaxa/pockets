export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-secondary-900">Privacy Policy</h1>
      <p className="text-sm text-gray-600 mb-8">Last updated: January 21, 2025</p>

      <div className="prose prose-gray max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-4 text-secondary-900">1. Introduction</h2>
          <p className="text-gray-700 mb-4">
            Welcome to Pockets ("we", "our", or "us"). We are committed to protecting your privacy and personal data. This Privacy Policy explains how we handle your information when you use our financial literacy application.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-secondary-900">2. Data Storage</h2>
          <p className="text-gray-700 mb-4">
            <strong>Local Storage Only:</strong> All your financial data (income, expenses, goals, debts) is stored locally in your web browser using localStorage. We do not collect, transmit, or store any of your personal financial information on our servers.
          </p>
          <p className="text-gray-700 mb-4">
            This means:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Your data stays on your device</li>
            <li>We cannot access your financial information</li>
            <li>Your data is not shared with third parties</li>
            <li>Clearing your browser data will delete your information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-secondary-900">3. Information We Collect</h2>
          <p className="text-gray-700 mb-4">
            We collect minimal information necessary to provide our services:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>No Personal Information:</strong> We do not collect names, email addresses, or phone numbers unless you explicitly contact us</li>
            <li><strong>No Account Data:</strong> We do not require account creation or login</li>
            <li><strong>Technical Data:</strong> Standard web server logs (IP addresses, browser type, access times) for security and performance purposes only</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-secondary-900">4. Use of Data</h2>
          <p className="text-gray-700 mb-4">
            Since all your data is stored locally on your device, we do not use, analyze, or process your financial information in any way.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-secondary-900">5. Cookies and Tracking</h2>
          <p className="text-gray-700 mb-4">
            We do not use cookies or tracking technologies to collect information about your browsing behavior. We do not use analytics tools that track individual users.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-secondary-900">6. Third-Party Services</h2>
          <p className="text-gray-700 mb-4">
            We do not share your data with third-party services. The application runs entirely in your browser.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-secondary-900">7. Data Security</h2>
          <p className="text-gray-700 mb-4">
            Since your data is stored locally on your device, you are responsible for:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Keeping your device secure</li>
            <li>Using strong passwords for your device</li>
            <li>Backing up your data if needed (export features available)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-secondary-900">8. Your Rights</h2>
          <p className="text-gray-700 mb-4">
            Since we do not collect or store your personal data, traditional data protection rights (access, deletion, portability) are managed by you directly through your browser settings.
          </p>
          <p className="text-gray-700 mb-4">
            You can delete all your data at any time by:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Clearing your browser's localStorage</li>
            <li>Clearing your browser's cache and cookies</li>
            <li>Using our in-app export and delete features</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-secondary-900">9. Children's Privacy</h2>
          <p className="text-gray-700 mb-4">
            While our service is designed for young people learning about financial literacy, we do not knowingly collect personal information from anyone, including minors.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-secondary-900">10. Changes to This Policy</h2>
          <p className="text-gray-700 mb-4">
            We may update this Privacy Policy from time to time. We will notify users of any material changes by updating the "Last updated" date at the top of this policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-secondary-900">11. Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="text-gray-700 mb-4">
            Email: <a href="mailto:hello@pockets.lv" className="text-primary-600 hover:underline">hello@pockets.lv</a>
          </p>
        </section>

        <section className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-xl font-bold mb-3 text-green-900">Summary</h3>
          <p className="text-green-800">
            <strong>Your privacy is our priority.</strong> We don't collect, store, or share your personal financial data. Everything stays on your device. You have complete control over your information.
          </p>
        </section>
      </div>
    </div>
  );
}
