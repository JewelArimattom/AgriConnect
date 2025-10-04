// AnimalProducts.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  GiMilkCarton,
  GiChicken,
  GiFishEggs,
  GiHoneyJar,
} from "react-icons/gi";
import { HiShieldCheck, HiBadgeCheck } from "react-icons/hi";
import { FaLeaf } from "react-icons/fa";

interface AnimalProduct {
  _id: string;
  name: string;
  farm?: string;
  farmer?: string;
  price: string;
  imageUrl: string;
  subCategory: string;
  buyType: "direct_buy" | "enquiry" | "auction";
  startingBid?: number;
}

const ProductPrice = ({ product }: { product: AnimalProduct }) => {
  switch (product.buyType) {
    case "direct_buy":
      return (
        <div>
          <span className="text-2xl font-bold text-gray-900">
            {product.price}
          </span>
          <span className="block text-xs text-green-600 font-bold mt-1 flex items-center">
            <HiBadgeCheck className="w-4 h-4 mr-1" />
            Available Now
          </span>
        </div>
      );
    case "auction":
      return (
        <div>
          <span className="text-sm text-gray-600">Starting bid</span>
          <span className="block font-bold text-xl text-orange-600">
            ₹{product.startingBid}
          </span>
        </div>
      );
    case "enquiry":
      return (
        <div>
          <span className="text-lg font-semibold text-blue-600">
            Contact Seller
          </span>
          <span className="block text-xs text-gray-600 font-medium mt-1">
            Custom Order
          </span>
        </div>
      );
    default:
      return null;
  }
};

const getCategoryIcon = (subCategory: string) => {
  const lowerSub = subCategory?.toLowerCase() || "";
  if (lowerSub.includes("dairy") || lowerSub.includes("milk"))
    return <GiMilkCarton className="w-8 h-8" />;
  if (lowerSub.includes("egg")) return <GiFishEggs className="w-8 h-8" />;
  if (lowerSub.includes("poultry") || lowerSub.includes("chicken"))
    return <GiChicken className="w-8 h-8" />;
  if (lowerSub.includes("honey")) return <GiHoneyJar className="w-8 h-8" />;
  return <GiMilkCarton className="w-8 h-8" />;
};

const AnimalProducts = () => {
  const [products, setProducts] = useState<AnimalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnimalProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/animal-products"
        );
        if (!response.ok) throw new Error("Failed to fetch animal products.");
        const data = await response.json();
        setProducts(data.slice(0, 6));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimalProducts();
  }, []);

  if (loading)
    return (
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-10 bg-gray-200 rounded w-80 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
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

  if (error) return null;
  if (products.length === 0) return null;

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-2 shadow-md border border-blue-100 mb-6">
            <HiShieldCheck className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-semibold text-gray-700">
              Quality Certified Products
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Farm-Fresh{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Animal Products
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Premium quality dairy, eggs, poultry, and honey sourced from trusted
            local farms with highest hygiene standards
          </p>
        </div>

        {/* Features Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-md border border-blue-100 flex items-center space-x-4">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-3 rounded-lg">
              <FaLeaf className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">100% Natural</h4>
              <p className="text-sm text-gray-600">No artificial additives</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border border-purple-100 flex items-center space-x-4">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-lg">
              <HiShieldCheck className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Quality Assured</h4>
              <p className="text-sm text-gray-600">Tested & certified</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border border-pink-100 flex items-center space-x-4">
            <div className="bg-gradient-to-br from-pink-100 to-blue-100 p-3 rounded-lg">
              <HiBadgeCheck className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">Farm Direct</h4>
              <p className="text-sm text-gray-600">No middlemen</p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-blue-100 transform hover:-translate-y-2"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden h-64">
                <img
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src={
                    product.imageUrl ||
                    "https://images.unsplash.com/photo-1541529086526-db283c563270?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  }
                  alt={product.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-xl shadow-lg">
                  {getCategoryIcon(product.subCategory)}
                </div>

                {/* Buy Type Badge */}
                <div className="absolute top-4 right-4">
                  {product.buyType === "direct_buy" && (
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      In Stock
                    </span>
                  )}
                  {product.buyType === "auction" && (
                    <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      Auction
                    </span>
                  )}
                  {product.buyType === "enquiry" && (
                    <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      Enquire
                    </span>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="mb-3">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                    {product.subCategory}
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 text-xl mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>

                {/* Farm/Farmer Info */}
                <p className="text-sm text-gray-600 mb-4 flex items-center">
                  <HiBadgeCheck className="w-4 h-4 mr-1 text-green-500" />
                  {product.farm || product.farmer || "Local Farm"}
                </p>

                {/* Price and Action */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <ProductPrice product={product} />
                  <Link
                    to={`/product/${product._id}`}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 px-5 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Link
            to="/animal-products"
            className="inline-flex items-center space-x-2 bg-white text-gray-700 font-semibold px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-blue-200 hover:border-blue-300 transform hover:scale-105"
          >
            <span>Explore All Animal Products</span>
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

export default AnimalProducts;
