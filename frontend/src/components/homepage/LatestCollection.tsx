// Define a type for our product data for TypeScript
type Product = {
  id: number;
  name: string;
  farmer: string;
  price: string;
  imageUrl: string;
};

// Demo data for our latest collection
const latestProducts: Product[] = [
  {
    id: 1,
    name: 'Organic Honey',
    farmer: 'Beekeeper Bob',
    price: '₹850/kg',
    imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=1974',
  },
  {
    id: 2,
    name: 'Fresh Strawberries',
    farmer: 'Sunnyside Farms',
    price: '₹300/box',
    imageUrl: 'https://images.unsplash.com/photo-1588257488975-115b3c20e5a9?q=80&w=1974',
  },
  {
    id: 3,
    name: 'Artisanal Cheese',
    farmer: 'The Happy Cow Dairy',
    price: '₹1200/kg',
    imageUrl: 'https://images.unsplash.com/photo-1486297678162-83b2160971b9?q=80&w=2070',
  },
  {
    id: 4,
    name: 'Heirloom Tomatoes',
    farmer: 'Green Valley Gardens',
    price: '₹250/kg',
    imageUrl: 'https://images.unsplash.com/photo-1561136594-7247da06a125?q=80&w=1974',
  },
];

const LatestCollection = () => {
  return (
    <div className="bg-lime-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl text-center mb-12">
          Our Latest Collection
        </h2>

        {/* Responsive Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {latestProducts.map((product) => (
            // Product Card
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <img className="h-56 w-full object-cover" src={product.imageUrl} alt={product.name} />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-500 mt-1">from {product.farmer}</p>
                <p className="text-lg font-bold text-green-600 mt-4">{product.price}</p>
                <button className="mt-6 w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                  View Product
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LatestCollection;