import React from 'react';

const CookiePolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. What Are Cookies</h2>
          <p>Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Remembering your preferences</li>
            <li>Keeping you signed in</li>
            <li>Understanding how you use our site</li>
            <li>Improving our services</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Types of Cookies We Use</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Essential Cookies:</h3>
              <p>Required for basic site functionality and security</p>
            </div>
            <div>
              <h3 className="font-semibold">Functional Cookies:</h3>
              <p>Remember your preferences and settings</p>
            </div>
            <div>
              <h3 className="font-semibold">Analytics Cookies:</h3>
              <p>Help us understand how visitors use our site</p>
            </div>
            <div>
              <h3 className="font-semibold">Marketing Cookies:</h3>
              <p>Used to deliver relevant advertisements</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. How We Use Cookies</h2>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Authentication and security</li>
            <li>Shopping cart functionality</li>
            <li>Site performance monitoring</li>
            <li>User preference storage</li>
            <li>Analytics and statistics</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Managing Cookies</h2>
          <p>You can control cookies through your browser settings:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Block all cookies</li>
            <li>Delete existing cookies</li>
            <li>Allow only essential cookies</li>
            <li>Set cookie preferences</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Third-Party Cookies</h2>
          <p>We use cookies from trusted partners including:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Google Analytics</li>
            <li>Razorpay</li>
            <li>Social media platforms</li>
            <li>Advertising partners</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Updates to This Policy</h2>
          <p>We may update this Cookie Policy periodically. Any changes will be posted on this page with an updated revision date.</p>
        </section>

        <section className="mt-8 pt-6 border-t">
          <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
          <p>If you have any questions about our Cookie Policy, please contact us at:</p>
          <div className="mt-2">
            <p>Email: varuntejabodepudi@gmail.com</p>
            <p>Phone: 9390817001</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CookiePolicyPage;