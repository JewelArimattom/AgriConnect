import { Link } from "react-router-dom";
import {
  FaLeaf,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { HiMail } from "react-icons/hi";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-2 rounded-xl">
                <FaLeaf className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold">
                <span className="text-white">Agri</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                  Connect
                </span>
              </h2>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed mb-6 max-w-md">
              Empowering farmers and connecting communities through technology.
              Fresh produce, fair prices, and sustainable agriculture.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400 hover:text-green-400 transition-colors">
                <FaEnvelope className="w-4 h-4" />
                <span>support@agriconnect.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 hover:text-green-400 transition-colors">
                <FaPhone className="w-4 h-4" />
                <span>+91 123-456-7890</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 hover:text-green-400 transition-colors">
                <FaMapMarkerAlt className="w-4 h-4" />
                <span>Pala, Kottayam, Kerala, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-green-400 transition-colors flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-green-400 transition-colors flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-gray-400 hover:text-green-400 transition-colors flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/farmers-area"
                  className="text-gray-400 hover:text-green-400 transition-colors flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Farmers Area
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-green-400 transition-colors flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* For Farmers */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">For Farmers</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/upload-product"
                  className="text-gray-400 hover:text-green-400 transition-colors flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Sell Products
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-gray-400 hover:text-green-400 transition-colors flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/rent-tools"
                  className="text-gray-400 hover:text-green-400 transition-colors flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Rent Tools
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition-colors flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Resources
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-green-400 transition-colors flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm border border-green-500/20 rounded-2xl p-8 mb-12">
          <div className="max-w-3xl mx-auto text-center">
            <HiMail className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
            <p className="text-gray-400 mb-6">
              Subscribe to our newsletter for the latest updates on fresh
              products and farming tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-white placeholder-gray-500"
              />
              <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold px-8 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-500">
              <p>
                &copy; {new Date().getFullYear()} AgriConnect. All Rights
                Reserved.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="hover:text-green-400 transition-colors">
                  Privacy Policy
                </a>
                <span className="text-gray-700">•</span>
                <a href="#" className="hover:text-green-400 transition-colors">
                  Terms of Service
                </a>
                <span className="text-gray-700">•</span>
                <a href="#" className="hover:text-green-400 transition-colors">
                  Cookies
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-gray-800 hover:bg-green-600 p-3 rounded-xl transition-all duration-300 transform hover:scale-110 hover:rotate-6"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-green-600 p-3 rounded-xl transition-all duration-300 transform hover:scale-110 hover:rotate-6"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-green-600 p-3 rounded-xl transition-all duration-300 transform hover:scale-110 hover:rotate-6"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-gray-800 hover:bg-green-600 p-3 rounded-xl transition-all duration-300 transform hover:scale-110 hover:rotate-6"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
