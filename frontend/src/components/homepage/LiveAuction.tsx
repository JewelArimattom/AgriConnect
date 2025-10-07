import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../utils/api";
import { HiClock, HiTrendingUp, HiFire, HiUsers } from "react-icons/hi";
import { FaHammer } from "react-icons/fa";

interface AuctionProduct {
  _id: string;
  name: string;
  farmer: string;
  imageUrl: string;
  buyType?: string;
  startingBid?: number;
  currentBid?: number;
  auctionEndTime?: string;
  category?: string;
  bidCount?: number;
}

const LiveAuction = () => {
  const [products, setProducts] = useState<AuctionProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAuctionProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        if (!response.ok) throw new Error("Failed to fetch products.");
        const data = await response.json();
        // Filter only auction products
        const auctionProducts = data.filter(
          (p: AuctionProduct) => p.buyType === "auction"
        );
        setProducts(auctionProducts.slice(0, 4));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAuctionProducts();
  }, []);

  const calculateTimeLeft = (endTime: string) => {
    const difference = new Date(endTime).getTime() - new Date().getTime();
    if (difference <= 0) return "Ended";

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  if (loading)
    return (
      <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-10 bg-gray-200 rounded w-80 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 animate-pulse shadow-lg"
              >
                <div className="h-56 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-12 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  if (error || products.length === 0) return null;

  return (
    <div className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-20 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-4 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-4 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-2 shadow-md border border-orange-100 mb-6">
            <HiFire className="w-4 h-4 text-orange-600 animate-pulse" />
            <span className="text-sm font-semibold text-gray-700">
              Hot Deals - Limited Time
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Live{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              Auctions
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Place your bids on premium products and secure the best deals
            directly from farmers
          </p>
        </div>

        {/* Auctions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-orange-200 transform hover:-translate-y-2 relative"
            >
              {/* Live Badge */}
              <div className="absolute top-4 left-4 z-10 flex items-center space-x-1 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                <span>LIVE</span>
              </div>

              {/* Product Image */}
              <div className="relative overflow-hidden h-56">
                <img
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src={
                    product.imageUrl ||
                    "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  }
                  alt={product.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                {/* Time Left Badge */}
                {product.auctionEndTime && (
                  <div className="absolute bottom-3 right-3 flex items-center space-x-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                    <HiClock className="w-3 h-3 text-orange-600" />
                    <span>{calculateTimeLeft(product.auctionEndTime)}</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-5">
                <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">
                  {product.name}
                </h3>

                {/* Farmer Info */}
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <span className="line-clamp-1">From: {product.farmer}</span>
                </div>

                {/* Bid Stats */}
                <div className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Starting Bid</p>
                    <p className="text-lg font-bold text-gray-900">
                      ₹{product.startingBid || 100}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600 mb-1 flex items-center justify-end">
                      <HiUsers className="w-3 h-3 mr-1" />
                      {product.bidCount ||
                        Math.floor(Math.random() * 20) + 5}{" "}
                      bids
                    </p>
                    <p className="text-sm font-semibold text-green-600 flex items-center justify-end">
                      <HiTrendingUp className="w-4 h-4 mr-1" />
                      Active
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  to={`/product/${product._id}`}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold py-3 px-5 rounded-xl hover:from-orange-700 hover:to-amber-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <FaHammer className="w-4 h-4" />
                  <span>Place Bid</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 bg-white text-gray-700 font-semibold px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-orange-200 hover:border-orange-300 transform hover:scale-105"
          >
            <FaHammer className="w-5 h-5 text-orange-600" />
            <span>View All Auctions</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }
        .animate-blob {
          animation: blob 20s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default LiveAuction;
