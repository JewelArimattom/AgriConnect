export interface Product {
  id: number;
  name: string;
  farmer: string;
  price: string;
  imageUrl: string;
  description: string;
  category: string;
  
}

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
  {
    id: 5,
    name: 'Sourdough Bread',
    farmer: 'The Grain Mill',
    price: '₹450/loaf',
    imageUrl: 'https://images.unsplash.com/photo-1534620808146-d33bb39128b2?q=80&w=1974',
    description: 'A crusty, rustic loaf of naturally leavened sourdough bread, made with organic whole wheat flour.',
    category: 'Bakery',
  },
  {
    id: 6,
    name: 'Free-Range Eggs',
    farmer: 'Clucky\'s Coop',
    price: '₹180/dozen',
    imageUrl: 'https://images.unsplash.com/photo-1598965672252-0857154941a3?q=80&w=1974',
    description: 'Farm-fresh eggs from happy, free-roaming chickens. Rich yolks and unbeatable flavor.',
    category: 'Dairy',
  },
  {
    id: 7,
    name: 'Crisp Apples',
    farmer: 'Orchard Grove',
    price: '₹220/kg',
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b69665?q=80&w=1971',
    description: 'Sweet and crunchy apples, perfect for snacking, baking, or making fresh cider. A seasonal favorite.',
    category: 'Fruits',
  },
  {
    id: 8,
    name: 'Organic Carrots',
    farmer: 'Green Valley Gardens',
    price: '₹150/kg',
    imageUrl: 'https://images.unsplash.com/photo-1590422229566-1a85f86384a3?q=80&w=1974',
    description: 'Vibrant and sweet organic carrots, pulled fresh from the soil. Excellent raw or cooked.',
    category: 'Vegetables',
  },
];