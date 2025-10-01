import { Link, useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const product = products.find(p => p.id === parseInt(productId || ''));
  const { addToCart } = useCart();
  const navigate = useNavigate(); 

  const handleBuyNow = () => {
    addToCart(product!); 
    navigate('/cart');      
  };

  if (!product) {
    return (
      <div className="p-8 text-center min-h-screen">
        <h1 className="text-2xl font-bold">Product not found!</h1>
      </div>
    );
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