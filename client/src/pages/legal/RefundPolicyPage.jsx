import React from 'react';

const RefundPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Return Period</h2>
          <p>We accept returns within 7 days of delivery for most items. Some categories may have different return periods:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Electronics: 7 days</li>
            <li>Clothing and Accessories: 14 days</li>
            <li>Damaged/Defective items: 30 days</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Refund Process</h2>
          <p>Once we receive your return:</p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>We'll inspect the item within 48 hours</li>
            <li>If approved, refund will be initiated through the original payment method</li>
            <li>Refunds typically take 5-7 business days to reflect in your account</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Return Conditions</h2>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Item must be unused and in original condition</li>
            <li>Original packaging must be intact</li>
            <li>All accessories and tags must be included</li>
            <li>Valid proof of purchase required</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Non-Returnable Items</h2>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Customized or personalized items</li>
            <li>Perishable goods</li>
            <li>Downloadable software products</li>
            <li>Gift cards</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Return Shipping</h2>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Return shipping costs are borne by the customer</li>
            <li>Free return shipping for damaged/defective items</li>
            <li>Use our provided return shipping label</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Cancellation</h2>
          <p>Orders can be cancelled before shipping. Once shipped, regular return policy applies.</p>
        </section>

        <section className="mt-8 pt-6 border-t">
          <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
          <p>If you have any questions about our Refund Policy, please contact us at:</p>
          <div className="mt-2">
            <p>Email: varuntejabodepudi@gmail.com</p>
            <p>Phone: 9390817001</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RefundPolicyPage;