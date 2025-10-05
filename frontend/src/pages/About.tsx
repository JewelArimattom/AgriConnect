import { Link } from "react-router-dom";
import { HiCheckCircle, HiUsers, HiHeart } from "react-icons/hi";
import { FaLeaf, FaTractor, FaHandshake, FaSeedling } from "react-icons/fa";
import { GiFarmer } from "react-icons/gi";

const About = () => {
  const values = [
    {
      icon: <HiCheckCircle className="w-10 h-10" />,
      title: "Premium Quality",
      description:
        "We partner with farmers who share our passion for quality. Every product is grown and harvested with exceptional care to ensure peak freshness and superior taste.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <HiUsers className="w-10 h-10" />,
      title: "Strong Community",
      description:
        "Building stronger, healthier communities by connecting you directly with local farmers. Together, we create a more self-reliant and sustainable food ecosystem.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <FaLeaf className="w-10 h-10" />,
      title: "Sustainability First",
      description:
        "Supporting local agriculture reduces carbon footprint and promotes sustainable farming practices. We're committed to a healthier planet for future generations.",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  const features = [
    {
      icon: <FaTractor className="w-8 h-8" />,
      title: "Direct from Farms",
      count: "500+",
    },
    {
      icon: <GiFarmer className="w-8 h-8" />,
      title: "Trusted Farmers",
      count: "200+",
    },
    {
      icon: <FaSeedling className="w-8 h-8" />,
      title: "Organic Products",
      count: "80%",
    },
    {
      icon: <HiHeart className="w-8 h-8" />,
      title: "Happy Customers",
      count: "10K+",
    },
  ];

  const team = [
    {
      name: "Sustainable Farming",
      role: "Our Commitment",
      description:
        "Promoting eco-friendly practices that protect our environment",
      image:
        "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400",
    },
    {
      name: "Fair Trade",
      role: "Farmer First",
      description:
        "Ensuring farmers receive fair compensation for their hard work",
      image:
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400",
    },
    {
      name: "Fresh Delivery",
      role: "Quality Assured",
      description: "From farm to your table within 24 hours of harvest",
      image:
        "https://images.unsplash.com/photo-1595855759920-86582396756a?w=400",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 overflow-hidden">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-20"
            src="https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80"
            alt="Fresh vegetables on a farm"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/90 to-emerald-600/90"></div>
        </div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>

        <div className="relative max-w-7xl mx-auto py-32 px-4 sm:py-40 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-8">
            <FaLeaf className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">Est. 2024</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            About <span className="text-yellow-300">AgriConnect</span>
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-green-50 max-w-4xl mx-auto leading-relaxed">
            Bridging the gap between farmers and consumers with technology,
            transparency, and trust.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center min-w-[140px]">
              <p className="text-4xl font-bold text-white mb-2">500+</p>
              <p className="text-green-100 font-medium">Active Farmers</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center min-w-[140px]">
              <p className="text-4xl font-bold text-white mb-2">10K+</p>
              <p className="text-green-100 font-medium">Happy Customers</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center min-w-[140px]">
              <p className="text-4xl font-bold text-white mb-2">95%</p>
              <p className="text-green-100 font-medium">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Banner */}
      <div className="bg-gradient-to-br from-gray-50 to-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  {feature.icon}
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {feature.count}
                </p>
                <p className="text-sm font-medium text-gray-600">
                  {feature.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Mission Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center space-x-2 bg-green-100 rounded-full px-4 py-2 mb-6">
                <FaHandshake className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-green-700">
                  Our Mission
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Freshness Meets{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  Fairness
                </span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                AgriConnect was born from a simple yet powerful idea: the food
                you eat should be fresh, healthy, and sourced from farmers who
                are treated fairly. We witnessed a disconnect between
                hardworking farmers and the communities they feed.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our platform bridges that gap with technology and transparency.
                We empower local farmers with direct market access while
                providing you with farm-fresh products that support sustainable
                agriculture and fair compensation.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <HiCheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 font-medium">
                    Zero Middlemen
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <HiCheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 font-medium">
                    Fair Pricing
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <HiCheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 font-medium">24hr Fresh</span>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-full h-full bg-gradient-to-br from-green-200 to-emerald-200 rounded-2xl transform rotate-3"></div>
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80"
                  alt="Farmer holding a crate of fresh apples"
                  className="relative rounded-2xl shadow-2xl w-full h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Core{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                Values
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do and define who we are.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-green-100 transform hover:-translate-y-2"
              >
                <div
                  className={`bg-gradient-to-br ${value.gradient} w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300`}
                >
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team/Commitment Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                Commitments
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              What we stand for and promise to deliver every single day.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((item, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <p className="text-sm font-semibold text-green-400 mb-2">
                    {item.role}
                  </p>
                  <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
                  <p className="text-green-100">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-5xl mx-auto py-20 px-4 sm:px-6 sm:py-28 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Join the Fresh Food{" "}
            <span className="text-yellow-300">Revolution</span>
          </h2>
          <p className="mt-4 text-xl text-green-50 max-w-3xl mx-auto leading-relaxed mb-10">
            Ready to taste the difference? Discover farm-fresh products, support
            local farmers, and become part of a sustainable food community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center space-x-2 px-8 py-4 border-2 border-white text-lg font-bold rounded-xl text-white bg-white/20 backdrop-blur-sm hover:bg-white hover:text-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <FaLeaf className="w-5 h-5" />
              <span>Browse Products</span>
            </Link>
            <Link
              to="/farmers-area"
              className="inline-flex items-center justify-center space-x-2 px-8 py-4 text-lg font-bold rounded-xl bg-white text-green-600 hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <FaTractor className="w-5 h-5" />
              <span>For Farmers</span>
            </Link>
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

export default About;
