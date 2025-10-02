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
    imageUrl: 'https://www.allrecipes.com/thmb/oG4LKyxXjFehRf46rtksge5ep84=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/How-To-Store-Strawberries-4x3-1615f2fed54d4215ba9e831a52c18ff6.jpg',
    description: 'Juicy, sweet strawberries picked at the peak of ripeness. Perfect for desserts, smoothies, or eating fresh.',
    category: 'Fruits',
  },
  {
    id: 3,
    name:  'Cheese',
    farmer: 'The Happy Cow Dairy',
    price: '₹1200/kg',
    imageUrl: 'https://img.freepik.com/free-photo/beautiful-cheeses-kitchen-cheese-food-preparing-concept_1150-13539.jpg',
    description: 'Aged cheddar cheese with a sharp, nutty flavor. Handcrafted using traditional methods from fresh cow\'s milk.',
    category: 'Dairy',
  },
  {
    id: 4,
    name: 'Tomatoes',
    farmer: 'Green Valley Gardens',
    price: '₹250/kg',
    imageUrl: 'https://tagawagardens.com/wp-content/uploads/2023/08/TOMATOES-RED-RIPE-VINE-SS-1-scaled.jpg',
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
    name: 'Eggs',
    farmer: 'Clucky\'s Coop',
    price: '₹180/dozen',
    imageUrl: 'https://cdn.wikifarmer.com/images/detailed/2023/09/iStock-1068858270.jpg',
    description: 'Farm-fresh eggs from happy, free-roaming chickens. Rich yolks and unbeatable flavor.',
    category: 'Dairy',
  },
  {
    id: 7,
    name: 'Apples',
    farmer: 'Orchard Grove',
    price: '₹220/kg',
    imageUrl: 'https://www.nirvanaorganic.in/cdn/shop/articles/matheus-cenali-wXuzS9xR49M-unsplash.jpg?v=1714462540&width=1500',
    description: 'Sweet and crunchy apples, perfect for snacking, baking, or making fresh cider. A seasonal favorite.',
    category: 'Fruits',
  },
  {
    id: 8,
    name: 'Carrots',
    farmer: 'Green Valley Gardens',
    price: '₹150/kg',
    imageUrl: 'https://www.trustbasket.com/cdn/shop/articles/Carrot.jpg?v=1688378789',
    description: 'Vibrant and sweet organic carrots, pulled fresh from the soil. Excellent raw or cooked.',
    category: 'Vegetables',
  },
];