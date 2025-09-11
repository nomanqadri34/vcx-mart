import React from 'react';

const SecurityPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Security Policy</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Data Protection</h2>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>End-to-end encryption for sensitive data</li>
            <li>Regular security audits and updates</li>
            <li>Secure data storage practices</li>
            <li>Regular backup procedures</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Payment Security</h2>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>PCI DSS compliant payment processing</li>
            <li>Secure integration with Razorpay</li>
            <li>Multi-factor authentication for transactions</li>
            <li>Real-time fraud detection</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Account Security</h2>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Strong password requirements</li>
            <li>Two-factor authentication option</li>
            <li>Account activity monitoring</li>
            <li>Suspicious activity alerts</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Infrastructure Security</h2>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Regular security patches and updates</li>
            <li>Firewall protection</li>
            <li>DDoS protection</li>
            <li>24/7 system monitoring</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Incident Response</h2>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Dedicated security response team</li>
            <li>Incident reporting procedures</li>
            <li>Regular security drills</li>
            <li>Post-incident analysis</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Employee Security</h2>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Regular security training</li>
            <li>Access control policies</li>
            <li>Security awareness programs</li>
            <li>Confidentiality agreements</li>
          </ul>
        </section>

        <section className="mt-8 pt-6 border-t">
          <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
          <p>For security-related concerns or to report a security issue, please contact us at:</p>
          <div className="mt-2">
            <p>Email: varuntejabodepudi@gmail.com</p>
            <p>Phone: 9390817001</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SecurityPolicyPage;