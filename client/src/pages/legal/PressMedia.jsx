import React from 'react';
import { NewspaperIcon, CameraIcon, DocumentArrowDownIcon, PhoneIcon } from '@heroicons/react/24/outline';

const PressMedia = () => {
  const pressReleases = [
    {
      date: '2024-01-15',
      title: 'VCX MART Launches Revolutionary Multi-Vendor Marketplace Platform',
      excerpt: 'New platform connects thousands of sellers with millions of customers across India, featuring advanced AI-powered recommendations and seamless shopping experience.',
      category: 'Product Launch'
    },
    {
      date: '2024-01-10',
      title: 'VCX MART Secures Series A Funding to Expand Operations',
      excerpt: 'Leading e-commerce platform raises significant funding to enhance technology infrastructure and expand to tier-2 and tier-3 cities.',
      category: 'Funding'
    },
    {
      date: '2023-12-20',
      title: 'VCX MART Partners with Local Artisans to Promote Traditional Crafts',
      excerpt: 'Initiative aims to digitize traditional Indian crafts and provide artisans with direct access to national and international markets.',
      category: 'Partnership'
    }
  ];

  const mediaKit = [
    {
      title: 'Company Logo Pack',
      description: 'High-resolution logos in various formats (PNG, SVG, EPS)',
      size: '2.5 MB'
    },
    {
      title: 'Brand Guidelines',
      description: 'Complete brand identity guidelines and usage instructions',
      size: '1.8 MB'
    },
    {
      title: 'Product Screenshots',
      description: 'High-quality screenshots of our platform and mobile app',
      size: '5.2 MB'
    },
    {
      title: 'Executive Photos',
      description: 'Professional headshots of leadership team',
      size: '3.1 MB'
    }
  ];

  const awards = [
    {
      year: '2024',
      title: 'Best E-commerce Platform',
      organization: 'India Digital Awards',
      description: 'Recognized for innovation in multi-vendor marketplace technology'
    },
    {
      year: '2023',
      title: 'Startup of the Year',
      organization: 'TechCrunch India',
      description: 'Awarded for rapid growth and market impact in e-commerce sector'
    },
    {
      year: '2023',
      title: 'Customer Choice Award',
      organization: 'E-commerce Excellence Awards',
      description: 'Honored for outstanding customer service and user experience'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Press & Media</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest news, announcements, and media resources from VCX MART. 
            Find everything you need for your story about India's fastest-growing e-commerce platform.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-r from-saffron-500 to-green-500 rounded-lg p-8 mb-12 text-white">
          <h2 className="text-2xl font-bold mb-8 text-center">VCX MART at a Glance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">10K+</div>
              <div className="text-white/90">Active Sellers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">1M+</div>
              <div className="text-white/90">Products Listed</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">500K+</div>
              <div className="text-white/90">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">100+</div>
              <div className="text-white/90">Cities Served</div>
            </div>
          </div>
        </div>

        {/* Press Releases */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <div className="flex items-center mb-8">
            <NewspaperIcon className="h-8 w-8 text-saffron-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Latest Press Releases</h2>
          </div>
          <div className="space-y-8">
            {pressReleases.map((release, index) => (
              <div key={index} className="border-b border-gray-200 pb-8 last:border-b-0">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="bg-saffron-100 text-saffron-800 px-3 py-1 rounded-full text-sm font-medium mr-3">
                        {release.category}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {new Date(release.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{release.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{release.excerpt}</p>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-6">
                    <button className="bg-saffron-600 text-white px-6 py-2 rounded-lg hover:bg-saffron-700 transition-colors">
                      Read Full Release
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Media Kit */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <div className="flex items-center mb-8">
            <DocumentArrowDownIcon className="h-8 w-8 text-green-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Media Kit</h2>
          </div>
          <p className="text-gray-600 mb-8">
            Download our media kit for high-resolution logos, brand guidelines, product images, 
            and other resources for your articles and presentations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mediaKit.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                    <span className="text-xs text-gray-500">File size: {item.size}</span>
                  </div>
                  <button className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Awards & Recognition */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Awards & Recognition</h2>
          <div className="space-y-6">
            {awards.map((award, index) => (
              <div key={index} className="flex items-start space-x-6 p-6 bg-gray-50 rounded-lg">
                <div className="bg-saffron-100 text-saffron-800 rounded-full w-16 h-16 flex items-center justify-center font-bold text-lg">
                  {award.year}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{award.title}</h3>
                  <p className="text-saffron-600 font-medium mb-2">{award.organization}</p>
                  <p className="text-gray-600">{award.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership Team */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900">Varun Teja Bodepudi</h3>
              <p className="text-saffron-600 font-medium">Founder & CEO</p>
              <p className="text-gray-600 text-sm mt-2">
                Visionary leader with 10+ years in e-commerce and technology innovation.
              </p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900">Sarah Johnson</h3>
              <p className="text-saffron-600 font-medium">Chief Technology Officer</p>
              <p className="text-gray-600 text-sm mt-2">
                Technology expert leading platform development and innovation initiatives.
              </p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900">Rajesh Kumar</h3>
              <p className="text-saffron-600 font-medium">Chief Operating Officer</p>
              <p className="text-gray-600 text-sm mt-2">
                Operations specialist ensuring seamless marketplace experience for all users.
              </p>
            </div>
          </div>
        </div>

        {/* Media Contact */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white text-center">
          <div className="flex items-center justify-center mb-4">
            <PhoneIcon className="h-8 w-8 mr-3" />
            <h2 className="text-3xl font-bold">Media Inquiries</h2>
          </div>
          <p className="text-xl mb-8 text-white/90">
            For press inquiries, interview requests, or additional information, please contact our media team.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div>
              <h3 className="text-lg font-semibold mb-2">Press Contact</h3>
              <p className="text-white/90">Priya Sharma</p>
              <p className="text-white/90">Head of Communications</p>
              <p className="text-white/90">press@vcxmart.com</p>
              <p className="text-white/90">+91 9876543210</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Partnership Inquiries</h3>
              <p className="text-white/90">Amit Patel</p>
              <p className="text-white/90">Business Development</p>
              <p className="text-white/90">partnerships@vcxmart.com</p>
              <p className="text-white/90">+91 9876543211</p>
            </div>
          </div>
          <div className="mt-8">
            <a
              href="mailto:press@vcxmart.com"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Contact Media Team
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PressMedia;