import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, VideoCameraIcon, UserGroupIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { affiliateAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AffiliateApplication = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    channelName: '',
    channelUrl: '',
    subscriberCount: '',
    averageViews: '',
    contentCategory: '',
    promotionPlan: '',
    exclusiveProducts: false,
    socialMediaLinks: {
      youtube: '',
      instagram: '',
      twitter: '',
      facebook: ''
    }
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('social.')) {
      const platform = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialMediaLinks: {
          ...prev.socialMediaLinks,
          [platform]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await affiliateAPI.applyAffiliate(formData);
      
      if (response.success) {
        toast.success('Affiliate application submitted successfully!');
        navigate('/seller/dashboard');
      } else {
        toast.error(response.error || 'Failed to submit application');
      }
    } catch (error) {
      toast.error('Failed to submit affiliate application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Affiliate Program Application</h1>
          <p className="text-gray-600 mt-2">
            Join our exclusive affiliate program and promote your products with special benefits
          </p>
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-saffron-50 to-orange-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Affiliate Program Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <VideoCameraIcon className="h-6 w-6 text-saffron-600 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Exclusive Content</h3>
                <p className="text-sm text-gray-600">List products exclusively on VCX MART</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <UserGroupIcon className="h-6 w-6 text-saffron-600 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Audience Growth</h3>
                <p className="text-sm text-gray-600">Reach new customers through our platform</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <ChartBarIcon className="h-6 w-6 text-saffron-600 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Analytics</h3>
                <p className="text-sm text-gray-600">Detailed performance tracking</p>
              </div>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Channel Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Channel Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Channel/Brand Name *
                  </label>
                  <input
                    type="text"
                    name="channelName"
                    value={formData.channelName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                    placeholder="Your YouTube channel or brand name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Channel URL *
                  </label>
                  <input
                    type="url"
                    name="channelUrl"
                    value={formData.channelUrl}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                    placeholder="https://youtube.com/channel/..."
                  />
                </div>
              </div>
            </div>

            {/* Audience Metrics */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Audience Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subscriber Count *
                  </label>
                  <select
                    name="subscriberCount"
                    value={formData.subscriberCount}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                  >
                    <option value="">Select range</option>
                    <option value="1k-10k">1K - 10K</option>
                    <option value="10k-50k">10K - 50K</option>
                    <option value="50k-100k">50K - 100K</option>
                    <option value="100k-500k">100K - 500K</option>
                    <option value="500k-1m">500K - 1M</option>
                    <option value="1m+">1M+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Average Views per Video *
                  </label>
                  <select
                    name="averageViews"
                    value={formData.averageViews}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                  >
                    <option value="">Select range</option>
                    <option value="1k-5k">1K - 5K</option>
                    <option value="5k-25k">5K - 25K</option>
                    <option value="25k-100k">25K - 100K</option>
                    <option value="100k-500k">100K - 500K</option>
                    <option value="500k+">500K+</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Content Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Category *
              </label>
              <select
                name="contentCategory"
                value={formData.contentCategory}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
              >
                <option value="">Select category</option>
                <option value="tech">Technology & Gadgets</option>
                <option value="lifestyle">Lifestyle & Fashion</option>
                <option value="beauty">Beauty & Cosmetics</option>
                <option value="fitness">Health & Fitness</option>
                <option value="home">Home & Garden</option>
                <option value="food">Food & Cooking</option>
                <option value="gaming">Gaming</option>
                <option value="education">Education</option>
                <option value="entertainment">Entertainment</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Social Media Links */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media Presence</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    YouTube Channel
                  </label>
                  <input
                    type="url"
                    name="social.youtube"
                    value={formData.socialMediaLinks.youtube}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                    placeholder="https://youtube.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram
                  </label>
                  <input
                    type="url"
                    name="social.instagram"
                    value={formData.socialMediaLinks.instagram}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter
                  </label>
                  <input
                    type="url"
                    name="social.twitter"
                    value={formData.socialMediaLinks.twitter}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facebook
                  </label>
                  <input
                    type="url"
                    name="social.facebook"
                    value={formData.socialMediaLinks.facebook}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                    placeholder="https://facebook.com/..."
                  />
                </div>
              </div>
            </div>

            {/* Promotion Plan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How do you plan to promote VCX MART products? *
              </label>
              <textarea
                name="promotionPlan"
                value={formData.promotionPlan}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-saffron-500 focus:border-saffron-500"
                placeholder="Describe your content strategy, video types, promotion methods, etc."
              />
            </div>

            {/* Exclusive Products Agreement */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                name="exclusiveProducts"
                checked={formData.exclusiveProducts}
                onChange={handleInputChange}
                className="mt-1 h-4 w-4 text-saffron-600 focus:ring-saffron-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">
                I agree to list my products exclusively on VCX MART and promote the platform in my content. 
                This helps build our community and provides better visibility for all sellers.
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-saffron-500 to-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-saffron-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? 'Submitting Application...' : 'Submit Affiliate Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AffiliateApplication;