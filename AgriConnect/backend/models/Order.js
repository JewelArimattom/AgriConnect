const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerDetails: {
    name: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true 
    },
    address: { 
      type: String, 
      required: true 
    }
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: { 
      type: String, 
      required: true 
    },
    quantity: { 
      type: Number, 
      required: true 
    },
    price: { 
      type: String, 
      required: true 
    }
  }],
  totalAmount: { 
    type: Number, 
    required: true 
  },
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered'],
    default: 'Pending'
  },
  farmer: { 
    type: String, 
    required: true 
  }
}, { 
  timestamps: true 
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;