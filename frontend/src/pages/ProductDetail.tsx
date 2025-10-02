import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';


// Define a type for the product data coming from the backend
interface Product {
  _id: string;
  name: string;
  farmer: string;
  price: string;
  imageUrl: string;
  description: string;
  category: string;
}

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  // State for the product, loading status, and errors
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch the specific product from the backend when the component mounts
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]); // Rerun the effect if the productId changes

  const handleBuyNow = () => {
    if (product) {
      addToCart(product);
      navigate('/cart');
    }
  };

  // Handle loading and error states
  if (loading) {
    return <div className="text-center py-20">Loading product details...</div>;
  }

  if (error || !product) {
    return <div className="text-center py-20 text-red-500">Error: {error || 'Product not found!'}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-auto aspect-square object-cover rounded-lg"
            />
          </div>

          <div className="flex flex-col space-y-6">
            <div className="text-sm text-gray-500">
              <Link to="/products" className="hover:text-green-600">Products</Link>
              <span className="mx-2">/</span>
              <span>{product.category}</span>
            </div>

            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">{product.name}</h1>
              <p className="text-md text-gray-600 mt-2">From <span className="font-semibold text-green-700">{product.farmer}</span></p>
            </div>
            
            <p className="text-gray-700 text-lg leading-relaxed">{product.description}</p>

            <div className="pt-4 border-t space-y-4">
              <p className="text-4xl font-bold text-gray-900">{product.price}</p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => addToCart(product)}
                  className="flex items-center justify-center w-full sm:w-auto border-2 border-green-600 text-green-600 font-bold py-3 px-6 rounded-full hover:bg-green-50 transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add to Cart
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="flex items-center justify-center w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
