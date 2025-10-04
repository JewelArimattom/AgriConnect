import { useState, useMemo, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
  const [error, setError] = useState('');

  // 2. Set a fixed higher max price for the filter
  const maxPrice = 2000;

  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    priceRange: { min: 0, max: maxPrice }, // Use the new max price
    farmers: [],
    rating: 0,
    inStock: false,
    organic: false,
    searchQuery: ''
  });

  const [sortOrder, setSortOrder] = useState('default');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products.');
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

  const categories = useMemo(() => 
    ['All', ...Array.from(new Set(products.map(p => p.category)))], 
  [products]);

  const allFarmers = useMemo(() => 
    Array.from(new Set(products.map(p => p.farmer))), 
  [products]);
  
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.farmer.toLowerCase().includes(query)
      );
    }
    if (filters.category !== 'All') {
      filtered = filtered.filter(product => product.category === filters.category);
    }
    filtered = filtered.filter(product => {
      const price = parseFloat(product.price.replace('₹', ''));
      return price >= filters.priceRange.min && price <= filters.priceRange.max;
    });
    if (filters.farmers.length > 0) {
      filtered = filtered.filter(product => filters.farmers.includes(product.farmer));
    }
    if (filters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.rating);
    }
    if (filters.inStock) {
      // Logic: Only show items where inStock is NOT explicitly false
      filtered = filtered.filter(product => product.inStock !== false);
    }
    if (filters.organic) {
      filtered = filtered.filter(product => product.organic);
    }
    switch (sortOrder) {
      case 'price-asc':
        filtered.sort((a, b) => parseFloat(a.price.replace('₹', '')) - parseFloat(b.price.replace('₹', '')));
        break;
      case 'price-desc':
        filtered.sort((a, b) => parseFloat(b.price.replace('₹', '')) - parseFloat(a.price.replace('₹', '')));
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'rating-desc':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return filtered;
  }, [products, filters, sortOrder]);

  const updateFilter = useCallback((key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleFarmer = useCallback((farmer: string) => {
    setFilters(prev => ({
      ...prev,
      farmers: prev.farmers.includes(farmer)
        ? prev.farmers.filter(f => f !== farmer)
        : [...prev.farmers, farmer]
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      category: 'All',
      priceRange: { min: 0, max: maxPrice },
      farmers: [],
      rating: 0,
      inStock: false,
      organic: false,
      searchQuery: ''
    });
    setSortOrder('default');
  }, [maxPrice]);
  
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category !== 'All') count++;
    if (filters.priceRange.min > 0 || filters.priceRange.max < maxPrice) count++;
    if (filters.farmers.length > 0) count++;
    if (filters.rating > 0) count++;
    if (filters.inStock) count++;
    if (filters.organic) count++;
    if (filters.searchQuery) count++;
    return count;
  }, [filters, maxPrice]);

  if (loading) {
    return <div className="text-center py-40">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-40 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            All Our Products
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Browse our full collection of fresh produce and artisanal goods from local farmers.
          </p>
        </div>
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search products, farmers, or descriptions..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              className="w-full p-4 pl-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6-414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              Advanced Filters
              {activeFilterCount > 0 && (
                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear All
              </button>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {filteredAndSortedProducts.length} products found
            </span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
            >
              <option value="default">Sort by: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A-Z</option>
              <option value="name-desc">Name: Z-A</option>
              <option value="rating-desc">Highest Rated</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className={`lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit ${showAdvancedFilters ? 'sticky top-24' : ''}`}>
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Category</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => updateFilter('category', category)}
                    className={`block w-full text-left px-4 py-2 rounded-md transition-colors ${filters.category === category ? 'bg-green-600 text-white font-bold' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Price Range</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>₹{filters.priceRange.min}</span>
                  <span>₹{filters.priceRange.max}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={filters.priceRange.min}
                  onChange={(e) => updateFilter('priceRange', { 
                    ...filters.priceRange, 
                    min: parseInt(e.target.value) 
                  })}
                  className="w-full"
                />
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={filters.priceRange.max}
                  onChange={(e) => updateFilter('priceRange', { 
                    ...filters.priceRange, 
                    max: parseInt(e.target.value) 
                  })}
                  className="w-full"
                />
              </div>
            </div>
            
             {showAdvancedFilters && (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Farmers</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {allFarmers.map(farmer => (
                      <label key={farmer} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.farmers.includes(farmer)}
                          onChange={() => toggleFarmer(farmer)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-gray-600">{farmer}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Minimum Rating</h3>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => updateFilter('rating', star)}
                        className={`p-1 ${filters.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                  {filters.rating > 0 && (
                    <button
                      onClick={() => updateFilter('rating', 0)}
                      className="text-sm text-red-600 hover:text-red-700 mt-2"
                    >
                      Clear rating
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => updateFilter('inStock', e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-600">In Stock Only</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.organic}
                      onChange={(e) => updateFilter('organic', e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-gray-600">Organic Only</span>
                  </label>
                </div>
              </>
            )}
          </aside>
          
          <main className="lg:col-span-3">
            {filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredAndSortedProducts.map((product: Product) => (
                  <div key={product._id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 group">
                    <div className="relative">
                      {/* 3. Use a placeholder for missing images */}
                      <img className="h-56 w-full object-cover" src={product.imageUrl || 'https://placehold.co/600x400/EEE/31343C?text=No+Image'} alt={product.name} />
                      {/* 4. Only show "Out of Stock" if inStock is explicitly false */}
                      {product.inStock === false && (
                        <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                          <span className="text-white font-bold text-lg bg-red-600 px-3 py-1 rounded">Out of Stock</span>
                        </div>
                      )}
                      {product.organic && (
                        <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-sm font-semibold">
                          Organic
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-gray-600 ml-1">{product.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">from {product.farmer}</p>
                      <p className="text-lg font-bold text-green-600 mt-4">{product.price}</p>
                      <Link 
                        to={`/product/${product._id}`}
                        className={`mt-6 block w-full text-center font-bold py-2 px-4 rounded-md transition-colors ${
                          product.inStock !== false 
                            ? 'bg-green-600 text-white hover:bg-green-700' 
                            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        }`}
                        onClick={(e) => product.inStock === false && e.preventDefault()}
                      >
                        {product.inStock !== false ? 'View Details' : 'Out of Stock'}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800">No Products Found</h2>
                <p className="text-gray-500 mt-2">Try adjusting your filters or check back later!</p>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
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