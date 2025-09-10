import React from 'react';
import { ShieldCheckIcon, LockClosedIcon, EyeSlashIcon, ServerIcon } from '@heroicons/react/24/outline';

const SecurityPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Security Policy</h1>

          {/* Introduction */}
          <div className="mb-8">
            <p className="text-lg text-gray-600 leading-relaxed">
              At VCX MART, we take the security of your personal information and our platform very seriously. 
              This Security Policy outlines the measures we implement to protect your data and ensure a safe shopping experience.
            </p>
          </div>

          {/* Security Measures */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Security Measures</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <LockClosedIcon className="h-8 w-8 text-green-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">SSL Encryption</h3>
                </div>
                <p className="text-gray-600">
                  All data transmitted between your browser and our servers is protected using 256-bit SSL encryption, 
                  ensuring your personal and payment information remains secure.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <ShieldCheckIcon className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">PCI DSS Compliance</h3>
                </div>
                <p className="text-gray-600">
                  Our payment processing systems are PCI DSS compliant, meeting the highest standards 
                  for handling credit card information securely.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <ServerIcon className="h-8 w-8 text-purple-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Secure Infrastructure</h3>
                </div>
                <p className="text-gray-600">
                  Our servers are hosted in secure data centers with 24/7 monitoring, firewalls, 
                  and intrusion detection systems to prevent unauthorized access.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <EyeSlashIcon className="h-8 w-8 text-red-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Privacy Protection</h3>
                </div>
                <p className="text-gray-600">
                  We implement strict access controls and data minimization practices to ensure 
                  only authorized personnel can access your information on a need-to-know basis.
                </p>
              </div>
            </div>
          </div>

          {/* Data Protection */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Protection Practices</h3>
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <h4 className="font-semibold text-blue-900">Encryption at Rest</h4>
                <p className="text-blue-700 text-sm mt-1">
                  All sensitive data stored in our databases is encrypted using industry-standard encryption algorithms.
                </p>
              </div>
              <div className="bg-green-50 border-l-4 border-green-500 p-4">
                <h4 className="font-semibold text-green-900">Regular Security Audits</h4>
                <p className="text-green-700 text-sm mt-1">
                  We conduct regular security assessments and penetration testing to identify and address potential vulnerabilities.
                </p>
              </div>
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
                <h4 className="font-semibold text-purple-900">Access Monitoring</h4>
                <p className="text-purple-700 text-sm mt-1">
                  All access to our systems is logged and monitored for suspicious activities or unauthorized access attempts.
                </p>
              </div>
            </div>
          </div>

          {/* Account Security */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Account Security</h3>
            <p className="text-gray-600 mb-4">
              While we implement robust security measures, you also play a crucial role in keeping your account secure:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Use a strong, unique password for your VCX MART account</li>
              <li>Enable two-factor authentication when available</li>
              <li>Never share your login credentials with others</li>
              <li>Log out of your account when using shared or public computers</li>
              <li>Regularly review your account activity and report any suspicious behavior</li>
              <li>Keep your contact information up to date for security notifications</li>
            </ul>
          </div>

          {/* Payment Security */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment Security</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-900 mb-3">Secure Payment Processing</h4>
              <ul className="text-green-700 space-y-2">
                <li>• We never store your complete credit card information</li>
                <li>• All payments are processed through certified payment gateways</li>
                <li>• Tokenization technology protects your payment data</li>
                <li>• Real-time fraud detection monitors all transactions</li>
                <li>• Multiple payment options including secure digital wallets</li>
              </ul>
            </div>
          </div>

          {/* Incident Response */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Security Incident Response</h3>
            <p className="text-gray-600 mb-4">
              In the unlikely event of a security incident, we have established procedures to:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="bg-red-100 text-red-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
                <span className="text-gray-600">Immediately contain and assess the incident</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-red-100 text-red-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
                <span className="text-gray-600">Notify affected users within 72 hours</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-red-100 text-red-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
                <span className="text-gray-600">Cooperate with law enforcement if necessary</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-red-100 text-red-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">4</div>
                <span className="text-gray-600">Implement additional safeguards to prevent recurrence</span>
              </div>
            </div>
          </div>

          {/* Reporting Security Issues */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Reporting Security Vulnerabilities</h3>
            <div className="bg-saffron-50 border border-saffron-200 rounded-lg p-6">
              <p className="text-saffron-800 mb-4">
                We encourage responsible disclosure of security vulnerabilities. If you discover a security issue, 
                please report it to our security team immediately.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/bug-bounty"
                  className="inline-block bg-saffron-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-saffron-700 transition-colors text-center"
                >
                  Bug Bounty Program
                </a>
                <a
                  href="mailto:security@vcxmart.com"
                  className="inline-block border border-saffron-600 text-saffron-600 px-6 py-3 rounded-lg font-medium hover:bg-saffron-50 transition-colors text-center"
                >
                  Report Security Issue
                </a>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Security Contact</h3>
            <p className="text-gray-600 mb-4">
              For security-related inquiries or to report security concerns, please contact our security team:
            </p>
            <div className="space-y-2 text-gray-600">
              <p><strong>Email:</strong> security@vcxmart.com</p>
              <p><strong>Response Time:</strong> Within 24 hours for critical issues</p>
              <p><strong>Last Updated:</strong> January 2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPolicy;