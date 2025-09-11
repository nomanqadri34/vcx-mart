import React from 'react';

const IPPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Intellectual Property Policy</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Overview</h2>
          <p>This policy outlines how VCX MART handles intellectual property rights and protects both creators and users of our platform.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Intellectual Property Rights</h2>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Copyright protection</li>
            <li>Trademark rights</li>
            <li>Patent rights</li>
            <li>Trade secrets</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. User Responsibilities</h2>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Respect intellectual property rights</li>
            <li>Only upload content you own or have rights to</li>
            <li>Properly attribute third-party content</li>
            <li>Report IP violations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Copyright Infringement</h2>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>DMCA compliance procedures</li>
            <li>Notice and takedown process</li>
            <li>Counter-notification procedures</li>
            <li>Repeat infringer policy</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Trademark Protection</h2>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Trademark usage guidelines</li>
            <li>Brand protection measures</li>
            <li>Counterfeit goods policy</li>
            <li>Trademark dispute resolution</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Enforcement</h2>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Content monitoring</li>
            <li>Investigation procedures</li>
            <li>Violation consequences</li>
            <li>Appeal process</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Reporting Violations</h2>
          <p>To report intellectual property violations:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Use our IP violation reporting form</li>
            <li>Provide necessary documentation</li>
            <li>Include proof of ownership</li>
            <li>Specify the infringing content</li>
          </ul>
        </section>

        <section className="mt-8 pt-6 border-t">
          <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
          <p>For intellectual property related inquiries or to report violations, please contact us at:</p>
          <div className="mt-2">
            <p>Email: varuntejabodepudi@gmail.com</p>
            <p>Phone: 9390817001</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default IPPolicyPage;