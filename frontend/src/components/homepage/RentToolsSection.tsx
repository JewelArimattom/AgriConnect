import { Link } from "react-router-dom";
import {
  HiCheckCircle,
  HiClock,
  HiCurrencyRupee,
  HiLightningBolt,
} from "react-icons/hi";
import { GiFarmTractor, GiPlantSeed, GiWateringCan } from "react-icons/gi";
import { FaTools } from "react-icons/fa";

const RentToolsSection = () => {
  const tools = [
    {
      icon: <GiFarmTractor className="w-12 h-12" />,
      name: "Tractors",
      price: "₹1,500/day",
      color: "from-red-500 to-orange-500",
    },
    {
      icon: <GiPlantSeed className="w-12 h-12" />,
      name: "Seeders",
      price: "₹500/day",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <GiWateringCan className="w-12 h-12" />,
      name: "Irrigation",
      price: "₹800/day",
      color: "from-blue-500 to-cyan-500",
    },
  ];

  const features = [
    {
      icon: <HiCurrencyRupee className="w-6 h-6" />,
      title: "Cost-Effective",
      description:
        "Pay only for what you use. No heavy upfront investment required.",
    },
    {
      icon: <HiLightningBolt className="w-6 h-6" />,
      title: "Latest Technology",
      description:
        "Access modern, well-maintained equipment with latest features.",
    },
    {
      icon: <HiClock className="w-6 h-6" />,
      title: "Flexible Duration",
      description:
        "Rent daily, weekly, or monthly based on your farming needs.",
    },
    {
      icon: <HiCheckCircle className="w-6 h-6" />,
      title: "Quality Assured",
      description: "All equipment is regularly maintained and safety-checked.",
    },
  ];

  return (
    <div className="relative bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 py-20 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Text Content & Features */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-2 shadow-md border border-gray-200 mb-6">
              <FaTools className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-gray-700">
                Equipment Rental Service
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Power Your Farm with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                Modern Tools
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Access high-quality farming equipment without the heavy
              investment. Rent what you need, when you need it, and boost your
              farm productivity.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-2 rounded-lg text-green-600 flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Link
              to="/rent-tools"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg py-4 px-8 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <FaTools className="w-5 h-5" />
              <span>Browse All Equipment</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>

          {/* Right Column: Visual Content */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                className="w-full h-96 object-cover"
                src="https://media.istockphoto.com/id/505022500/photo/green-tractor.jpg?s=612x612&w=0&k=20&c=81hNsPmJ8UhKMqyd2Gx1DHB4vIJISCBvidWwNWP2Gtw="
                alt="Modern green tractor in a field"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>

            {/* Floating Tool Cards */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {tools.map((tool, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div
                    className={`bg-gradient-to-br ${tool.color} text-white p-3 rounded-lg mb-3 flex items-center justify-center`}
                  >
                    {tool.icon}
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">
                    {tool.name}
                  </h4>
                  <p className="text-xs text-green-600 font-semibold">
                    {tool.price}
                  </p>
                </div>
              ))}
            </div>

            {/* Stats Badge */}
            <div className="absolute -top-6 -right-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-2xl p-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="text-center">
                <p className="text-4xl font-bold mb-1">500+</p>
                <p className="text-sm font-semibold">Tools Available</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
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
      `}</style>
    </div>
  );
};

export default RentToolsSection;
