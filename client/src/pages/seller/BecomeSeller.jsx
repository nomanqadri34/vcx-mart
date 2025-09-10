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

  const benefits = [
    {
      icon: CurrencyRupeeIcon,
      title: "Earn Money",
      description:
        "Start earning by selling your products to millions of customers",
      color: "text-green-500",
    },
    {
      icon: ShoppingBagIcon,
      title: "Easy Management",
      description:
        "Manage your inventory, orders, and customers from one dashboard",
      color: "text-blue-500",
    },
    {
      icon: ChartBarIcon,
      title: "Analytics & Insights",
      description: "Get detailed analytics to grow your business effectively",
      color: "text-purple-500",
    },
    {
      icon: UserGroupIcon,
      title: "Large Customer Base",
      description: "Reach thousands of potential customers across the platform",
      color: "text-saffron-500",
    },
  ];

  const features = [
    "Free registration and listing",
    "Secure payment processing",
    "24/7 customer support",
    "Marketing tools and promotions",
    "Mobile-friendly seller app",
    "Real-time order notifications",
  ];

  const steps = [
    {
      step: 1,
      title: "Apply to Sell",
      description:
        "Fill out the seller application form with your business details",
    },
    {
      step: 2,
      title: "Verification",
      description:
        "Our team will review and verify your application within 24-48 hours",
    },
    {
      step: 3,
      title: "Start Selling",
      description:
        "Once approved, start listing products and managing your store",
    },
  ];

  const handleStartSelling = () => {
    if (!user) {
      navigate("/login", { state: { from: "/seller/apply" } });
      return;
    }
    navigate("/seller/apply");
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

      {/* Features Section */}
      <div className="py-16 bg-gradient-to-br from-saffron-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Everything You Need to Succeed
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We provide all the tools and support you need to build a
                successful online business.
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
                  <StarIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Join 10,000+ Sellers
                </h3>
                <p className="text-gray-600 mb-6">
                  Be part of our growing community of successful sellers
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-saffron-500">
                      ₹50L+
                    </div>
                    <div className="text-sm text-gray-600">Monthly Sales</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-500">
                      4.8★
                    </div>
                    <div className="text-sm text-gray-600">Avg Rating</div>
                  </div>
                </div>
              </div>
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
            Ready to Start Your Business?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join our platform today and start selling to millions of customers
          </p>
          <button
            onClick={handleStartSelling}
            className="inline-flex items-center px-8 py-4 bg-white text-saffron-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-lg"
          >
            Apply to Become a Seller
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BecomeSeller;
