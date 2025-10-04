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
      'Produce',
      'Animal Products', 
      'Bakery',
      'Pantry',
      'Artisanal Goods',
      'Plants & Flowers'
    ]
  },
  subCategory: {
    type: String,
  },
  buyType: {
    type: String,
    required: true,
    enum: ['direct_buy', 'enquiry', 'auction'],
    default: 'direct_buy'
  },
  price: { 
    type: String, 
    required: function() { return this.buyType === 'direct_buy'; }
  },
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
  currentPrice: {
    type: Number,
  },
  highestBidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  bids: [
    {
      bidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      amount: {
        type: Number,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ],
  inStock: {
    type: Boolean,
    default: true
  },
  organic: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true 
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;