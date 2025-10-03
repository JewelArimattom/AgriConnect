import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface AnimalProduct {
  _id: string;
  name: string;
  farm?: string; 
  price: string;
  imageUrl: string;
  subCategory: string;
  buyType: 'direct_buy' | 'enquiry' | 'auction'; 
  startingBid?: number; 
}

const ProductPrice = ({ product }: { product: AnimalProduct }) => {
  switch (product.buyType) {
    case 'direct_buy':
      return <p className="text-lg font-bold text-amber-700 mt-4">{product.price}</p>;
    case 'auction':
      return <p className="text-sm text-gray-700 mt-4">Starts at: <span className="font-bold text-amber-700 text-lg">{product.startingBid}</span></p>;
    case 'enquiry':
      return <p className="text-md font-semibold text-blue-600 mt-4">Contact for Price</p>;
    default:
      return null;
  }
};

const AnimalProducts = () => {
  const [products, setProducts] = useState<AnimalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnimalProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/animal-products');
        if (!response.ok) {
          throw new Error('Failed to fetch animal products from the server.');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimalProducts();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-lg font-semibold">Loading animal products...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="bg-amber-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl text-center mb-12">
          Our Animal-Based Products
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <img className="h-56 w-full object-cover" src={product.imageUrl} alt={product.name} />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                {product.farm && (
                  <p className="text-sm text-gray-500 mt-1">from {product.farm}</p>
                )}
                <ProductPrice product={product} />
                <Link 
                  to={`/product/${product._id}`}
                  className="mt-6 block w-full text-center bg-amber-600 text-white font-bold py-2 px-4 rounded-md hover:bg-amber-700 transition-colors"
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

export default AnimalProducts;