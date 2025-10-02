import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// 1. Define a TypeScript type for the product data coming from the backend
interface Product {
  _id: string; // MongoDB uses _id instead of id
  name: string;
  farmer: string;
  price: string;
  imageUrl: string;
}

const LatestCollection = () => {
  // 2. Set up state for products, loading status, and errors
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 3. Use useEffect to fetch data from your backend API when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products from the server.');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // The empty array ensures this effect runs only once

  // 4. Handle loading and error states to provide user feedback
  if (loading) {
    return <div className="text-center py-20 text-lg font-semibold">Loading fresh products...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="bg-lime-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl text-center mb-12">
          Our Latest Collection
        </h2>
        
        {/* 5. Map over the products from state (fetched from backend) to display them */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <img className="h-56 w-full object-cover" src={product.imageUrl} alt={product.name} />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-500 mt-1">from {product.farmer}</p>
                <p className="text-lg font-bold text-green-600 mt-4">{product.price}</p>
                <Link 
                  to={`/product/${product._id}`} // Use _id for the link to the detail page
                  className="mt-6 block w-full text-center bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                >
                  View Product
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LatestCollection;

