import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthenticationContext";
import {
  HiLocationMarker,
  HiCheckCircle,
  HiX,
  HiFilter,
  HiPlus,
} from "react-icons/hi";
import { FaTractor, FaSeedling, FaTools } from "react-icons/fa";

const ListToolModal = ({
  onClose,
  onAddTool,
}: {
  onClose: () => void;
  onAddTool: (tool: Omit<Tool, "_id" | "available" | "listedBy">) => void;
}) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "Tractors" as Tool["category"],
    imageUrl: "",
    pricePerDay: "",
    location: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.pricePerDay || !formData.location) {
      alert("Please fill out all required fields.");
      return;
    }
    onAddTool({ ...formData, pricePerDay: parseFloat(formData.pricePerDay) });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl border-2 border-gray-100 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              List Your Equipment
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Earn money by renting out your farming tools
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
          >
            <HiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tool Name *
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Compact Tractor, Harvester"
              required
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            />
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
              className="w-full p-4 border-2 border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            >
              <option value="Tractors">Tractors</option>
              <option value="Harvesting">Harvesting Equipment</option>
              <option value="Soil Preparation">Soil Preparation</option>
              <option value="Seeding & Planting">Seeding & Planting</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Image URL (optional)
            </label>
            <input
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/tool-image.jpg"
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your tool's features and condition"
              rows={4}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price per Day (₹) *
              </label>
              <input
                name="pricePerDay"
                value={formData.pricePerDay}
                onChange={handleChange}
                placeholder="5000"
                type="number"
                required
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Location *
              </label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Pala, Kottayam"
                required
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <HiPlus className="w-5 h-5" />
            <span>List My Tool</span>
          </button>
        </form>
      </div>
    </div>
  );
};

interface Tool {
  _id: string; // Use _id to match MongoDB
  name: string;
  category:
    | "Tractors"
    | "Harvesting"
    | "Soil Preparation"
    | "Seeding & Planting";
  imageUrl: string;
  pricePerDay: number;
  location: string;
  available: boolean;
  description?: string;
  listedBy: { _id: string; name: string };
}

