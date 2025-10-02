import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, ShoppingCartIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthenticationContext';
import { time } from 'three/tsl';

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };



  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-green-600">FarmConnect</Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/about" className="text-gray-600 hover:text-green-600">About Us</Link>
            <Link to="/contact" className="text-gray-600 hover:text-green-600">Contact</Link>
            <Link to="/upload-product" className="font-semibold text-green-600 hover:text-green-800">Sell Your Product</Link>
            
            <Link to="/cart" className="relative text-gray-600 hover:text-green-600">
              <ShoppingCartIcon className="h-6 w-6" />
              {cartItems.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartItems.length}</span>}
            </Link>

            {/* Conditional Profile/Login Link */}
            {user ? (
              <div 
                className="relative" 
                onMouseEnter={() => setProfileOpen(true)} 
                //onMouseLeave={() => setProfileOpen(false)}
                 
              >
                <button className="flex items-center text-gray-600 hover:text-green-600 focus:outline-none">
                  <UserCircleIcon className="h-8 w-8" />
                </button>
                
                {/* 2. Added transitions for a smoother appearance */}
                <div 
                  className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 transition-all duration-200 ease-out ${isProfileOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
                >
                  <Link to="farmers-area" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Farmars Area</Link>
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Orders</Link>
                  <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Products</Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="font-semibold text-gray-600 hover:text-green-600">Login</Link>
            )}
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} type="button" className="p-2 rounded-md text-gray-600">
              {isMobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {user ? (
             <>
              <Link to="farmers-area" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Farmars Area</Link>
              <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">My Orders</Link>
              <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">My Products</Link>
              <div className="border-t border-gray-200 my-2"></div>
              <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Logout</button>
             </>
          ) : (
            <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

