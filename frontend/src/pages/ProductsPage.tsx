import { Link } from 'react-router-dom';
import { products } from '../data/products';

const ProductsPage = () => {
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

        {/* Responsive Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            // Product Card
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 group">
              <div className="h-56 w-full overflow-hidden">
                <img className="w-full h-full object-cover" src={product.imageUrl} alt={product.name} />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-500 mt-1">from {product.farmer}</p>
                <p className="text-lg font-bold text-green-600 mt-4">{product.price}</p>
                <Link 
                  to={`/product/${product.id}`}
                  className="mt-6 block w-full text-center bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