const RentToolsPage = () => {
  const { user } = useAuth();
  const [tools, setTools] = useState<Tool[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState(false);
  const [sortOrder, setSortOrder] = useState("default");

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/tools");
        if (!response.ok) throw new Error("Failed to fetch tools.");
        const data = await response.json();
        setTools(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTools();
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(tools.map((t) => t.category)))],
    [tools]
  );

  const handleAddTool = async (
    newToolData: Omit<Tool, "_id" | "available" | "listedBy">
  ) => {
    if (!user) {
      alert("You must be logged in to list a tool.");
      return;
    }
    const payload = { ...newToolData, listedBy: user._id };
    try {
      const response = await fetch("http://localhost:5000/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to list the tool.");
      const savedTool = await response.json();
      // To show the owner's name immediately, we can add it from the logged-in user context
      const toolWithOwner = {
        ...savedTool,
        listedBy: { _id: user._id, name: user.name },
      };
      setTools((prevTools) => [toolWithOwner, ...prevTools]);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredAndSortedTools = useMemo(() => {
    let filtered = [...tools];
    if (categoryFilter !== "All") {
      filtered = filtered.filter((tool) => tool.category === categoryFilter);
    }
    if (availabilityFilter) {
      filtered = filtered.filter((tool) => tool.available);
    }
    switch (sortOrder) {
      case "price-asc":
        filtered.sort((a, b) => a.pricePerDay - b.pricePerDay);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.pricePerDay - a.pricePerDay);
        break;
      default:
        break;
    }
    return filtered;
  }, [tools, categoryFilter, availabilityFilter, sortOrder]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">
            Loading equipment...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-red-50">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center max-w-lg">
          <p className="text-red-600 font-semibold text-lg">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <div className="inline-flex items-center space-x-3 bg-white rounded-full px-6 py-3 shadow-lg mb-4">
                <FaTractor className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-700">
                  Equipment Rental
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                Farming Equipment Rentals
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                Find the right tools to boost your farm's productivity and
                efficiency. Rent from local farmers.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-8 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <HiPlus className="w-6 h-6" />
              <span>List Your Tool</span>
            </button>
          </div>
        </div>
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center space-x-3">
            <FaTools className="w-5 h-5 text-green-600" />
            <span className="text-lg font-semibold text-gray-700">
              {filteredAndSortedTools.length}{" "}
              {filteredAndSortedTools.length === 1 ? "tool" : "tools"} available
            </span>
          </div>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-4 py-3 border-2 border-gray-200 bg-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 font-semibold text-gray-700 shadow-sm"
          >
            <option value="default">Sort by: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 sticky top-24">
              <div className="flex items-center space-x-2 mb-6">
                <HiFilter className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    Category
                  </h3>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`block w-full text-left px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                          categoryFilter === cat
                            ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md"
                            : "text-gray-700 hover:bg-gray-50 border-2 border-gray-100"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-gray-100">
                  <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    Availability
                  </h3>
                  <label className="flex items-center space-x-3 cursor-pointer bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={availabilityFilter}
                      onChange={(e) => setAvailabilityFilter(e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500 w-5 h-5"
                    />
                    <span className="text-gray-700 font-semibold">
                      Show Available Only
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </aside>
          {/* Main Content */}
          <main className="lg:col-span-3">
            {filteredAndSortedTools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredAndSortedTools.map((tool) => (
                  <div
                    key={tool._id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-100 hover:border-green-200 transition-all duration-300 transform hover:-translate-y-1 group"
                  >
                    <div className="relative h-52">
                      <img
                        className="h-full w-full object-cover"
                        src={
                          tool.imageUrl ||
                          "https://media.istockphoto.com/id/505022500/photo/green-tractor.jpg?s=612x612&w=0&k=20&c=81hNsPmJ8UhKMqyd2Gx1DHB4vIJISCBvidWwNWP2Gtw="
                        }
                        alt={tool.name}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div
                        className={`absolute top-3 right-3 px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg flex items-center space-x-2 ${
                          tool.available ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {tool.available ? (
                          <>
                            <HiCheckCircle className="w-4 h-4" />
                            <span>Available</span>
                          </>
                        ) : (
                          <>
                            <HiX className="w-4 h-4" />
                            <span>Rented Out</span>
                          </>
                        )}
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                          {tool.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                        {tool.name}
                      </h3>

                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <HiLocationMarker className="w-4 h-4 mr-1 text-green-600" />
                        <span>{tool.location}</span>
                      </div>

                      {tool.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {tool.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Rental Price
                          </p>
                          <p className="text-2xl font-bold text-green-600">
                            ₹{tool.pricePerDay.toLocaleString("en-IN")}
                            <span className="text-sm font-normal text-gray-500">
                              /day
                            </span>
                          </p>
                        </div>
                        <Link
                          to={`/rent-tools/${tool._id}`}
                          className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-md ${
                            tool.available
                              ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transform hover:scale-105"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                          onClick={(e) => !tool.available && e.preventDefault()}
                        >
                          {tool.available ? "View Details" : "Unavailable"}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-16 text-center border-2 border-gray-100">
                <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaSeedling className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  No Tools Found
                </h2>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or check back later!
                </p>
                <button
                  onClick={() => {
                    setCategoryFilter("All");
                    setAvailabilityFilter(false);
                  }}
                  className="inline-flex items-center space-x-2 bg-green-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-green-700 transition-colors"
                >
                  <span>Reset Filters</span>
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
      {isModalOpen && (
        <ListToolModal
          onClose={() => setIsModalOpen(false)}
          onAddTool={handleAddTool}
        />
      )}
    </div>
  );
};

export default RentToolsPage;
