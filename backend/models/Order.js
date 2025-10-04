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
    phone: {
      type: String,
      required: true
    },
    preferredPickupTime: {
      type: String
    },
    paymentMethod: {
      type: String,
      enum: ['online', 'pickup'],
      default: 'pickup'
    },
    specialInstructions: {
      type: String
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
    enum: ['Confirmed', 'Ready for Pickup', 'Completed'],
    default: 'Confirmed'
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