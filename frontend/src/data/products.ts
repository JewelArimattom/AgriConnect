// Define the TypeScript type for a single product
export interface Product {
  id: number;
  name: string;
  farmer: string;
  price: string;
  imageUrl: string;
  description: string;
  category: string;
}

// Export the array of product data
export const products: Product[] = [
  {
    id: 1,
    name: 'Organic Honey',
    farmer: 'Beekeeper Bob',
    price: '₹850/kg',
    imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=1974',
    description: 'Pure, raw, and unfiltered honey sourced from wildflowers. A healthy and delicious natural sweetener.',
    category: 'Pantry',
  },
  {
    id: 2,
    name: 'Fresh Strawberries',
    farmer: 'Sunnyside Farms',
    price: '₹300/box',
    imageUrl: 'https://images.unsplash.com/photo-1588257488975-115b3c20e5a9?q=80&w=1974',
    description: 'Juicy, sweet strawberries picked at the peak of ripeness. Perfect for desserts, smoothies, or eating fresh.',
    category: 'Fruits',
  },
  {
    id: 3,
    name: 'Artisanal Cheese',
    farmer: 'The Happy Cow Dairy',
    price: '₹1200/kg',
    imageUrl: 'https://images.unsplash.com/photo-1486297678162-83b2160971b9?q=80&w=2070',
    description: 'Aged cheddar cheese with a sharp, nutty flavor. Handcrafted using traditional methods from fresh cow\'s milk.',
    category: 'Dairy',
  },
  {
    id: 4,
    name: 'Heirloom Tomatoes',
    farmer: 'Green Valley Gardens',
    price: '₹250/kg',
    imageUrl: 'https://images.unsplash.com/photo-1561136594-7247da06a125?q=80&w=1974',
    description: 'A colorful assortment of heirloom tomatoes, bursting with flavor. Far superior to your average supermarket tomato.',
    category: 'Vegetables',
  },
];