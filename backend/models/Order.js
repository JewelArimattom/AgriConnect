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
      productId: { type: String, required: true }, // In a real app, this would be mongoose.Schema.Types.ObjectId
      name: { type: String, required: true },
      price: { type: String, required: true },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  farmer: { // To associate the order with the farmer whose products were purchased
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

