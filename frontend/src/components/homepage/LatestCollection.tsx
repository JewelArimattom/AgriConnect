import { Link } from 'react-router-dom'; 
import { products } from '../../data/products';

const LatestCollection = () => {
  return (
    <div className="bg-lime-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl text-center mb-12">
          Our Latest Collection
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <img className="h-56 w-full object-cover" src={product.imageUrl} alt={product.name} />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-500 mt-1">from {product.farmer}</p>
                <p className="text-lg font-bold text-green-600 mt-4">{product.price}</p>
                
                <Link 
                  to={`/product/${product.id}`}
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