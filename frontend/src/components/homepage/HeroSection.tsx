import { Link } from "react-router-dom";
import {
  HiSparkles,
  HiTrendingUp,
  HiUsers,
  HiArrowRight,
  HiCheckCircle,
} from "react-icons/hi";
import { FaBrain, FaShoppingCart, FaLeaf } from "react-icons/fa";

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 min-h-screen overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-4 w-64 h-64 md:w-72 md:h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-4 w-64 h-64 md:w-72 md:h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-4 w-64 h-64 md:w-72 md:h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 lg:pt-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-md border border-green-100">
              <HiSparkles className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-gray-700">
                Complete Tech Solutions for Farmers
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Empowering
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mt-2">
                Modern Farmers
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              AI-powered crop recommendations, disease detection, market
              insights, and direct marketplace access — all in one platform.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm border border-green-100">
                <HiCheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">
                  AI Crop Advisor
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm border border-green-100">
                <HiCheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">
                  Disease Detection
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm border border-green-100">
                <HiCheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">
                  Direct Sales
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/farmers-area"
                className="group inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold px-8 py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FaBrain className="w-5 h-5" />
                <span>Explore Farmer Tools</span>
                <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/products"
                className="group inline-flex items-center justify-center space-x-2 bg-white text-gray-700 font-semibold px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg border-2 border-green-200 hover:border-green-300 transform hover:scale-105"
              >
                <FaShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Shop Products</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-green-100">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-gray-900">1000+</div>
                <div className="text-sm text-gray-600 mt-1">Active Farmers</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600 mt-1">Products</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-gray-900">95%</div>
                <div className="text-sm text-gray-600 mt-1">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Card 1 - AI Tools */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-green-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <FaBrain className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                AI-Powered Tools
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Get crop recommendations, disease detection, and planting guides
                powered by advanced AI technology.
              </p>
            </div>

            {/* Card 2 - Market Insights */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-green-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-orange-100 to-amber-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <HiTrendingUp className="w-7 h-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Market Insights
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Real-time market prices, demand trends, and analytics to help
                you make informed decisions.
              </p>
            </div>

            {/* Card 3 - Direct Sales */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-green-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <HiUsers className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No Middleman
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Connect directly with consumers and sell your products without
                intermediaries for better profits.
              </p>
            </div>

            {/* Card 4 - Fresh Products */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-green-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <FaLeaf className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Fresh & Organic
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Shop fresh produce, dairy, and organic products directly from
                local farms near you.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for blob animation */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }
        .animate-blob {
          animation: blob 20s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
