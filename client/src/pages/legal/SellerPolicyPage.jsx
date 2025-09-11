import React from 'react';

const SellerPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Seller Policy</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Seller Eligibility</h2>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Must be at least 18 years of age</li>
            <li>Must have a valid business registration</li>
            <li>Must provide accurate business and tax information</li>
            <li>Must maintain a valid bank account for payments</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Product Guidelines</h2>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>All products must comply with local laws and regulations</li>
            <li>Accurate product descriptions and images required</li>
            <li>Prohibited items list must be strictly followed</li>
            <li>Quality standards must be maintained</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Pricing and Payments</h2>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Sellers set their own prices</li>
            <li>Platform fee structure applies</li>
            <li>Payment processing through Razorpay</li>
            <li>Regular settlement cycles</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Order Fulfillment</h2>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Orders must be processed within 24 hours</li>
            <li>Accurate tracking information must be provided</li>
            <li>Maintain adequate inventory levels</li>
            <li>Handle returns according to platform policy</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Performance Standards</h2>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Maintain minimum rating requirements</li>
            <li>Keep order cancellation rate below threshold</li>
            <li>Respond to customer queries promptly</li>
            <li>Regular performance reviews</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Account Suspension</h2>
          <p>VCX MART reserves the right to suspend or terminate seller accounts for:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Policy violations</li>
            <li>Poor performance</li>
            <li>Customer complaints</li>
            <li>Fraudulent activity</li>
          </ul>
        </section>

        <section className="mt-8 pt-6 border-t">
          <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
          <p>If you have any questions about our Seller Policy, please contact us at:</p>
          <div className="mt-2">
            <p>Email: varuntejabodepudi@gmail.com</p>
            <p>Phone: 9390817001</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SellerPolicyPage;