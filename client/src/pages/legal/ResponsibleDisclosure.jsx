import React from 'react';
import { ShieldExclamationIcon, ClockIcon, DocumentCheckIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const ResponsibleDisclosure = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Responsible Disclosure Policy</h1>

          {/* Introduction */}
          <div className="mb-8">
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              VCX MART is committed to maintaining the security and privacy of our platform and users. 
              We appreciate the security research community's efforts to responsibly disclose vulnerabilities 
              and work with us to protect our users.
            </p>
            <p className="text-gray-600">
              <strong>Last Updated:</strong> January 2024
            </p>
          </div>

          {/* Our Commitment */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Commitment to Security Researchers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <ShieldExclamationIcon className="h-8 w-8 text-green-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Safe Harbor</h3>
                </div>
                <p className="text-gray-600">
                  We will not pursue legal action against researchers who follow our responsible 
                  disclosure guidelines and act in good faith.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <ClockIcon className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Timely Response</h3>
                </div>
                <p className="text-gray-600">
                  We commit to acknowledging your report within 24-48 hours and providing 
                  regular updates on our progress.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <DocumentCheckIcon className="h-8 w-8 text-purple-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Recognition</h3>
                </div>
                <p className="text-gray-600">
                  We will publicly acknowledge your contribution (with your permission) 
                  and may include you in our security hall of fame.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <UserGroupIcon className="h-8 w-8 text-saffron-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Collaboration</h3>
                </div>
                <p className="text-gray-600">
                  We will work with you to understand the vulnerability and develop 
                  appropriate fixes and mitigations.
                </p>
              </div>
            </div>
          </div>

          {/* Disclosure Process */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Responsible Disclosure Process</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-saffron-100 text-saffron-800 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Initial Report</h4>
                  <p className="text-gray-600">
                    Submit a detailed vulnerability report to our security team via email or our bug bounty platform. 
                    Include all necessary technical details and proof of concept.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Acknowledgment</h4>
                  <p className="text-gray-600">
                    We will acknowledge receipt of your report within 24-48 hours and assign a tracking number. 
                    Our security team will begin initial assessment.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-green-100 text-green-800 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Investigation</h4>
                  <p className="text-gray-600">
                    Our team will investigate and validate the vulnerability. We may request additional 
                    information or clarification during this phase.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 text-purple-800 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Resolution</h4>
                  <p className="text-gray-600">
                    We will develop and deploy a fix for the vulnerability. The timeline depends on 
                    the complexity and severity of the issue.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-red-100 text-red-800 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                  5
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Disclosure</h4>
                  <p className="text-gray-600">
                    After the vulnerability is fixed and deployed, we will coordinate with you on 
                    public disclosure timing and details.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Expectations */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Response Timeline</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <ClockIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-blue-900">Initial Response</h4>
                  <p className="text-blue-700 text-sm">24-48 hours</p>
                </div>
                <div className="text-center">
                  <DocumentCheckIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-blue-900">Validation</h4>
                  <p className="text-blue-700 text-sm">3-7 business days</p>
                </div>
                <div className="text-center">
                  <ShieldExclamationIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-blue-900">Resolution</h4>
                  <p className="text-blue-700 text-sm">Varies by severity</p>
                </div>
              </div>
            </div>
          </div>

          {/* Guidelines for Researchers */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Guidelines for Security Researchers</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <div>
                <h4 className="font-semibold text-green-900 mb-3">✅ Acceptable Activities</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Testing on your own accounts</li>
                  <li>Automated scanning with rate limiting</li>
                  <li>Social engineering of VCX MART employees (with prior approval)</li>
                  <li>Physical security testing (with prior approval)</li>
                  <li>Testing that doesn't impact other users</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-900 mb-3">❌ Prohibited Activities</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Accessing or modifying other users' data</li>
                  <li>Performing attacks that degrade service quality</li>
                  <li>Social engineering of customers</li>
                  <li>Physical attacks on our infrastructure</li>
                  <li>Violating privacy or data protection laws</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Severity Classification */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Vulnerability Severity Classification</h3>
            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <h4 className="font-semibold text-red-900">Critical (CVSS 9.0-10.0)</h4>
                <p className="text-red-700 text-sm mt-1">
                  Vulnerabilities that allow remote code execution, complete system compromise, 
                  or access to highly sensitive data affecting all users.
                </p>
              </div>
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
                <h4 className="font-semibold text-orange-900">High (CVSS 7.0-8.9)</h4>
                <p className="text-orange-700 text-sm mt-1">
                  Significant security flaws that could lead to privilege escalation, 
                  sensitive data exposure, or impact on business operations.
                </p>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                <h4 className="font-semibold text-yellow-900">Medium (CVSS 4.0-6.9)</h4>
                <p className="text-yellow-700 text-sm mt-1">
                  Moderate security issues that could be exploited under specific conditions 
                  or require user interaction.
                </p>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <h4 className="font-semibold text-blue-900">Low (CVSS 0.1-3.9)</h4>
                <p className="text-blue-700 text-sm mt-1">
                  Minor security issues with limited impact or requiring significant 
                  prerequisites to exploit.
                </p>
              </div>
            </div>
          </div>

          {/* Legal Considerations */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Legal Considerations</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                By participating in our responsible disclosure program, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Not violate any applicable laws or regulations</li>
                <li>Not access, modify, or delete data belonging to others</li>
                <li>Not disrupt our services or harm our users</li>
                <li>Provide us with reasonable time to address the vulnerability before public disclosure</li>
                <li>Not demand payment or threaten public disclosure as leverage</li>
                <li>Act in good faith and avoid privacy violations</li>
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-saffron-50 border border-saffron-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-saffron-900 mb-4">Security Contact Information</h3>
            <p className="text-saffron-800 mb-4">
              For security vulnerabilities and responsible disclosure, please contact our security team:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-saffron-900 mb-2">Primary Contact</h4>
                <div className="text-saffron-700 space-y-1">
                  <p><strong>Email:</strong> security@vcxmart.com</p>
                  <p><strong>Subject Line:</strong> [SECURITY] Vulnerability Report</p>
                  <p><strong>PGP Key:</strong> Available upon request</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-saffron-900 mb-2">Alternative Contact</h4>
                <div className="text-saffron-700 space-y-1">
                  <p><strong>Bug Bounty:</strong> bugbounty@vcxmart.com</p>
                  <p><strong>Phone:</strong> +91 9876543210 (Security Team)</p>
                  <p><strong>Response Time:</strong> 24-48 hours</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:security@vcxmart.com"
                className="inline-block bg-saffron-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-saffron-700 transition-colors text-center"
              >
                Report Security Issue
              </a>
              <a
                href="/bug-bounty"
                className="inline-block border border-saffron-600 text-saffron-600 px-6 py-3 rounded-lg font-medium hover:bg-saffron-50 transition-colors text-center"
              >
                Bug Bounty Program
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsibleDisclosure;