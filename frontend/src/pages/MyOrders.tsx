import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthenticationContext";
import { API_BASE_URL } from "../utils/api";
import {
  HiCheckCircle,
  HiClock,
  HiPhone,
  HiLocationMarker,
  HiUser,
  HiClipboardList,
} from "react-icons/hi";
import { FaLeaf, FaTractor, FaWhatsapp } from "react-icons/fa";

interface Order {
  _id: string;
  totalAmount: number;
  status: "Confirmed" | "Ready for Pickup" | "Completed" | "Cancelled";
  createdAt: string;
  products: { name: string; quantity?: number }[];
  // Farmer/Seller contact info for pickup
  farmerName?: string;
  farmerPhone?: string;
  farmerAddress?: string;
  pickupInstructions?: string;
  bookingReference?: string;
}

const MyOrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/api/orders/myorders/${user.name}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch your orders.");
        }
        const data = await response.json();
        setOrders(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">
            Loading your bookings...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiClipboardList className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Bookings
          </h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
          >
            <span>Browse Products</span>
          </Link>
        </div>
      </div>
    );
  }

  // Helper function to get status styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "Ready for Pickup":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Confirmed":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Helper function to get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <HiCheckCircle className="w-5 h-5" />;
      case "Ready for Pickup":
      case "Confirmed":
        return <HiClock className="w-5 h-5" />;
      default:
        return <HiClipboardList className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 bg-white rounded-full px-6 py-3 shadow-lg mb-4">
            <FaLeaf className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-gray-700">
              Your Farm Bookings
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            My Orders & Bookings
          </h1>
          <p className="text-lg text-gray-600">
            View your bookings and pickup details from local farmers
          </p>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100 hover:border-green-200 transition-all duration-300"
              >
                {/* Order Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-6 border-b-2 border-gray-100">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Booking #
                        {order.bookingReference ||
                          order._id.slice(-8).toUpperCase()}
                      </h2>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold border-2 flex items-center space-x-2 ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        <span>{order.status}</span>
                      </span>
                    </div>
                    <p className="text-gray-500">
                      Booked on{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                    <p className="text-3xl font-bold text-green-600">
                      ₹{order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Products Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                    <HiClipboardList className="w-5 h-5 mr-2 text-green-600" />
                    Products Ordered
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <ul className="space-y-2">
                      {order.products.map((product, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between text-gray-700"
                        >
                          <span className="flex items-center">
                            <FaLeaf className="w-4 h-4 mr-2 text-green-600" />
                            {product.name}
                          </span>
                          {product.quantity && (
                            <span className="text-sm font-semibold text-gray-500">
                              Qty: {product.quantity}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Farmer Contact & Pickup Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Farmer Contact */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <FaTractor className="w-5 h-5 mr-2 text-green-600" />
                      Farmer Contact
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <HiUser className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-xs text-gray-500">Farmer Name</p>
                          <p className="font-semibold text-gray-900">
                            {order.farmerName || "John Farmer"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <HiPhone className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-xs text-gray-500">
                            Contact Number
                          </p>
                          <a
                            href={`tel:${order.farmerPhone || "+919876543210"}`}
                            className="font-semibold text-green-600 hover:text-green-700"
                          >
                            {order.farmerPhone || "+91 98765-43210"}
                          </a>
                        </div>
                      </div>
                      <a
                        href={`https://wa.me/${(
                          order.farmerPhone || "919876543210"
                        ).replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center space-x-2 bg-green-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 transition-all duration-200"
                      >
                        <FaWhatsapp className="w-5 h-5" />
                        <span>Contact on WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Pickup Location */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                      <HiLocationMarker className="w-5 h-5 mr-2 text-blue-600" />
                      Pickup Location
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Address</p>
                        <p className="text-gray-700 leading-relaxed">
                          {order.farmerAddress ||
                            "Green Valley Farm, Pala, Kottayam, Kerala 686575"}
                        </p>
                      </div>
                      {order.pickupInstructions && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Pickup Instructions
                          </p>
                          <p className="text-gray-700 leading-relaxed">
                            {order.pickupInstructions}
                          </p>
                        </div>
                      )}
                      <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-200">
                        <HiLocationMarker className="w-5 h-5" />
                        <span>View on Map</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="bg-gradient-to-br from-gray-100 to-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiClipboardList className="w-12 h-12 text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No Bookings Yet
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't made any bookings yet. Browse our fresh farm products
              and book directly from local farmers!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <FaLeaf className="w-5 h-5" />
              <span>Browse Products</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
