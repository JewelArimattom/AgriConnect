import { useParams } from 'react-router-dom';
import { products } from '../data/products'; // Import your product data

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();

  const product = products.find(p => p.id === parseInt(productId || ''));

  if (!product) {
    return (
      <div className="p-8 text-center min-h-screen">
        <h1 className="text-2xl font-bold">Product not found!</h1>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          
          {/* Image Column */}
          <div>
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Details Column */}
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase">{product.category}</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">{product.name}</h1>
            <p className="text-md text-gray-600 mt-2">From <span className="font-semibold">{product.farmer}</span></p>
            <p className="text-3xl font-bold text-green-600 my-4">{product.price}</p>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
            <button className="mt-8 w-full bg-green-600 text-white font-bold py-3 px-6 rounded-md hover:bg-green-700 transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;