import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  HiShoppingCart,
  HiTrash,
  HiArrowRight,
  HiMinus,
  HiPlus,
  HiShieldCheck,
  HiLocationMarker,
  HiClock,
} from "react-icons/hi";
import { FaLeaf, FaTractor, FaHandshake } from "react-icons/fa";
import { useState } from "react";

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>(
    cartItems.reduce((acc, item) => ({ ...acc, [item.id]: 1 }), {})
  );

  const updateQuantity = (id: string | number, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + change),
    }));
  };

  const subtotal = cartItems.reduce((total, item) => {
    const price = parseFloat(item.price.replace("₹", ""));
    const quantity = quantities[item.id] || 1;
    return total + price * quantity;
  }, 0);

  // No shipping - direct pickup from farmer
  const total = subtotal;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <HiShoppingCart className="w-20 h-20 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Looks like you haven't added any fresh produce yet. Explore our
            marketplace to find farm-fresh products!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <span>Browse Products</span>
            <HiArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-green-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 bg-white rounded-full px-6 py-3 shadow-lg mb-4">
            <HiShoppingCart className="w-6 h-6 text-green-600" />
            <span className="font-semibold text-gray-700">
              {cartItems.length} Items
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Your Booking Cart
          </h1>
          <p className="text-lg text-gray-600">
            Review your items and book for pickup from local farmers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:border-green-200 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full sm:w-32 h-32 rounded-xl object-cover shadow-md"
                  />

                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">
                          {item.name}
                        </h2>
                        <p className="text-gray-500 text-sm">
                          {item.category || "Fresh Produce"}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Remove item"
                      >
                        <HiTrash className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-semibold text-gray-600">
                          Quantity:
                        </span>
                        <div className="flex items-center bg-gray-100 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-2 hover:bg-gray-200 rounded-l-lg transition-colors"
                          >
                            <HiMinus className="w-4 h-4 text-gray-600" />
                          </button>
                          <span className="px-4 py-2 font-semibold text-gray-900">
                            {quantities[item.id] || 1}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-2 hover:bg-gray-200 rounded-r-lg transition-colors"
                          >
                            <HiPlus className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Price per unit</p>
                        <p className="text-2xl font-bold text-green-600">
                          {item.price}
                        </p>
                        <p className="text-sm font-semibold text-gray-700 mt-1">
                          Total: ₹
                          {(
                            parseFloat(item.price.replace("₹", "")) *
                            (quantities[item.id] || 1)
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <button
              onClick={clearCart}
              className="w-full py-4 border-2 border-red-200 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <HiTrash className="w-5 h-5" />
              <span>Clear Entire Cart</span>
            </button>
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-green-100 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Booking Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Total Amount</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>

                {/* Pickup Info Banner */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3 mb-3">
                    <HiLocationMarker className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        Direct Pickup
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        You'll receive farmer contact details and pickup
                        location after booking
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <HiClock className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        Pickup Time
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Coordinate with farmer for convenient pickup schedule
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Amount to Pay</span>
                    <span className="text-green-600">₹{total.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Pay online or at pickup (as per farmer's preference)
                  </p>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <HiShieldCheck className="w-5 h-5 text-green-600" />
                  <span>Secure Booking</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <FaLeaf className="w-5 h-5 text-green-600" />
                  <span>100% Farm Fresh</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <FaTractor className="w-5 h-5 text-green-600" />
                  <span>Direct from Farmer</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <FaHandshake className="w-5 h-5 text-green-600" />
                  <span>Fair Prices</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <span>Confirm Booking</span>
                <HiArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/products"
                className="w-full mt-4 flex items-center justify-center py-3 px-6 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                Continue Browsing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
