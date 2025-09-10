import React from 'react';
import { DocumentTextIcon, ExclamationTriangleIcon, ShieldCheckIcon, ScaleIcon } from '@heroicons/react/24/outline';

const IntellectualProperty = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Intellectual Property Policy</h1>

          {/* Introduction */}
          <div className="mb-8">
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              VCX MART respects the intellectual property rights of others and expects our users to do the same. 
              This policy outlines our approach to intellectual property protection and the procedures for 
              reporting alleged infringement.
            </p>
            <p className="text-gray-600">
              <strong>Last Updated:</strong> January 2024
            </p>
          </div>

          {/* Our IP Rights */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">VCX MART Intellectual Property</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <DocumentTextIcon className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Trademarks</h3>
                </div>
                <p className="text-gray-600">
                  The VCX MART name, logo, and other brand elements are trademarks owned by us. 
                  Unauthorized use of our trademarks is prohibited.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <ShieldCheckIcon className="h-8 w-8 text-green-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Copyrights</h3>
                </div>
                <p className="text-gray-600">
                  All content on our website, including text, graphics, logos, images, and software, 
                  is protected by copyright laws.
                </p>
              </div>
            </div>
          </div>

          {/* Seller Responsibilities */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Seller Responsibilities</h3>
            <div className="bg-saffron-50 border border-saffron-200 rounded-lg p-6">
              <h4 className="font-semibold text-saffron-900 mb-3">Product Listings</h4>
              <p className="text-saffron-800 mb-4">
                Sellers are responsible for ensuring that their product listings do not infringe on the 
                intellectual property rights of others. This includes:
              </p>
              <ul className="list-disc list-inside text-saffron-700 space-y-2">
                <li>Using only authorized product images and descriptions</li>
                <li>Not selling counterfeit or replica products</li>
                <li>Respecting trademark and copyright protections</li>
                <li>Obtaining proper licenses for branded products</li>
                <li>Providing accurate product information and authenticity</li>
              </ul>
            </div>
          </div>

          {/* Prohibited Activities */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Prohibited Activities</h3>
            <div className="space-y-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex items-center mb-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                  <h4 className="font-semibold text-red-900">Counterfeit Products</h4>
                </div>
                <p className="text-red-700 text-sm">
                  Selling fake, replica, or unauthorized copies of branded products is strictly prohibited.
                </p>
              </div>
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex items-center mb-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                  <h4 className="font-semibold text-red-900">Trademark Infringement</h4>
                </div>
                <p className="text-red-700 text-sm">
                  Using another company's trademarks without authorization in product titles, descriptions, or images.
                </p>
              </div>
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex items-center mb-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                  <h4 className="font-semibold text-red-900">Copyright Violation</h4>
                </div>
                <p className="text-red-700 text-sm">
                  Using copyrighted images, text, or other content without proper permission or licensing.
                </p>
              </div>
            </div>
          </div>

          {/* DMCA Notice */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">DMCA Takedown Notice</h3>
            <p className="text-gray-600 mb-4">
              If you believe that your copyrighted work has been copied and is accessible on our platform 
              in a way that constitutes copyright infringement, you may submit a DMCA takedown notice.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-blue-900 mb-3">Required Information for DMCA Notice</h4>
              <ul className="list-disc list-inside text-blue-700 space-y-2">
                <li>Your physical or electronic signature</li>
                <li>Identification of the copyrighted work claimed to be infringed</li>
                <li>Identification of the infringing material and its location on our site</li>
                <li>Your contact information (address, phone number, email)</li>
                <li>A statement of good faith belief that the use is not authorized</li>
                <li>A statement that the information is accurate and you are authorized to act</li>
              </ul>
            </div>

            <div className="bg-gray-100 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Send DMCA Notices to:</h4>
              <div className="text-gray-700">
                <p><strong>Email:</strong> dmca@vcxmart.com</p>
                <p><strong>Address:</strong> VCX MART Legal Department<br />
                123 Business District<br />
                Mumbai, Maharashtra 400001</p>
              </div>
            </div>
          </div>

          {/* Counter-Notice */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Counter-Notice Procedure</h3>
            <p className="text-gray-600 mb-4">
              If you believe that your content was removed or disabled by mistake or misidentification, 
              you may file a counter-notice with the following information:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Your physical or electronic signature</li>
              <li>Identification of the material that was removed or disabled</li>
              <li>A statement under penalty of perjury that you have a good faith belief that the material was removed by mistake</li>
              <li>Your name, address, and phone number</li>
              <li>A statement that you consent to the jurisdiction of the federal court</li>
            </ul>
          </div>

          {/* Trademark Complaints */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Trademark Complaints</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <p className="text-green-800 mb-4">
                If you believe your trademark rights are being infringed on our platform, please provide:
              </p>
              <ul className="list-disc list-inside text-green-700 space-y-2">
                <li>Proof of trademark registration or pending application</li>
                <li>Identification of the allegedly infringing listings</li>
                <li>Explanation of how the listings infringe your rights</li>
                <li>Your contact information and signature</li>
              </ul>
              <p className="text-green-800 mt-4">
                <strong>Email:</strong> trademark@vcxmart.com
              </p>
            </div>
          </div>

          {/* Enforcement Actions */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Enforcement Actions</h3>
            <p className="text-gray-600 mb-4">
              Upon receiving a valid IP complaint, we may take the following actions:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="bg-saffron-100 text-saffron-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
                <span className="text-gray-600">Remove or disable access to the infringing content</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-saffron-100 text-saffron-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
                <span className="text-gray-600">Notify the alleged infringer of the complaint</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-saffron-100 text-saffron-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
                <span className="text-gray-600">Suspend or terminate repeat offenders' accounts</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-saffron-100 text-saffron-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">4</div>
                <span className="text-gray-600">Cooperate with law enforcement when necessary</span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <ScaleIcon className="h-6 w-6 text-saffron-600 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">Legal Contact Information</h3>
            </div>
            <p className="text-gray-600 mb-4">
              For all intellectual property matters, please contact our legal department:
            </p>
            <div className="space-y-2 text-gray-600">
              <p><strong>General IP Inquiries:</strong> legal@vcxmart.com</p>
              <p><strong>DMCA Notices:</strong> dmca@vcxmart.com</p>
              <p><strong>Trademark Complaints:</strong> trademark@vcxmart.com</p>
              <p><strong>Phone:</strong> +91 9876543210 (Legal Department)</p>
              <p><strong>Response Time:</strong> 5-7 business days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntellectualProperty;