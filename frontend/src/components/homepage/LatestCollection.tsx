// LatestCollection.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../utils/api";
import { HiShoppingCart, HiLocationMarker } from "react-icons/hi";
import { FaLeaf, FaTractor } from "react-icons/fa";

interface Product {
  _id: string;
  name: string;
  location: string;
  farmer: string;
  price: string;
  imageUrl: string;
  buyType?: string;
  category?: string;
}

const LatestCollection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        if (!response.ok) throw new Error("Failed to fetch products.");
        const data = await response.json();
        // Filter only direct_buy products and get first 8
        const directBuyProducts = data.filter(
          (p: Product) => !p.buyType || p.buyType === "direct_buy"
        );
        setProducts(directBuyProducts.slice(0, 8));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className="bg-gradient-to-br from-gray-50 to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-10 bg-gray-200 rounded w-80 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
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

  if (error)
    return (
      <div className="bg-gradient-to-br from-gray-50 to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-12 shadow-lg">
            <p className="text-2xl font-bold text-red-600 mb-2">
              Unable to load products
            </p>
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="relative bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50 py-20">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-2 shadow-md border border-green-100 mb-6">
            <FaLeaf className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-gray-700">
              Fresh from Local Farms
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Latest{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              Harvest
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Freshly picked produce and premium quality products available for
            direct purchase from trusted local farmers
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-green-100 transform hover:-translate-y-2"
            >
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Fresh
                  </span>
                  {product.category && (
                    <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                      {product.category}
                    </span>
                  )}
                </div>

                {/* Quick View Button */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Link
                    to={`/product/${product._id}`}
                    className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                  >
                    <HiShoppingCart className="w-5 h-5 text-gray-700" />
                  </Link>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-green-600 transition-colors">
                  {product.name}
                </h3>

                {/* Farmer Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <FaTractor className="w-4 h-4 mr-1 text-green-600" />
                    <span className="line-clamp-1">{product.farmer}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <HiLocationMarker className="w-4 h-4 mr-1 text-green-600" />
                    <span className="line-clamp-1">{product.location}</span>
                  </div>
                </div>

                {/* Price and Action */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">
                      {product.price}
                    </span>
                    <span className="block text-xs text-green-600 font-medium mt-1">
                      In Stock
                    </span>
                  </div>
                  <Link
                    to={`/product/${product._id}`}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-2 px-5 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Buy
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 bg-white text-gray-700 font-semibold px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-green-200 hover:border-green-300 transform hover:scale-105"
          >
            <span>Explore All Products</span>
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
    </div>
  );
};

export default LatestCollection;
