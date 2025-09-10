import React from 'react';
import { CogIcon, ChartBarIcon, ShieldCheckIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Cookie Policy</h1>

          {/* Introduction */}
          <div className="mb-8">
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              This Cookie Policy explains how VCX MART uses cookies and similar technologies when you visit our website. 
              It explains what these technologies are, why we use them, and your rights to control our use of them.
            </p>
            <p className="text-gray-600">
              <strong>Last Updated:</strong> January 2024
            </p>
          </div>

          {/* What are Cookies */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What are Cookies?</h2>
            <p className="text-gray-600 mb-4">
              Cookies are small text files that are stored on your device when you visit a website. They help websites 
              remember information about your visit, such as your preferred language and other settings, which can make 
              your next visit easier and the site more useful to you.
            </p>
          </div>

          {/* Types of Cookies */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Types of Cookies We Use</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <CogIcon className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Essential Cookies</h3>
                </div>
                <p className="text-gray-600 mb-3">
                  These cookies are necessary for the website to function properly. They enable basic functions 
                  like page navigation, access to secure areas, and shopping cart functionality.
                </p>
                <p className="text-sm text-blue-600 font-medium">Cannot be disabled</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <ChartBarIcon className="h-8 w-8 text-green-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Analytics Cookies</h3>
                </div>
                <p className="text-gray-600 mb-3">
                  These cookies help us understand how visitors interact with our website by collecting 
                  and reporting information anonymously.
                </p>
                <p className="text-sm text-green-600 font-medium">Can be disabled</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <ShieldCheckIcon className="h-8 w-8 text-purple-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Functional Cookies</h3>
                </div>
                <p className="text-gray-600 mb-3">
                  These cookies enable enhanced functionality and personalization, such as remembering 
                  your preferences and providing personalized content.
                </p>
                <p className="text-sm text-purple-600 font-medium">Can be disabled</p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <GlobeAltIcon className="h-8 w-8 text-saffron-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Marketing Cookies</h3>
                </div>
                <p className="text-gray-600 mb-3">
                  These cookies track your online activity to help advertisers deliver more relevant 
                  advertising or to limit how many times you see an ad.
                </p>
                <p className="text-sm text-saffron-600 font-medium">Can be disabled</p>
              </div>
            </div>
          </div>

          {/* Detailed Cookie Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Detailed Cookie Information</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left">Cookie Name</th>
                    <th className="border border-gray-300 px-4 py-3 text-left">Purpose</th>
                    <th className="border border-gray-300 px-4 py-3 text-left">Duration</th>
                    <th className="border border-gray-300 px-4 py-3 text-left">Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 font-mono text-sm">session_id</td>
                    <td className="border border-gray-300 px-4 py-3">Maintains user session</td>
                    <td className="border border-gray-300 px-4 py-3">Session</td>
                    <td className="border border-gray-300 px-4 py-3">Essential</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-mono text-sm">cart_items</td>
                    <td className="border border-gray-300 px-4 py-3">Stores shopping cart contents</td>
                    <td className="border border-gray-300 px-4 py-3">7 days</td>
                    <td className="border border-gray-300 px-4 py-3">Essential</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 font-mono text-sm">user_preferences</td>
                    <td className="border border-gray-300 px-4 py-3">Remembers user settings</td>
                    <td className="border border-gray-300 px-4 py-3">1 year</td>
                    <td className="border border-gray-300 px-4 py-3">Functional</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-mono text-sm">_ga</td>
                    <td className="border border-gray-300 px-4 py-3">Google Analytics tracking</td>
                    <td className="border border-gray-300 px-4 py-3">2 years</td>
                    <td className="border border-gray-300 px-4 py-3">Analytics</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 font-mono text-sm">marketing_consent</td>
                    <td className="border border-gray-300 px-4 py-3">Tracks marketing preferences</td>
                    <td className="border border-gray-300 px-4 py-3">1 year</td>
                    <td className="border border-gray-300 px-4 py-3">Marketing</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Third-Party Cookies */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Third-Party Cookies</h3>
            <p className="text-gray-600 mb-4">
              We may also use third-party cookies from trusted partners to enhance your experience:
            </p>
            <div className="space-y-4">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <h4 className="font-semibold text-blue-900">Google Analytics</h4>
                <p className="text-blue-700 text-sm mt-1">
                  Helps us understand website usage and improve user experience.
                </p>
              </div>
              <div className="bg-green-50 border-l-4 border-green-500 p-4">
                <h4 className="font-semibold text-green-900">Payment Processors</h4>
                <p className="text-green-700 text-sm mt-1">
                  Secure payment processing and fraud prevention.
                </p>
              </div>
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
                <h4 className="font-semibold text-purple-900">Social Media Platforms</h4>
                <p className="text-purple-700 text-sm mt-1">
                  Social sharing functionality and targeted advertising.
                </p>
              </div>
            </div>
          </div>

          {/* Managing Cookies */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Managing Your Cookie Preferences</h3>
            <p className="text-gray-600 mb-4">
              You have several options to manage cookies:
            </p>
            <div className="space-y-4">
              <div className="bg-saffron-50 border border-saffron-200 rounded-lg p-4">
                <h4 className="font-semibold text-saffron-900 mb-2">Browser Settings</h4>
                <p className="text-saffron-700 text-sm">
                  Most browsers allow you to control cookies through their settings. You can set your browser to 
                  refuse cookies or to alert you when cookies are being sent.
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-2">Cookie Consent Manager</h4>
                <p className="text-green-700 text-sm">
                  Use our cookie consent banner to customize your preferences when you first visit our site.
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Opt-Out Tools</h4>
                <p className="text-blue-700 text-sm">
                  Use industry opt-out tools like the Digital Advertising Alliance's opt-out page to control 
                  advertising cookies across multiple sites.
                </p>
              </div>
            </div>
          </div>

          {/* Browser Instructions */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Browser-Specific Instructions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Chrome</h4>
                <p className="text-gray-600 text-sm">Settings → Privacy and Security → Cookies and other site data</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Firefox</h4>
                <p className="text-gray-600 text-sm">Options → Privacy & Security → Cookies and Site Data</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Safari</h4>
                <p className="text-gray-600 text-sm">Preferences → Privacy → Manage Website Data</p>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Edge</h4>
                <p className="text-gray-600 text-sm">Settings → Cookies and site permissions → Cookies and site data</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Questions About Cookies?</h3>
            <p className="text-gray-600 mb-4">
              If you have any questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/contact"
                className="inline-block bg-saffron-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-saffron-700 transition-colors text-center"
              >
                Contact Us
              </a>
              <a
                href="/privacy-policy"
                className="inline-block border border-saffron-600 text-saffron-600 px-6 py-3 rounded-lg font-medium hover:bg-saffron-50 transition-colors text-center"
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;