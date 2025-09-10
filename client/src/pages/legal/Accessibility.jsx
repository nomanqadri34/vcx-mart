import React from 'react';
import { EyeIcon, SpeakerWaveIcon, ComputerDesktopIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

const Accessibility = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Accessibility Statement</h1>

          {/* Introduction */}
          <div className="mb-8">
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              VCX MART is committed to ensuring digital accessibility for people with disabilities. We are continually 
              improving the user experience for everyone and applying the relevant accessibility standards to ensure 
              we provide equal access to all of our users.
            </p>
            <p className="text-gray-600">
              <strong>Last Updated:</strong> January 2024
            </p>
          </div>

          {/* Our Commitment */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment</h2>
            <p className="text-gray-600 mb-4">
              We believe that everyone should have access to information and functionality on the web, regardless of 
              their abilities or disabilities. We are committed to providing an inclusive shopping experience that 
              enables all users to successfully navigate, understand, and use our platform.
            </p>
          </div>

          {/* Accessibility Features */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Accessibility Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <EyeIcon className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Visual Accessibility</h3>
                </div>
                <ul className="text-gray-600 space-y-2">
                  <li>• High contrast color schemes</li>
                  <li>• Scalable text and images</li>
                  <li>• Alternative text for images</li>
                  <li>• Clear visual hierarchy</li>
                  <li>• Focus indicators for navigation</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <SpeakerWaveIcon className="h-8 w-8 text-green-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Audio & Screen Readers</h3>
                </div>
                <ul className="text-gray-600 space-y-2">
                  <li>• Screen reader compatibility</li>
                  <li>• Descriptive link text</li>
                  <li>• Proper heading structure</li>
                  <li>• Form labels and instructions</li>
                  <li>• Skip navigation links</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <ComputerDesktopIcon className="h-8 w-8 text-purple-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Keyboard Navigation</h3>
                </div>
                <ul className="text-gray-600 space-y-2">
                  <li>• Full keyboard accessibility</li>
                  <li>• Logical tab order</li>
                  <li>• Keyboard shortcuts</li>
                  <li>• No keyboard traps</li>
                  <li>• Visible focus indicators</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <DevicePhoneMobileIcon className="h-8 w-8 text-saffron-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Mobile Accessibility</h3>
                </div>
                <ul className="text-gray-600 space-y-2">
                  <li>• Touch-friendly interface</li>
                  <li>• Responsive design</li>
                  <li>• Voice control support</li>
                  <li>• Gesture alternatives</li>
                  <li>• Mobile screen reader support</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Standards Compliance */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Standards Compliance</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-blue-800 mb-4">
                VCX MART strives to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. 
                These guidelines explain how to make web content more accessible for people with disabilities.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2 font-bold">
                    A
                  </div>
                  <h4 className="font-semibold text-blue-900">Perceivable</h4>
                  <p className="text-blue-700 text-sm">Information must be presentable in ways users can perceive</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2 font-bold">
                    B
                  </div>
                  <h4 className="font-semibold text-blue-900">Operable</h4>
                  <p className="text-blue-700 text-sm">Interface components must be operable by all users</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2 font-bold">
                    C
                  </div>
                  <h4 className="font-semibold text-blue-900">Understandable</h4>
                  <p className="text-blue-700 text-sm">Information and UI operation must be understandable</p>
                </div>
              </div>
            </div>
          </div>

          {/* Assistive Technologies */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Supported Assistive Technologies</h3>
            <p className="text-gray-600 mb-4">
              Our website is designed to work with the following assistive technologies:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Screen Readers</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• JAWS (Windows)</li>
                  <li>• NVDA (Windows)</li>
                  <li>• VoiceOver (macOS/iOS)</li>
                  <li>• TalkBack (Android)</li>
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Other Tools</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Voice recognition software</li>
                  <li>• Switch navigation devices</li>
                  <li>• Eye-tracking systems</li>
                  <li>• Magnification software</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Browser Compatibility */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Browser Compatibility</h3>
            <p className="text-gray-600 mb-4">
              For the best accessibility experience, we recommend using the latest versions of:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900">Chrome</h4>
                <p className="text-gray-600 text-sm">Version 90+</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900">Firefox</h4>
                <p className="text-gray-600 text-sm">Version 88+</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900">Safari</h4>
                <p className="text-gray-600 text-sm">Version 14+</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900">Edge</h4>
                <p className="text-gray-600 text-sm">Version 90+</p>
              </div>
            </div>
          </div>

          {/* Ongoing Efforts */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Ongoing Accessibility Efforts</h3>
            <div className="space-y-4">
              <div className="bg-green-50 border-l-4 border-green-500 p-4">
                <h4 className="font-semibold text-green-900">Regular Audits</h4>
                <p className="text-green-700 text-sm mt-1">
                  We conduct regular accessibility audits and testing with real users to identify and address barriers.
                </p>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <h4 className="font-semibold text-blue-900">Staff Training</h4>
                <p className="text-blue-700 text-sm mt-1">
                  Our development and design teams receive ongoing training on accessibility best practices.
                </p>
              </div>
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
                <h4 className="font-semibold text-purple-900">User Feedback</h4>
                <p className="text-purple-700 text-sm mt-1">
                  We actively seek and incorporate feedback from users with disabilities to improve our platform.
                </p>
              </div>
            </div>
          </div>

          {/* Known Issues */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Known Accessibility Issues</h3>
            <p className="text-gray-600 mb-4">
              We are aware of the following accessibility issues and are working to address them:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Some third-party payment widgets may not be fully accessible</li>
              <li>Certain product images may lack comprehensive alternative text</li>
              <li>Some dynamic content updates may not be announced to screen readers</li>
            </ul>
            <p className="text-gray-600 mt-4">
              We are actively working to resolve these issues in upcoming updates.
            </p>
          </div>

          {/* Feedback and Contact */}
          <div className="bg-saffron-50 border border-saffron-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-saffron-900 mb-4">Accessibility Feedback</h3>
            <p className="text-saffron-800 mb-4">
              We welcome your feedback on the accessibility of VCX MART. If you encounter any accessibility barriers 
              or have suggestions for improvement, please let us know.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-saffron-900 mb-2">Contact Information</h4>
                <div className="text-saffron-700 space-y-1">
                  <p><strong>Email:</strong> accessibility@vcxmart.com</p>
                  <p><strong>Phone:</strong> +91 9876543210</p>
                  <p><strong>Response Time:</strong> 2-3 business days</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-saffron-900 mb-2">Alternative Formats</h4>
                <p className="text-saffron-700 text-sm">
                  If you need this accessibility statement in an alternative format, 
                  please contact us using the information provided.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:accessibility@vcxmart.com"
                className="inline-block bg-saffron-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-saffron-700 transition-colors text-center"
              >
                Report Accessibility Issue
              </a>
              <a
                href="/contact"
                className="inline-block border border-saffron-600 text-saffron-600 px-6 py-3 rounded-lg font-medium hover:bg-saffron-50 transition-colors text-center"
              >
                General Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accessibility;