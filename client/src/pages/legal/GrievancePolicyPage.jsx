import React from 'react';

const GrievancePolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Grievance Policy</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Purpose</h2>
          <p>This policy outlines the procedure for handling grievances and complaints from users of VCX MART platform, ensuring fair and timely resolution of all issues.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Grievance Categories</h2>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Product Quality Issues</li>
            <li>Delivery Problems</li>
            <li>Payment Disputes</li>
            <li>Customer Service Complaints</li>
            <li>Account-related Issues</li>
            <li>Privacy Concerns</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Resolution Timeline</h2>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Initial Response: Within 24 hours</li>
            <li>Basic Issues: 48-72 hours</li>
            <li>Complex Issues: 3-7 working days</li>
            <li>Escalated Cases: Up to 15 working days</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Grievance Resolution Process</h2>
          <ol className="list-decimal pl-6 mt-2 space-y-2">
            <li>Submit complaint through our designated channels</li>
            <li>Receive acknowledgment with ticket number</li>
            <li>Investigation of the complaint</li>
            <li>Resolution proposal</li>
            <li>Implementation of solution</li>
            <li>Feedback collection</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Escalation Matrix</h2>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Level 1: Customer Support Team</li>
            <li>Level 2: Grievance Resolution Officer</li>
            <li>Level 3: Senior Management</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Rights and Responsibilities</h2>
          <div className="space-y-4">
            <p className="font-semibold">User Rights:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Fair and timely resolution</li>
              <li>Regular updates on complaint status</li>
              <li>Appeal against unsatisfactory resolution</li>
            </ul>
            
            <p className="font-semibold">User Responsibilities:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate information</li>
              <li>Maintain respectful communication</li>
              <li>Cooperate during the resolution process</li>
            </ul>
          </div>
        </section>

        <section className="mt-8 pt-6 border-t">
          <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
          <p>For any grievances or complaints, please contact our Grievance Officer at:</p>
          <div className="mt-2">
            <p>Email: varuntejabodepudi@gmail.com</p>
            <p>Phone: 9390817001</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GrievancePolicyPage;