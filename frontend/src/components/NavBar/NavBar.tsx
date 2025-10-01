import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, ShoppingCartIcon } from '@heroicons/react/24/solid';
import { useCart } from '../../context/CartContext'; 
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems } = useCart(); 

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-green-600">
              FarmConnect
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-10">
            <div className="flex items-baseline space-x-4">
              <Link to="/" className="text-gray-600 hover:bg-green-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
              <Link to="/products" className="text-gray-600 hover:bg-green-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Products</Link>
              <Link to="/about" className="text-gray-600 hover:bg-green-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium">About Us</Link>
              <Link to="/contact" className="text-gray-600 hover:bg-green-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Contact</Link>
            </div>
            <Link to="/cart" className="relative text-gray-600 hover:text-green-600">
              <ShoppingCartIcon className="h-6 w-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-green-600 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-green-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <XMarkIcon className="block h-6 w-6" /> : <Bars3Icon className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="text-gray-600 hover:bg-green-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Home</Link>
            <Link to="/products" className="text-gray-600 hover:bg-green-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Products</Link>
            <Link to="/about" className="text-gray-600 hover:bg-green-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium">About Us</Link>
            <Link to="/contact" className="text-gray-600 hover:bg-green-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Contact</Link>
            
            <Link to="/cart" className="relative flex items-center text-gray-600 hover:bg-green-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
              <ShoppingCartIcon className="h-6 w-6 mr-2" />
              My Cart
              {cartItems.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;