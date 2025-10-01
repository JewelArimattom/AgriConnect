import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  // State for form inputs
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => {
    const price = parseFloat(item.price.replace('₹', ''));
    return total + price;
  }, 0);

  const shippingCost = subtotal > 0 ? 50.00 : 0; // Example shipping cost
  const total = subtotal + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (cartItems.length === 0 || !formData.name || !formData.address || !formData.cardNumber) {
      alert('Please fill in all required fields and make sure your cart is not empty.');
      return;
    }
    
    // Simulate order placement
    console.log('Order placed:', {
      customer: formData,
      items: cartItems,
      total: total.toFixed(2),
    });

    alert('Order placed successfully!');
    clearCart();
    navigate('/order-success');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Checkout</h1>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Shipping & Payment Form */}
          <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <div className="space-y-4">
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" required className="w-full p-3 border rounded-md" />
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Address" required className="w-full p-3 border rounded-md" />
                <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City" required className="w-full p-3 border rounded-md" />
                <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} placeholder="Postal Code" required className="w-full p-3 border rounded-md" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
              <div className="space-y-4">
                <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} placeholder="Card Number" required className="w-full p-3 border rounded-md" />
                <input type="text" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} placeholder="MM/YY" required className="w-full p-3 border rounded-md" />
                <input type="text" name="cvv" value={formData.cvv} onChange={handleInputChange} placeholder="CVV" required className="w-full p-3 border rounded-md" />
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <span>{item.name}</span>
                  <span className="font-semibold">{item.price}</span>
                </div>
              ))}
            </div>
            <div className="border-t my-6"></div>
            <div className="space-y-4 text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shippingCost.toFixed(2)}</span>
              </div>
            </div>
            <div className="border-t my-6"></div>
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <button type="submit" className="mt-8 w-full bg-green-600 text-white font-bold py-3 px-6 rounded-md hover:bg-green-700 transition-colors">
              Place Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;