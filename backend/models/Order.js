const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerDetails: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  products: [
    {
      productId: { type: String, required: true }, 
      name: { type: String, required: true },
      price: { type: String, required: true },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  farmer: { 
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
}, {
  timestamps: true, 
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

