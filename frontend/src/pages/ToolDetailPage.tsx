import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL } from "../utils/api";
import {
  HiLocationMarker,
  HiCheckCircle,
  HiX,
  HiUser,
  HiTag,
  HiChevronRight,
  HiPhone,
  HiMail,
} from "react-icons/hi";
import { FaTractor, FaTools } from "react-icons/fa";

interface Tool {
  _id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  pricePerDay: number;
  location: string;
  available: boolean;
  listedBy: {
    _id: string;
    name: string;
  };
}

const ToolDetailPage = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTool = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/tools/${toolId}`);
        if (!response.ok) throw new Error("Tool not found");
        const data = await response.json();
        setTool(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTool();
  }, [toolId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">
            Loading tool details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !tool) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center max-w-lg">
          <p className="text-red-600 font-semibold text-lg mb-4">
            Error: {error || "Tool not found!"}
          </p>
          <Link
            to="/rent-tools"
            className="inline-flex items-center space-x-2 bg-green-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-green-700 transition-colors"
          >
            <span>Back to Rentals</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link
            to="/rent-tools"
            className="hover:text-green-600 font-semibold transition-colors"
          >
            Equipment Rentals
          </Link>
          <HiChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-semibold">{tool.name}</span>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-100 sticky top-24">
              <div className="relative">
                <img
                  src={
                    tool.imageUrl ||
                    "https://placehold.co/800x600/22c55e/FFFFFF?text=Tool+Image"
                  }
                  alt={tool.name}
                  className="w-full h-auto aspect-video object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div
                  className={`absolute top-6 right-6 px-5 py-3 rounded-full text-sm font-bold text-white shadow-lg flex items-center space-x-2 ${
                    tool.available ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {tool.available ? (
                    <>
                      <HiCheckCircle className="w-5 h-5" />
                      <span>Available Now</span>
                    </>
                  ) : (
                    <>
                      <HiX className="w-5 h-5" />
                      <span>Rented Out</span>
                    </>
                  )}
                </div>
                <div className="absolute bottom-6 left-6">
                  <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full flex items-center space-x-2">
                    <FaTools className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-gray-800">
                      {tool.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <FaTractor className="w-6 h-6 mr-3 text-green-600" />
                  About This Equipment
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {tool.description || "No description provided by the owner."}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Details & CTA */}
          <div className="lg:col-span-1 flex flex-col space-y-6">
            {/* Title */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {tool.name}
              </h1>

              {/* Price */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <p className="text-sm text-gray-600 mb-2">Rental Price</p>
                <p className="text-4xl font-bold text-green-600">
                  ₹{tool.pricePerDay.toLocaleString("en-IN")}
                  <span className="text-lg font-normal text-gray-600">
                    /day
                  </span>
                </p>
              </div>
            </div>

            {/* Details Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Equipment Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 pb-4 border-b border-gray-100">
                  <HiTag className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Category</p>
                    <p className="font-semibold text-gray-800">
                      {tool.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 pb-4 border-b border-gray-100">
                  <HiLocationMarker className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Location</p>
                    <p className="font-semibold text-gray-800">
                      {tool.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <HiUser className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Listed by</p>
                    <p className="font-semibold text-green-700">
                      {tool.listedBy.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Contact Owner
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Interested in renting? Reach out to the owner directly to
                arrange pickup details and payment.
              </p>
              <div className="flex flex-col space-y-3">
                <button
                  disabled={!tool.available}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <HiPhone className="w-5 h-5" />
                  <span>
                    {tool.available ? "Call Owner" : "Currently Unavailable"}
                  </span>
                </button>

                {tool.available && (
                  <button className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors">
                    <HiMail className="w-5 h-5" />
                    <span>Send Message</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolDetailPage;
