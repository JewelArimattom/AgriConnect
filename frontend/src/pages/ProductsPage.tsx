import { useState, useMemo, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  HiSearch,
  HiFilter,
  HiX,
  HiStar,
  HiShoppingCart,
  HiAdjustments,
  HiCheckCircle,
} from "react-icons/hi";
import { FaLeaf, FaSeedling, FaTractor } from "react-icons/fa";

// 1. Updated the Product type for better default handling
interface Product {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  farmer: string;
  category: string;
  price: string;
  rating: number;
  inStock?: boolean; // Changed to optional
  organic: boolean;
}

interface PriceRange {
  min: number;
  max: number;
}

interface FilterState {
  category: string;
  priceRange: PriceRange;
  farmers: string[];
  rating: number;
  inStock: boolean;
  organic: boolean;
  searchQuery: string;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 2. Set a fixed higher max price for the filter
  const maxPrice = 2000;

  const [filters, setFilters] = useState<FilterState>({
    category: "All",
    priceRange: { min: 0, max: maxPrice }, // Use the new max price
    farmers: [],
    rating: 0,
    inStock: false,
    organic: false,
    searchQuery: "",
  });

  const [sortOrder, setSortOrder] = useState("default");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products.");
        }
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );

  const allFarmers = useMemo(
    () => Array.from(new Set(products.map((p) => p.farmer))),
    [products]
  );

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.farmer.toLowerCase().includes(query)
      );
    }
    if (filters.category !== "All") {
      filtered = filtered.filter(
        (product) => product.category === filters.category
      );
    }
    filtered = filtered.filter((product) => {
      const price = parseFloat(product.price.replace("₹", ""));
      return price >= filters.priceRange.min && price <= filters.priceRange.max;
    });
    if (filters.farmers.length > 0) {
      filtered = filtered.filter((product) =>
        filters.farmers.includes(product.farmer)
      );
    }
    if (filters.rating > 0) {
      filtered = filtered.filter((product) => product.rating >= filters.rating);
    }
    if (filters.inStock) {
      // Logic: Only show items where inStock is NOT explicitly false
      filtered = filtered.filter((product) => product.inStock !== false);
    }
    if (filters.organic) {
      filtered = filtered.filter((product) => product.organic);
    }
    switch (sortOrder) {
      case "price-asc":
        filtered.sort(
          (a, b) =>
            parseFloat(a.price.replace("₹", "")) -
            parseFloat(b.price.replace("₹", ""))
        );
        break;
      case "price-desc":
        filtered.sort(
          (a, b) =>
            parseFloat(b.price.replace("₹", "")) -
            parseFloat(a.price.replace("₹", ""))
        );
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "rating-desc":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return filtered;
  }, [products, filters, sortOrder]);

  const updateFilter = useCallback((key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleFarmer = useCallback((farmer: string) => {
    setFilters((prev) => ({
      ...prev,
      farmers: prev.farmers.includes(farmer)
        ? prev.farmers.filter((f) => f !== farmer)
        : [...prev.farmers, farmer],
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      category: "All",
      priceRange: { min: 0, max: maxPrice },
      farmers: [],
      rating: 0,
      inStock: false,
      organic: false,
      searchQuery: "",
    });
    setSortOrder("default");
  }, [maxPrice]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category !== "All") count++;
    if (filters.priceRange.min > 0 || filters.priceRange.max < maxPrice)
      count++;
    if (filters.farmers.length > 0) count++;
    if (filters.rating > 0) count++;
    if (filters.inStock) count++;
    if (filters.organic) count++;
    if (filters.searchQuery) count++;
    return count;
  }, [filters, maxPrice]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-green-200 rounded-full animate-ping"></div>
            <div className="relative flex items-center justify-center w-24 h-24 border-4 border-green-600 border-t-transparent rounded-full animate-spin">
              <FaTractor className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <p className="text-xl font-semibold text-gray-700">
            Loading fresh products...
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
            <HiX className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Products
          </h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-green-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 bg-white rounded-full px-6 py-3 shadow-lg mb-6">
            <FaLeaf className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-gray-700">
              Fresh from Local Farms
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Explore Our <span className="text-green-600">Products</span>
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed">
            Browse our full collection of fresh produce and artisanal goods from
            local farmers. Quality guaranteed, freshness delivered.
          </p>
        </div>
        {/* Search Bar */}
        <div className="mb-10">
          <div className="relative max-w-3xl mx-auto">
            <HiSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, farmers, or descriptions..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter("searchQuery", e.target.value)}
              className="w-full py-5 pl-14 pr-5 rounded-2xl border-2 border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-lg transition-all duration-200 text-lg hover:border-gray-300"
            />
            {filters.searchQuery && (
              <button
                onClick={() => updateFilter("searchQuery", "")}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <HiX className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-2 border-gray-100">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md transform hover:scale-105 font-semibold"
              >
                {showAdvancedFilters ? (
                  <HiAdjustments className="w-5 h-5" />
                ) : (
                  <HiFilter className="w-5 h-5" />
                )}
                {showAdvancedFilters ? "Hide Filters" : "Show Filters"}
                {activeFilterCount > 0 && (
                  <span className="bg-white text-green-600 text-sm px-3 py-1 rounded-full font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold px-4 py-2 hover:bg-red-50 rounded-lg transition-all duration-200"
                >
                  <HiX className="w-5 h-5" />
                  Clear All Filters
                </button>
              )}
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                <FaSeedling className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-green-700">
                  {filteredAndSortedProducts.length} products found
                </span>
              </div>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white shadow-sm cursor-pointer font-semibold text-gray-700 hover:border-gray-300 transition-all duration-200"
              >
                <option value="default">Sort: Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
                <option value="name-desc">Name: Z-A</option>
                <option value="rating-desc">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`lg:col-span-1 h-fit transition-all duration-300 ${
              showAdvancedFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-gray-100 sticky top-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <HiFilter className="w-6 h-6 mr-3 text-green-600" />
                  Filters
                </h2>
                {activeFilterCount > 0 && (
                  <span className="bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FaLeaf className="w-4 h-4 mr-2 text-green-600" />
                  Category
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => updateFilter("category", category)}
                      className={`block w-full text-left px-4 py-3 rounded-xl transition-all duration-200 font-semibold ${
                        filters.category === category
                          ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md transform scale-105"
                          : "text-gray-700 hover:bg-green-50 border-2 border-transparent hover:border-green-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Price Range
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg">
                      ₹{filters.priceRange.min}
                    </span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg">
                      ₹{filters.priceRange.max}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm text-gray-600 font-medium">
                      Min Price
                    </label>
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      value={filters.priceRange.min}
                      onChange={(e) =>
                        updateFilter("priceRange", {
                          ...filters.priceRange,
                          min: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <label className="text-sm text-gray-600 font-medium">
                      Max Price
                    </label>
                    <input
                      type="range"
                      min="0"
                      max={maxPrice}
                      value={filters.priceRange.max}
                      onChange={(e) =>
                        updateFilter("priceRange", {
                          ...filters.priceRange,
                          max: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                  </div>
                </div>
              </div>

              {showAdvancedFilters && (
                <>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <FaTractor className="w-4 h-4 mr-2 text-green-600" />
                      Farmers
                    </h3>
                    <div className="space-y-3 max-h-48 overflow-y-auto bg-gray-50 rounded-xl p-4">
                      {allFarmers.map((farmer) => (
                        <label
                          key={farmer}
                          className="flex items-center space-x-3 cursor-pointer hover:bg-white p-2 rounded-lg transition-all duration-200"
                        >
                          <input
                            type="checkbox"
                            checked={filters.farmers.includes(farmer)}
                            onChange={() => toggleFarmer(farmer)}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500 w-5 h-5"
                          />
                          <span className="text-gray-700 font-medium">
                            {farmer}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <HiStar className="w-5 h-5 mr-2 text-yellow-500" />
                      Minimum Rating
                    </h3>
                    <div className="flex space-x-2 bg-gray-50 rounded-xl p-4 justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => updateFilter("rating", star)}
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            filters.rating >= star
                              ? "text-yellow-400 bg-yellow-50 scale-110 shadow-md"
                              : "text-gray-300 hover:text-yellow-200 hover:bg-gray-100"
                          }`}
                        >
                          <HiStar className="w-7 h-7" />
                        </button>
                      ))}
                    </div>
                    {filters.rating > 0 && (
                      <button
                        onClick={() => updateFilter("rating", 0)}
                        className="text-sm text-red-600 hover:text-red-700 mt-3 font-semibold hover:underline"
                      >
                        Clear rating filter
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center space-x-3 cursor-pointer bg-gray-50 p-4 rounded-xl hover:bg-green-50 transition-all duration-200 border-2 border-transparent hover:border-green-200">
                      <input
                        type="checkbox"
                        checked={filters.inStock}
                        onChange={(e) =>
                          updateFilter("inStock", e.target.checked)
                        }
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500 w-5 h-5"
                      />
                      <span className="text-gray-700 font-semibold flex items-center">
                        <HiCheckCircle className="w-5 h-5 mr-2 text-green-600" />
                        In Stock Only
                      </span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer bg-gray-50 p-4 rounded-xl hover:bg-green-50 transition-all duration-200 border-2 border-transparent hover:border-green-200">
                      <input
                        type="checkbox"
                        checked={filters.organic}
                        onChange={(e) =>
                          updateFilter("organic", e.target.checked)
                        }
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500 w-5 h-5"
                      />
                      <span className="text-gray-700 font-semibold flex items-center">
                        <FaLeaf className="w-5 h-5 mr-2 text-green-600" />
                        Organic Only
                      </span>
                    </label>
                  </div>
                </>
              )}
            </div>
          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-3">
            {filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedProducts.map((product: Product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border-2 border-gray-100 hover:border-green-200 group"
                  >
                    <div className="relative overflow-hidden">
                      <img
                        className="h-64 w-full object-cover group-hover:scale-110 transition-transform duration-300"
                        src={
                          product.imageUrl ||
                          "https://placehold.co/600x400/EEE/31343C?text=No+Image"
                        }
                        alt={product.name}
                      />
                      {product.inStock === false && (
                        <div className="absolute inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
                          <span className="text-white font-bold text-lg bg-red-600 px-4 py-2 rounded-xl shadow-lg">
                            Out of Stock
                          </span>
                        </div>
                      )}
                      {product.organic && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg flex items-center space-x-2">
                          <FaLeaf className="w-4 h-4" />
                          <span>Organic</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1 rounded-lg">
                          <HiStar className="w-5 h-5 text-yellow-500" />
                          <span className="text-gray-900 font-semibold">
                            {product.rating}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4 flex items-center">
                        <FaTractor className="w-4 h-4 mr-2 text-green-600" />
                        from {product.farmer}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-2xl font-bold text-green-600">
                          {product.price}
                        </p>
                        <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600 font-semibold">
                          {product.category}
                        </span>
                      </div>
                      <Link
                        to={`/product/${product._id}`}
                        className={`flex items-center justify-center space-x-2 w-full font-bold py-3 px-4 rounded-xl transition-all duration-200 transform ${
                          product.inStock !== false
                            ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:scale-105 shadow-md hover:shadow-lg"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                        onClick={(e) =>
                          product.inStock === false && e.preventDefault()
                        }
                      >
                        {product.inStock !== false ? (
                          <>
                            <HiShoppingCart className="w-5 h-5" />
                            <span>View Details</span>
                          </>
                        ) : (
                          <span>Out of Stock</span>
                        )}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl shadow-xl border-2 border-gray-100">
                <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <HiX className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  No Products Found
                </h2>
                <p className="text-gray-600 mb-8 text-lg">
                  Try adjusting your filters or check back later!
                </p>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold px-8 py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
