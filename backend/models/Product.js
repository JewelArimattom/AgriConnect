const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  imageUrl: { 
    type: String, 
    required: true 
  },
  farmer: { 
    type: String, 
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Fresh Produce',
      'Dairy & Eggs',
      'Meat & Poultry',
      'Bakery',
      'Pantry Staples',
      'Plants & Flowers',
      'Artisanal Goods'
    ]
  },
  buyType: {
    type: String,
    required: true,
    enum: ['direct_buy', 'enquiry', 'auction'],
    default: 'direct_buy'
  },
  // Price is only required for 'direct_buy'
  price: { 
    type: String, 
    required: function() { return this.buyType === 'direct_buy'; }
  },
  // Auction-specific fields
  auctionStartTime: {
    type: Date,
    required: function() { return this.buyType === 'auction'; }
  },
  auctionEndTime: {
    type: Date,
    required: function() { return this.buyType === 'auction'; }
  },
  startingBid: {
    type: Number,
    required: function() { return this.buyType === 'auction'; }
  },
}, {
  timestamps: true 
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

