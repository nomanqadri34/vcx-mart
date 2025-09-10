import React from 'react';
import { ShieldCheckIcon, CurrencyRupeeIcon, ExclamationTriangleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const BugBounty = () => {
  const rewardTiers = [
    {
      severity: 'Critical',
      description: 'Remote code execution, SQL injection, authentication bypass',
      reward: '₹50,000 - ₹2,00,000',
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      severity: 'High',
      description: 'Privilege escalation, sensitive data exposure, XSS with impact',
      reward: '₹25,000 - ₹50,000',
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      severity: 'Medium',
      description: 'CSRF, information disclosure, business logic flaws',
      reward: '₹10,000 - ₹25,000',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      severity: 'Low',
      description: 'Minor security issues, configuration problems',
      reward: '₹2,500 - ₹10,000',
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50'
    }
  ];

  const inScope = [
    'vcxmart.com and all subdomains',
    'Mobile applications (iOS/Android)',
    'API endpoints',
    'Payment processing systems',
    'Admin and seller portals',
    'Third-party integrations'
  ];

  const outOfScope = [
    'Social engineering attacks',
    'Physical attacks',
    'Denial of Service (DoS/DDoS)',
    'Spam or content injection',
    'Issues in third-party services',
    'Previously reported vulnerabilities'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <ShieldCheckIcon className="h-16 w-16 text-saffron-600 mr-4" />
            <h1 className="text-4xl font-bold text-gray-900">Bug Bounty Program</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Help us keep VCX MART secure. Report security vulnerabilities and earn rewards for 
            responsible disclosure. Join our community of security researchers making e-commerce safer.
          </p>
        </div>

        {/* Program Overview */}
        <div className="bg-gradient-to-r from-saffron-500 to-green-500 rounded-lg p-8 mb-12 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">Program Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <CurrencyRupeeIcon className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Up to ₹2,00,000</h3>
              <p className="text-white/90">Maximum reward for critical vulnerabilities</p>
            </div>
            <div>
              <ShieldCheckIcon className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">24/7 Monitoring</h3>
              <p className="text-white/90">Continuous security monitoring and response</p>
            </div>
            <div>
              <DocumentTextIcon className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Hall of Fame</h3>
              <p className="text-white/90">Recognition for security researchers</p>
            </div>
          </div>
        </div>

        {/* Reward Structure */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Reward Structure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rewardTiers.map((tier, index) => (
              <div key={index} className={`${tier.bgColor} border border-gray-200 rounded-lg p-6`}>
                <div className="flex items-center mb-4">
                  <div className={`w-4 h-4 ${tier.color} rounded-full mr-3`}></div>
                  <h3 className={`text-xl font-semibold ${tier.textColor}`}>{tier.severity}</h3>
                </div>
                <p className="text-gray-700 mb-3">{tier.description}</p>
                <div className={`${tier.textColor} font-bold text-lg`}>{tier.reward}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              <strong>Note:</strong> Reward amounts are determined based on the severity, impact, and quality of the report. 
              Duplicate reports and issues with minimal security impact may receive lower rewards or no reward.
            </p>
          </div>
        </div>

        {/* Scope */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* In Scope */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">In Scope</h2>
            <div className="space-y-3">
              {inScope.map((item, index) => (
                <div key={index} className="flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Out of Scope */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Out of Scope</h2>
            <div className="space-y-3">
              {outOfScope.map((item, index) => (
                <div key={index} className="flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-3" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submission Guidelines */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Submission Guidelines</h2>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Required Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Technical Details</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Vulnerability description</li>
                  <li>Steps to reproduce</li>
                  <li>Proof of concept (PoC)</li>
                  <li>Impact assessment</li>
                  <li>Affected URLs/endpoints</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Supporting Materials</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Screenshots or videos</li>
                  <li>HTTP requests/responses</li>
                  <li>Source code snippets</li>
                  <li>Browser/environment details</li>
                  <li>Suggested remediation</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Submission Process</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="bg-saffron-100 text-saffron-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 font-bold">
                  1
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Report</h4>
                <p className="text-gray-600 text-sm">Submit detailed vulnerability report</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 text-blue-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 font-bold">
                  2
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Review</h4>
                <p className="text-gray-600 text-sm">Security team validates the issue</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 text-green-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 font-bold">
                  3
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Fix</h4>
                <p className="text-gray-600 text-sm">Vulnerability is patched and tested</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 text-purple-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3 font-bold">
                  4
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Reward</h4>
                <p className="text-gray-600 text-sm">Bounty payment and recognition</p>
              </div>
            </div>
          </div>
        </div>

        {/* Rules and Guidelines */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Rules and Guidelines</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Do's</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Follow responsible disclosure practices</li>
                <li>Provide clear and detailed reports</li>
                <li>Test on your own accounts when possible</li>
                <li>Respect user privacy and data</li>
                <li>Wait for our response before public disclosure</li>
                <li>Report one vulnerability per submission</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Don'ts</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Access or modify user data without permission</li>
                <li>Perform attacks that could harm our services</li>
                <li>Violate any laws or regulations</li>
                <li>Disclose vulnerabilities publicly before resolution</li>
                <li>Submit duplicate or previously reported issues</li>
                <li>Use automated scanners without permission</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Hall of Fame */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Hall of Fame</h2>
          <p className="text-gray-600 mb-6">
            We recognize and thank the following security researchers for their contributions to VCX MART's security:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-saffron-50 to-green-50 rounded-lg">
              <div className="w-16 h-16 bg-saffron-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-saffron-600 font-bold text-xl">🏆</span>
              </div>
              <h3 className="font-semibold text-gray-900">Top Researcher</h3>
              <p className="text-gray-600 text-sm">Coming Soon</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">🥈</span>
              </div>
              <h3 className="font-semibold text-gray-900">Rising Star</h3>
              <p className="text-gray-600 text-sm">Coming Soon</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-green-600 font-bold text-xl">🥉</span>
              </div>
              <h3 className="font-semibold text-gray-900">Contributor</h3>
              <p className="text-gray-600 text-sm">Coming Soon</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Report a Vulnerability?</h2>
          <p className="text-xl mb-8 text-white/90">
            Help us make VCX MART more secure. Submit your security findings and earn rewards.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Security Team</h3>
              <div className="text-white/90 space-y-1">
                <p><strong>Email:</strong> security@vcxmart.com</p>
                <p><strong>PGP Key:</strong> Available on request</p>
                <p><strong>Response Time:</strong> 24-48 hours</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Bug Bounty Platform</h3>
              <div className="text-white/90 space-y-1">
                <p><strong>Platform:</strong> HackerOne (Coming Soon)</p>
                <p><strong>Direct Email:</strong> bugbounty@vcxmart.com</p>
                <p><strong>Encrypted Reports:</strong> Supported</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:security@vcxmart.com"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Report Vulnerability
            </a>
            <a
              href="/security-policy"
              className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
            >
              Security Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BugBounty;