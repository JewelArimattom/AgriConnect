import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthenticationContext";
import {
  HiCheckCircle,
  HiShoppingBag,
  HiClock,
  HiTag,
  HiPhotograph,
} from "react-icons/hi";
import { FaLeaf, FaSeedling, FaTractor } from "react-icons/fa";

const API_URL = "http://localhost:5000/api/products";

const SellYourProduct = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    location: "",
    category: "Produce",
    buyType: "direct_buy",
    price: "",
    startingBid: "",
    auctionStartTime: "",
    auctionEndTime: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!user) {
      setError("You must be logged in to sell a product.");
      setIsLoading(false);
      return;
    }

    const payload = {
      ...formData,
      farmer: user.name,
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit product.");
      }

      alert("Product submitted successfully!");
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center space-x-3 bg-white rounded-full px-6 py-3 shadow-lg mb-4">
            <FaTractor className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-gray-700">
              Sell Your Products
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            List a New Product
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start selling your farm-fresh products directly to customers
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden">
          {error && (
            <div className="bg-red-50 border-b-2 border-red-200 px-6 py-4">
              <p className="text-red-600 font-semibold text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <FaLeaf className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Basic Information
                </h2>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Organic Apples, Fresh Tomatoes"
                  required
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Farm Location *
                </label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Thrissur, Kerala"
                  required
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your product: quality, quantity, freshness, etc."
                  required
                  rows={4}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                  <HiPhotograph className="w-4 h-4 text-green-600" />
                  <span>Image URL *</span>
                </label>
                <input
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/product-image.jpg"
                  required
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                />
                {formData.imageUrl && (
                  <div className="mt-3 rounded-xl overflow-hidden border-2 border-gray-200">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Category Selection */}
            <div className="space-y-6 pt-8 border-t-2 border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <HiTag className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Category</h2>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full p-4 border-2 border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all font-semibold"
                >
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Grains & Pulses">Grains & Pulses</option>
                  <option value="Spices & Herbs">Spices & Herbs</option>
                  <option value="Dairy & Milk Products">Dairy & Milk Products</option>
                  <option value="Animal">Animal</option>
                  <option value="Fertilizers">Fertilizers</option>
                  <option value="Seeds">Seeds</option>
                  <option value="Plants">Plants</option>
                  <option value="Bio-Fertilizers">Bio-Fertilizers</option>
                  <option value="Homemade Foods">Homemade Foods</option>
                  <option value="Farm Tools & Equipment">Farm Tools & Equipment</option>
                  <option value="Dry Fruits & Nuts">Dry Fruits & Nuts</option>
                  <option value="Honey & Bee Products">Honey & Bee Products</option>
                </select>
              </div>
            </div>

            {/* Pricing & Buy Type */}
            <div className="space-y-6 pt-8 border-t-2 border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <HiShoppingBag className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Pricing & Sales Type
                </h2>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  How do you want to sell? *
                </label>
                <select
                  name="buyType"
                  value={formData.buyType}
                  onChange={handleChange}
                  required
                  className="w-full p-4 border-2 border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all font-semibold"
                >
                  <option value="direct_buy">
                    💰 Direct Buy - Set a fixed price
                  </option>
                  <option value="enquiry">
                    📧 Send Enquiry - Customers contact you
                  </option>
                  <option value="auction">
                    🔨 Live Auction - Start a bidding war
                  </option>
                </select>
              </div>

              {formData.buyType === "direct_buy" && (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Price *
                  </label>
                  <input
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g., ₹250/kg or ₹50/unit"
                    required
                    className="w-full p-4 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-white"
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    Customers can directly book at this price
                  </p>
                </div>
              )}

              {formData.buyType === "auction" && (
                <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Starting Bid (₹) *
                    </label>
                    <input
                      name="startingBid"
                      value={formData.startingBid}
                      onChange={handleChange}
                      placeholder="100"
                      type="number"
                      required
                      className="w-full p-4 border-2 border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                        <HiClock className="w-4 h-4 text-orange-600" />
                        <span>Auction Start Time *</span>
                      </label>
                      <input
                        name="auctionStartTime"
                        value={formData.auctionStartTime}
                        onChange={handleChange}
                        type="datetime-local"
                        required
                        className="w-full p-4 border-2 border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                        <HiClock className="w-4 h-4 text-orange-600" />
                        <span>Auction End Time *</span>
                      </label>
                      <input
                        name="auctionEndTime"
                        value={formData.auctionEndTime}
                        onChange={handleChange}
                        type="datetime-local"
                        required
                        className="w-full p-4 border-2 border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-white"
                      />
                    </div>
                  </div>
                  <div className="bg-orange-100 rounded-lg p-4">
                    <p className="text-sm text-orange-800 font-semibold">
                      ⏰ Auction Info
                    </p>
                    <p className="text-xs text-orange-700 mt-1">
                      Your product will be available for bidding during the
                      selected time period
                    </p>
                  </div>
                </div>
              )}

              {formData.buyType === "enquiry" && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FaSeedling className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-blue-900 mb-1">
                        Enquiry Mode
                      </h3>
                      <p className="text-sm text-blue-800">
                        Customers will be able to contact you directly to
                        discuss pricing, quantity, and pickup details. Perfect
                        for bulk orders or custom requirements.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-8 border-t-2 border-gray-100">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:from-gray-400 disabled:to-gray-400 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center space-x-3 text-lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <HiCheckCircle className="w-6 h-6" />
                    <span>List Product</span>
                  </>
                )}
              </button>

              {/* Info Banner */}
              <div className="mt-6 bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
                <p className="text-sm text-gray-700 text-center">
                  <strong>Note:</strong> After listing, your product will appear
                  in the marketplace. Customers will contact you directly for
                  pickup arrangements.
                </p>
              </div>
            </div>
          </form>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-md p-6 text-center border-2 border-gray-100">
            <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaTractor className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Direct Sales</h3>
            <p className="text-sm text-gray-600">
              Sell directly to customers without middlemen
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center border-2 border-gray-100">
            <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
              <HiCheckCircle className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Fair Pricing</h3>
            <p className="text-sm text-gray-600">
              Set your own prices and terms
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center border-2 border-gray-100">
            <div className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaSeedling className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">Easy Management</h3>
            <p className="text-sm text-gray-600">
              Track bookings from your dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellYourProduct;
