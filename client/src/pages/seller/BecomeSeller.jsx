import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  ShoppingBagIcon,
  CurrencyRupeeIcon,
  ChartBarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

const BecomeSeller = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already a seller or has pending application
  useEffect(() => {
    if (user?.role === "seller") {
      navigate("/seller/dashboard");
    }
  }, [user, navigate]);

  const [isStoreOpen] = useState(false); // Will be true when store opens for buyers
  const [showAffiliateForm, setShowAffiliateForm] = useState(false);

  const benefits = [
    {
      icon: CurrencyRupeeIcon,
      title: "No Commission Fees",
      description: "Keep 100% of your profits - we only charge a low monthly store fee",
      color: "text-green-500",
    },
    {
      icon: ShoppingBagIcon,
      title: "Direct Payments",
      description: "Buyers pay directly to your account - no middleman delays",
      color: "text-blue-500",
    },
    {
      icon: ChartBarIcon,
      title: "Profit Guarantee",
      description: "If you don't make ₹5,000 profit in first month, get second month free",
      color: "text-purple-500",
    },
    {
      icon: UserGroupIcon,
      title: "Early Bird Pricing",
      description: "Register now for lifetime ₹500/month - price increases to ₹800 later",
      color: "text-saffron-500",
    },
  ];

  const features = [
    "No commission on sales - keep 100% profit",
    "Direct UPI & bank transfer payments",
    "₹500/month store fee (vs ₹2000 on Shopify)",
    "Lifetime early bird pricing for pre-launch sellers",
    "Second month free if profit < ₹5,000",
    "24/7 customer support",
  ];

  const pricingPlans = [
    {
      title: "Early Bird Special",
      subtitle: "Register before store opens",
      price: "₹500",
      period: "/month lifetime",
      registrationFee: "₹550",
      features: [
        "Lifetime ₹500/month pricing",
        "No commission on sales",
        "Direct payment to your account",
        "Second month free guarantee",
        "Priority support",
        "Early access to new features"
      ],
      popular: true,
      available: !isStoreOpen
    },
    {
      title: "Regular Plan",
      subtitle: "After store opens",
      price: "₹800",
      period: "/month",
      registrationFee: "₹850",
      features: [
        "₹800/month pricing",
        "No commission on sales",
        "Direct payment to your account",
        "Standard support",
        "All platform features"
      ],
      popular: false,
      available: isStoreOpen
    }
  ];

  const steps = [
    {
      step: 1,
      title: "Pay Registration Fee",
      description: "Pay ₹550 (₹500 for platform + ₹50 affiliate commission)",
    },
    {
      step: 2,
      title: "Complete Application",
      description: "Fill application with business & payment details (UPI/Bank)",
    },
    {
      step: 3,
      title: "Start Selling",
      description: "Get approved and start receiving direct payments from buyers",
    },
  ];

  const handleStartSelling = () => {
    if (!user) {
      navigate("/login", { state: { from: "/seller/apply-new" } });
      return;
    }
    navigate("/seller/apply-new");
  };

  const handleAffiliateApply = () => {
    setShowAffiliateForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-50 to-green-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Start Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-500 to-green-500">
                {" "}
                Selling Journey
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join thousands of successful sellers on our platform. Turn your
              passion into profit and reach customers across the country.
            </p>
            <button
              onClick={handleStartSelling}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-saffron-500 to-green-500 text-white font-semibold rounded-lg hover:from-saffron-600 hover:to-green-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Selling Today
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Sell With Us?
            </h2>
            <p className="text-lg text-gray-600">
              Discover the benefits of joining our seller community
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow"
              >
                <div
                  className={`inline-flex p-3 rounded-full bg-gray-100 mb-4`}
                >
                  <benefit.icon className={`h-8 w-8 ${benefit.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600">
              No hidden fees, no commissions - just a low monthly store fee
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`relative rounded-lg border-2 p-8 ${
                plan.popular ? 'border-saffron-500 bg-saffron-50' : 'border-gray-200 bg-white'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-saffron-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Limited Time
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.title}</h3>
                  <p className="text-gray-600 mb-4">{plan.subtitle}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                    <div className="text-sm text-gray-500 mt-2">
                      Registration: {plan.registrationFee}
                    </div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.available && (
                    <button
                      onClick={handleStartSelling}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                        plan.popular
                          ? 'bg-saffron-500 text-white hover:bg-saffron-600'
                          : 'bg-gray-900 text-white hover:bg-gray-800'
                      }`}
                    >
                      Get Started
                    </button>
                  )}
                  {!plan.available && (
                    <div className="text-gray-500 font-medium">Coming Soon</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gradient-to-br from-saffron-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose Our Platform?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Unlike other platforms, we don't take commissions. You keep 100% of your profits.
              </p>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-saffron-500 to-green-500 rounded-full mb-4">
                  <CurrencyRupeeIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Profit Guarantee
                </h3>
                <p className="text-gray-600 mb-6">
                  If you don't make ₹5,000 profit in your first month, get your second month completely free!
                </p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">₹500/month</div>
                  <div className="text-sm text-gray-600">vs ₹2,000 on Shopify</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Affiliate Program Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Become an Affiliate Partner
            </h2>
            <p className="text-lg text-gray-600">
              Earn ₹50 for every seller you refer. Perfect for YouTubers and influencers.
            </p>
          </div>
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-lg border border-purple-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Affiliate Program</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <div className="text-3xl font-bold text-purple-600">₹50</div>
                  <div className="text-sm text-gray-600">Per Referral</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">∞</div>
                  <div className="text-sm text-gray-600">No Limit</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">24h</div>
                  <div className="text-sm text-gray-600">Quick Payout</div>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Perfect for YouTubers, bloggers, and social media influencers. Share your unique link and earn for every successful seller registration.
              </p>
              <button
                onClick={handleAffiliateApply}
                className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Apply for Affiliate Program
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Get started in just 3 simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-saffron-500 to-green-500 text-white rounded-full text-xl font-bold mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-full w-full">
                    <ArrowRightIcon className="h-6 w-6 text-gray-300 mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-saffron-500 to-green-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Limited Time: Early Bird Pricing!
          </h2>
          <p className="text-xl text-white/90 mb-2">
            Register now for lifetime ₹500/month pricing
          </p>
          <p className="text-lg text-white/80 mb-8">
            Price increases to ₹800/month after store opens for buyers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleStartSelling}
              className="inline-flex items-center px-8 py-4 bg-white text-saffron-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-lg"
            >
              Start Selling - ₹550
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </button>
            <button
              onClick={handleAffiliateApply}
              className="inline-flex items-center px-8 py-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors duration-200 shadow-lg"
            >
              Become Affiliate
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Affiliate Application Modal */}
      {showAffiliateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Apply for Affiliate Program</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Platform (YouTube, Instagram, etc.)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., YouTube Channel"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Channel/Profile URL
                </label>
                <input
                  type="url"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  placeholder="https://youtube.com/channel/..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAffiliateForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BecomeSeller;
