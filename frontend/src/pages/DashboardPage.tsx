import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthenticationContext";
import { API_BASE_URL } from "../utils/api";
import {
  HiShoppingBag,
  HiClipboardList,
  HiTrash,
  HiPencil,
  HiPlus,
  HiUser,
} from "react-icons/hi";
import { FaTractor, FaLeaf, FaSeedling, FaChartLine } from "react-icons/fa";

// Updated Interfaces for booking/pickup system
interface Product {
  _id: string;
  name: string;
  price: string;
  category: string;
  imageUrl: string;
  buyType: "direct_buy" | "auction";
  currentPrice?: number;
}

interface Order {
  _id: string;
  customerDetails: { name: string; email: string; phone?: string };
  totalAmount: number;
  status: "Confirmed" | "Ready for Pickup" | "Completed";
  createdAt: string;
  products: { name: string }[];
}

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const [productsResponse, ordersResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/dashboard/products/${user.name}`),
        fetch(`${API_BASE_URL}/api/dashboard/orders/${user.name}`),
      ]);
      if (!productsResponse.ok || !ordersResponse.ok) {
        throw new Error("Failed to fetch dashboard data.");
      }
      const productsData = await productsResponse.json();
      const ordersData = await ordersResponse.json();
      setMyProducts(productsData);
      setMyOrders(ordersData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/products/${productId}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) throw new Error("Failed to delete product.");
        fetchData();
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update booking status.");
      }

      // Update the local state with the returned order data
      setMyOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );

      // Show success message
      alert("Order status updated successfully!");
    } catch (err: any) {
      console.error("Status update error:", err);
      setError(err.message);
      alert("Failed to update status: " + err.message);
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "Ready for Pickup":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Confirmed":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600 mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-gray-700">
              Loading your dashboard...
            </p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
          <p className="text-red-600 font-semibold">{error}</p>
        </div>
      );
    }

    if (activeTab === "products") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProducts.length > 0 ? (
            myProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100 hover:border-green-200 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-48">
                  <img
                    src={product.imageUrl || "https://placehold.co/600x400"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        product.buyType === "auction"
                          ? "bg-orange-500 text-white"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {product.buyType === "auction"
                        ? "Auction"
                        : "Direct Sale"}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">
                      {product.category}
                    </span>
                    <span className="text-xl font-bold text-green-600">
                      {product.buyType === "auction"
                        ? `₹${product.currentPrice}`
                        : product.price}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/upload-product/${product._id}`}
                      className="flex-1 flex items-center justify-center space-x-2 bg-green-50 text-green-600 font-semibold py-2 px-4 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <HiPencil className="w-4 h-4" />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="flex-1 flex items-center justify-center space-x-2 bg-red-50 text-red-600 font-semibold py-2 px-4 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <HiTrash className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-gray-100">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiShoppingBag className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No Products Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start listing your farm products to connect with customers
              </p>
              <Link
                to="/upload-product"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg"
              >
                <HiPlus className="w-5 h-5" />
                <span>Add Your First Product</span>
              </Link>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === "orders") {
      return (
        <div className="space-y-6">
          {myOrders.length > 0 ? (
            myOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:border-green-200 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      Booking #{order._id.slice(-8).toUpperCase()}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Booked on{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <p className="text-2xl font-bold text-green-600">
                      ₹{order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <HiUser className="w-4 h-4 mr-2 text-green-600" />
                      Customer Details
                    </h4>
                    <p className="text-sm text-gray-900 font-medium">
                      {order.customerDetails.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {order.customerDetails.email}
                    </p>
                    {order.customerDetails.phone && (
                      <p className="text-xs text-gray-600 mt-1">
                        📞 {order.customerDetails.phone}
                      </p>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                      <HiClipboardList className="w-4 h-4 mr-2 text-green-600" />
                      Products Booked
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {order.products.map((p, idx) => (
                        <li key={idx} className="flex items-center">
                          <FaLeaf className="w-3 h-3 mr-2 text-green-500" />
                          {p.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-semibold text-gray-700">
                      Pickup Status:
                    </span>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <label className="text-sm font-semibold text-gray-700">
                      Update:
                    </label>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(
                          order._id,
                          e.target.value as Order["status"]
                        )
                      }
                      className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white font-semibold text-gray-700 cursor-pointer hover:border-gray-300 transition-all"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Ready for Pickup">Ready for Pickup</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-gray-100">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiClipboardList className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No Bookings Yet
              </h3>
              <p className="text-gray-600">
                Customer bookings will appear here once they start ordering
              </p>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <div className="inline-flex items-center space-x-3 bg-white rounded-full px-6 py-3 shadow-lg mb-4">
                <FaTractor className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-700">
                  Farmer Dashboard
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                Welcome back, {user?.name || "Farmer"}!
              </h1>
              <p className="text-lg text-gray-600">
                Manage your products and customer bookings
              </p>
            </div>
            <Link
              to="/upload-product"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-8 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <HiPlus className="w-6 h-6" />
              <span>Add New Product</span>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Total Products
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {myProducts.length}
                  </p>
                </div>
                <div className="bg-green-100 p-4 rounded-xl">
                  <FaSeedling className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Active Bookings
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {myOrders.length}
                  </p>
                </div>
                <div className="bg-blue-100 p-4 rounded-xl">
                  <HiClipboardList className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Total Revenue
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    ₹
                    {myOrders
                      .reduce((sum, order) => sum + order.totalAmount, 0)
                      .toFixed(0)}
                  </p>
                </div>
                <div className="bg-purple-100 p-4 rounded-xl">
                  <FaChartLine className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 mb-8">
          <nav className="flex space-x-4 p-2" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("products")}
              className={`flex-1 flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-bold text-sm transition-all duration-200 ${
                activeTab === "products"
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <HiShoppingBag className="w-5 h-5" />
              <span>My Products</span>
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex-1 flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-bold text-sm transition-all duration-200 ${
                activeTab === "orders"
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <HiClipboardList className="w-5 h-5" />
              <span>Customer Bookings</span>
            </button>
          </nav>
        </div>

        {/* Content */}
        <div>{renderContent()}</div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
