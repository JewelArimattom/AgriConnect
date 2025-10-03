// LatestCollection.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Product {
  _id: string; 
  name: string;
  farmer: string;
  price: string;
  imageUrl: string;
}

const LatestCollection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) throw new Error('Failed to fetch products.');
        const data = await response.json();
        setProducts(data.slice(0, 4));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []); 

  if (loading) return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mx-auto mb-4 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 animate-pulse border border-gray-200">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="text-red-600 bg-red-50 rounded-lg p-8">
          <p className="text-lg font-semibold">Unable to load products</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Harvest</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Freshly picked produce and new arrivals from our partner farms
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div 
              key={product._id} 
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              <div className="relative overflow-hidden">
                <img 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                  src={product.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'} 
                  alt={product.name} 
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded">New</span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">By {product.farmer}</p>
                
                <div className="flex justify-between items-center mt-4">
                  <span className="text-lg font-bold text-gray-900">{product.price}</span>
                  <Link 
                    to={`/product/${product._id}`} 
                    className="bg-gray-900 text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            to="/products" 
            className="inline-flex items-center text-green-600 font-medium hover:text-green-700 transition-colors duration-200"
          >
            Browse all products
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LatestCollection;