import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Information We Collect</h2>
          <p>At VCX MART, we collect various types of information to provide and improve our services:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Personal information (name, email address, phone number)</li>
            <li>Payment information (processed securely through Razorpay)</li>
            <li>Device and usage information</li>
            <li>Communication records</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
          <p>We use the collected information for:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Processing your orders and payments</li>
            <li>Communicating with you about your orders and services</li>
            <li>Improving our services and user experience</li>
            <li>Complying with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Information Sharing</h2>
          <p>We share information with:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Payment processors (Razorpay)</li>
            <li>Delivery partners</li>
            <li>Service providers who assist our operations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Updates to This Policy</h2>
          <p>We may update this privacy policy periodically. We will notify you of any material changes by posting the new policy on this page.</p>
        </section>

        <section className="mt-8 pt-6 border-t">
          <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <div className="mt-2">
            <p>Email: varuntejabodepudi@gmail.com</p>
            <p>Phone: 9390817001</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;