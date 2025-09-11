import React from 'react';

const TermsOfServicePage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p>By accessing and using VCX MART, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Use License</h2>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Permission is granted to temporarily download one copy of the materials for personal, non-commercial transitory viewing only.</li>
            <li>This license shall automatically terminate if you violate any of these restrictions.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. User Accounts</h2>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>You must provide accurate and complete information when creating an account</li>
            <li>You are responsible for maintaining the security of your account</li>
            <li>You must not share your account credentials with others</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Marketplace Rules</h2>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Products must comply with all applicable laws and regulations</li>
            <li>Sellers must accurately describe their products</li>
            <li>Buyers must make payments through our approved payment system (Razorpay)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Disclaimer</h2>
          <p>The materials on VCX MART's website are provided on an 'as is' basis. VCX MART makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Limitations</h2>
          <p>In no event shall VCX MART or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on VCX MART's website.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Governing Law</h2>
          <p>These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
        </section>

        <section className="mt-8 pt-6 border-t">
          <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
          <p>If you have any questions about these Terms of Service, please contact us at:</p>
          <div className="mt-2">
            <p>Email: varuntejabodepudi@gmail.com</p>
            <p>Phone: 9390817001</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsOfServicePage;