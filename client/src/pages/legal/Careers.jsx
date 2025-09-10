import React from 'react';
import { BriefcaseIcon, UserGroupIcon, GlobeAltIcon, HeartIcon } from '@heroicons/react/24/outline';

const Careers = () => {
  const openPositions = [
    {
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      location: 'Mumbai, India',
      type: 'Full-time',
      experience: '3-5 years'
    },
    {
      title: 'Product Manager',
      department: 'Product',
      location: 'Bangalore, India',
      type: 'Full-time',
      experience: '4-6 years'
    },
    {
      title: 'Digital Marketing Specialist',
      department: 'Marketing',
      location: 'Delhi, India',
      type: 'Full-time',
      experience: '2-4 years'
    },
    {
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Remote',
      type: 'Full-time',
      experience: '2-3 years'
    }
  ];

  const benefits = [
    {
      icon: HeartIcon,
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance, mental health support, and wellness programs'
    },
    {
      icon: GlobeAltIcon,
      title: 'Flexible Work',
      description: 'Remote work options, flexible hours, and work-life balance initiatives'
    },
    {
      icon: UserGroupIcon,
      title: 'Learning & Growth',
      description: 'Professional development budget, mentorship programs, and career advancement'
    },
    {
      icon: BriefcaseIcon,
      title: 'Competitive Package',
      description: 'Market-competitive salary, equity options, and performance bonuses'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Our Team</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Help us build the future of e-commerce in India. Join a team of passionate individuals 
            working to create exceptional shopping experiences for millions of customers.
          </p>
        </div>

        {/* Company Culture */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Why VCX MART?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="bg-saffron-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-8 w-8 text-saffron-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Values */}
        <div className="bg-gradient-to-r from-saffron-500 to-green-500 rounded-lg p-8 mb-12 text-white">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3">Customer First</h3>
              <p className="text-white/90">
                We put our customers at the heart of everything we do, creating experiences that delight and inspire.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-white/90">
                We embrace new technologies and ideas to solve complex problems and drive the industry forward.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-3">Integrity</h3>
              <p className="text-white/90">
                We operate with transparency, honesty, and ethical practices in all our business dealings.
              </p>
            </div>
          </div>
        </div>

        {/* Open Positions */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Open Positions</h2>
          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{position.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <BriefcaseIcon className="h-4 w-4 mr-1" />
                        {position.department}
                      </span>
                      <span>{position.location}</span>
                      <span>{position.type}</span>
                      <span>{position.experience} experience</span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <button className="bg-saffron-600 text-white px-6 py-2 rounded-lg hover:bg-saffron-700 transition-colors">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {openPositions.length === 0 && (
            <div className="text-center py-12">
              <BriefcaseIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Open Positions</h3>
              <p className="text-gray-600">
                We don't have any open positions right now, but we're always looking for talented individuals. 
                Send us your resume and we'll keep you in mind for future opportunities.
              </p>
            </div>
          )}
        </div>

        {/* Application Process */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Application Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 text-blue-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Apply Online</h3>
              <p className="text-gray-600 text-sm">Submit your application through our careers portal</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 text-green-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Initial Screening</h3>
              <p className="text-gray-600 text-sm">HR team reviews your application and conducts initial screening</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 text-purple-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Technical Interview</h3>
              <p className="text-gray-600 text-sm">Technical assessment and interviews with the hiring team</p>
            </div>
            <div className="text-center">
              <div className="bg-saffron-100 text-saffron-800 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                4
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Final Decision</h3>
              <p className="text-gray-600 text-sm">Reference checks and offer discussion</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Don't See the Right Role?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We're always interested in meeting talented individuals. Send us your resume and tell us 
            how you'd like to contribute to VCX MART's mission.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:careers@vcxmart.com"
              className="inline-block bg-saffron-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-saffron-700 transition-colors"
            >
              Send Your Resume
            </a>
            <a
              href="/contact"
              className="inline-block border border-saffron-600 text-saffron-600 px-8 py-3 rounded-lg font-medium hover:bg-saffron-50 transition-colors"
            >
              Contact HR Team
            </a>
          </div>
          <div className="mt-6 text-sm text-gray-500">
            <p>Email: careers@vcxmart.com</p>
            <p>Phone: +91 9876543210</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers;