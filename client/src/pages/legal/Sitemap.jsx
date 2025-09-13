import React from 'react';
import { Link } from 'react-router-dom';
import { MapIcon, HomeIcon, ShoppingBagIcon, UserIcon, CogIcon } from '@heroicons/react/24/outline';

const Sitemap = () => {
  const siteStructure = [
    {
      category: 'Main Pages',
      icon: HomeIcon,
      links: [
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
        { name: 'Categories', path: '/categories' },
        { name: 'Deals', path: '/deals' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact Us', path: '/contact' }
      ]
    },
    {
      category: 'Shopping',
      icon: ShoppingBagIcon,
      links: [
        { name: 'Shopping Cart', path: '/cart' },
        { name: 'Checkout', path: '/checkout' },
        { name: 'Wishlist', path: '/wishlist' },
        { name: 'Product Search', path: '/search' }
      ]
    },
    {
      category: 'User Account',
      icon: UserIcon,
      links: [
        { name: 'Login', path: '/login' },
        { name: 'Register', path: '/register' },
        { name: 'User Dashboard', path: '/user/dashboard' },
        { name: 'My Profile', path: '/user/profile' },
        { name: 'My Orders', path: '/user/orders' },
        { name: 'My Addresses', path: '/user/addresses' }
      ]
    },
    {
      category: 'Seller Portal',
      icon: CogIcon,
      links: [
        { name: 'Become a Seller', path: '/seller/apply' },
        { name: 'Seller Dashboard', path: '/seller/dashboard' },
        { name: 'Seller Products', path: '/seller/products' },
        { name: 'Add Product', path: '/seller/products/add' },
        { name: 'Seller Orders', path: '/seller/orders' },
        { name: 'Seller Categories', path: '/seller/categories' }
      ]
    },
    {
      category: 'Customer Service',
      icon: MapIcon,
      links: [
        { name: 'Help Center', path: '/help' },
        { name: 'Contact Support', path: '/contact' },
        { name: 'Returns & Refunds', path: '/returns-refunds' },
        { name: 'Shipping Information', path: '/shipping-info' },

      ]
    },
    {
      category: 'Legal & Policies',
      icon: MapIcon,
      links: [
        { name: 'Privacy Policy', path: '/privacy-policy' },
        { name: 'Terms of Service', path: '/terms-of-service' },
        { name: 'Refund Policy', path: '/refund-policy' },
        { name: 'Seller Policy', path: '/seller-policy' },
        { name: 'Grievance Policy', path: '/grievance-policy' },
        { name: 'Security Policy', path: '/security-policy' },
        { name: 'Cookie Policy', path: '/cookie-policy' },
        { name: 'Intellectual Property', path: '/intellectual-property' }
      ]
    },
    {
      category: 'Company Information',
      icon: MapIcon,
      links: [
        { name: 'About VCX MART', path: '/about' },
        { name: 'Careers', path: '/careers' },
        { name: 'Press & Media', path: '/press' },
        { name: 'Sitemap', path: '/sitemap' },
        { name: 'Accessibility', path: '/accessibility' },
        { name: 'Bug Bounty', path: '/bug-bounty' },
        { name: 'Security', path: '/responsible-disclosure' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <MapIcon className="h-12 w-12 text-saffron-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Sitemap</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Navigate through all pages and sections of VCX MART. Find exactly what you're looking for
            with our comprehensive site structure.
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {siteStructure.map((section, index) => (
              <a
                key={index}
                href={`#${section.category.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-saffron-50 hover:text-saffron-600 transition-colors text-center"
              >
                <section.icon className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium">{section.category}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Site Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {siteStructure.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              id={section.category.toLowerCase().replace(/\s+/g, '-')}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center mb-6">
                <section.icon className="h-8 w-8 text-saffron-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">{section.category}</h2>
              </div>
              <div className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <Link
                    key={linkIndex}
                    to={link.path}
                    className="block py-2 px-3 text-gray-700 hover:text-saffron-600 hover:bg-saffron-50 rounded-md transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-gradient-to-r from-saffron-500 to-green-500 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-xl mb-6 text-white/90">
            Our search function and customer support team are here to help you navigate VCX MART.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/search"
              className="inline-block bg-white text-saffron-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Search Site
            </Link>
            <Link
              to="/contact"
              className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-saffron-600 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>

        {/* Footer Information */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Site Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <strong>Total Pages:</strong> {siteStructure.reduce((total, section) => total + section.links.length, 0)}
              </div>
              <div>
                <strong>Last Updated:</strong> January 2024
              </div>
              <div>
                <strong>Site Version:</strong> 2.0
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;