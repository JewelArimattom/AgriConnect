import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { API_BASE_URL } from "../utils/api";
import {
  HiCheckCircle,
  HiLocationMarker,
  HiPhone,
  HiMail,
  HiClock,
  HiUser,
} from "react-icons/hi";
import { FaLeaf, FaTractor, FaWhatsapp } from "react-icons/fa";

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    preferredPickupTime: "",
    paymentMethod: "online",
    specialInstructions: "",
  });

  const subtotal = cartItems.reduce((total, item: any) => {
    const price = parseFloat(item.price.replace("₹", ""));
    return total + (isNaN(price) ? 0 : price);
  }, 0);

  // No shipping for direct pickup
  const total = subtotal;

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      setIsLoading(false);
      return;
    }

    const farmerName = (cartItems[0] as any)?.farmer;

    try {
      // Validate that we have items in cart
      if (cartItems.length === 0) {
        throw new Error("Your cart is empty");
      }

      // Validate all required fields
      if (!formData.name || !formData.phone || !formData.email) {
        throw new Error("Please fill in all required fields");
      }

      // Validate phone number format
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.phone.replace(/[^0-9]/g, ""))) {
        throw new Error("Please enter a valid 10-digit phone number");
      }

      // Clean and validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        throw new Error("Please enter a valid email address");
      }

      // Format order data
      const orderData = {
        customerDetails: {
          name: formData.name.trim(),
          phone: formData.phone.replace(/[^0-9]/g, ""),
          email: formData.email.trim(),
          preferredPickupTime: formData.preferredPickupTime || "",
          paymentMethod: formData.paymentMethod,
          specialInstructions: formData.specialInstructions?.trim() || "",
        },
        products: cartItems.map((item: any) => ({
          productId: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
        })),
        totalAmount: Number(total),
        farmer: farmerName,
        status: "Confirmed",
      };

      console.log("Sending order data:", orderData); // Debug log

      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to place order.");
      }

      clearCart();
      navigate("/order-success");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 bg-white rounded-full px-6 py-3 shadow-lg mb-4">
            <HiCheckCircle className="w-6 h-6 text-green-600" />
            <span className="font-semibold text-gray-700">
              Booking Confirmation
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Confirm Your Booking
          </h1>
          <p className="text-lg text-gray-600">
            Complete your details to book fresh produce from local farmers
          </p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <p className="text-center text-red-600 font-semibold">{error}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Column - Customer Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <HiUser className="w-6 h-6 mr-3 text-green-600" />
                Your Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <HiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 XXXXX-XXXXX"
                        required
                        className="w-full pl-12 pr-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <HiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        required
                        className="w-full pl-12 pr-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pickup Details */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <HiLocationMarker className="w-6 h-6 mr-3 text-green-600" />
                Pickup Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Pickup Time
                  </label>
                  <div className="relative">
                    <HiClock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="datetime-local"
                      name="preferredPickupTime"
                      value={formData.preferredPickupTime}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Farmer will confirm availability and provide exact location
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Any special requests or instructions for the farmer..."
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Payment Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-green-50 hover:border-green-300 transition-all duration-200">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={formData.paymentMethod === "online"}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-4 font-semibold text-gray-900">
                    Pay Online Now
                  </span>
                </label>
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-green-50 hover:border-green-300 transition-all duration-200">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="pickup"
                    checked={formData.paymentMethod === "pickup"}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-4 font-semibold text-gray-900">
                    Pay at Pickup
                  </span>
                </label>
              </div>
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-700 leading-relaxed">
                  💡 Payment method depends on farmer's preference. You'll be
                  notified after confirmation.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-green-100 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Booking Summary
              </h2>

              {/* Products List */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item: any) => (
                  <div
                    key={item._id || item.id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name || "Product"}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {item.name || "Product"}
                      </p>
                      <p className="text-xs text-gray-500">
                        from {item.farmer}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-green-600 whitespace-nowrap">
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pickup Info */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 mb-6 border-2 border-green-200">
                <div className="flex items-start space-x-3 mb-3">
                  <FaTractor className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      Direct from Farmer
                    </p>
                    <p className="text-xs text-gray-600">
                      You'll receive pickup location and farmer contact after
                      confirmation
                    </p>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Pickup Fee</span>
                  <span>FREE</span>
                </div>
                <div className="border-t-2 border-gray-200 pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total Amount</span>
                    <span className="text-green-600">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <HiCheckCircle className="w-6 h-6" />
                    <span>Confirm Booking</span>
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-3">
                    <FaLeaf className="w-4 h-4 text-green-600" />
                    <span>100% Fresh Guarantee</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaWhatsapp className="w-4 h-4 text-green-600" />
                    <span>Direct Farmer Contact</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <HiCheckCircle className="w-4 h-4 text-green-600" />
                    <span>Secure Booking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
