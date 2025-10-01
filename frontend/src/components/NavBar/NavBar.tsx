import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid'; 
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side: Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-green-600">
              FarmConnect
            </Link>
          </div>

          {/* Middle: Desktop Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="text-gray-600 hover:bg-green-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
              <Link to="/products" className="text-gray-600 hover:bg-green-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Products</Link>
              <Link to="/about" className="text-gray-600 hover:bg-green-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium">About Us</Link>
              <Link to="/contact" className="text-gray-600 hover:bg-green-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Contact</Link>
            </div>
          </div>

          {/* Right Side: Hamburger Menu Button for Mobile */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-green-600 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-600 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu, show/hide based on menu state. */}
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="text-gray-600 hover:bg-green-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</Link>
            <Link to="/products" className="text-gray-600 hover:bg-green-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Products</Link>
            <Link to="/about" className="text-gray-600 hover:bg-green-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium">About Us</Link>
            <Link to="/contact" className="text-gray-600 hover:bg-green-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Contact</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;