import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingCartIcon,
  UserCircleIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthenticationContext";

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-2 rounded-xl shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <SparklesIcon className="h-7 w-7 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                AgriConnect
              </span>
              <span className="text-xs text-gray-500 font-medium -mt-1">
                Farm Tech Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              to="/about"
              className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 relative group"
            >
              About Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 relative group"
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              to="/upload-product"
              className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 relative group"
            >
              Sell Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 focus:outline-none group"
                >
                  <UserCircleIcon className="h-7 w-7" />
                  <span className="font-medium text-sm hidden xl:block">
                    Account
                  </span>
                </button>

                <div
                  className={`absolute right-0 w-56 bg-white rounded-xl shadow-2xl py-2 z-20 transition-all duration-200 ease-out mt-2 border border-gray-100 ${
                    isProfileOpen
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-2 pointer-events-none"
                  }`}
                  onMouseEnter={() => setProfileOpen(true)}
                  onMouseLeave={() => setProfileOpen(false)}
                >
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      {user.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    to="/farmers-area"
                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                  >
                    <SparklesIcon className="h-4 w-4 mr-3" />
                    Farmers Area
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                  >
                    <ShoppingCartIcon className="h-4 w-4 mr-3" />
                    My Orders
                  </Link>
                  <Link
                    to="/dashboard"
                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                  >
                    <UserCircleIcon className="h-4 w-4 mr-3" />
                    My Products
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-3 lg:hidden">
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="p-2 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-600 transition-all duration-200"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {user && (
              <div className="px-3 py-3 mb-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                <p className="text-sm font-semibold text-gray-900">
                  {user.name || "User"}
                </p>
                <p className="text-xs text-gray-600 truncate">{user.email}</p>
              </div>
            )}

            <Link
              to="/about"
              className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
            >
              Contact
            </Link>
            <Link
              to="/upload-product"
              className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
            >
              Sell Products
            </Link>

            {user ? (
              <>
                <div className="border-t border-gray-200 my-3"></div>
                <Link
                  to="/farmers-area"
                  className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                >
                  🌾 Farmers Area
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                >
                  📦 My Orders
                </Link>
                <Link
                  to="/dashboard"
                  className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                >
                  🏪 My Products
                </Link>
                <div className="border-t border-gray-200 my-3"></div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block mt-4 px-3 py-3 rounded-lg text-center text-base font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all shadow-md"
              >
                Login / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
