import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface CartItem {
  _id: string;
  id: number; 
  price: string;
  farmer: string;
  imageUrl: string;
}

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    cardNumber: '', 
  });

  const subtotal = (cartItems as CartItem[]).reduce((total, item) => {
    const price = parseFloat(item.price.replace('₹', ''));
    return total + (isNaN(price) ? 0 : price);
  }, 0);

  const shippingCost = subtotal > 0 ? 50.00 : 0;
  const total = subtotal + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      setIsLoading(false);
      return;
    }
    
    
    const farmerName = (cartItems[0] as CartItem)?.farmer;

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerDetails: {
            name: formData.name,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
          },
          products: (cartItems as CartItem[]).map(item => ({
            productId: item._id, 
            name: item.name,
            price: item.price,
          })),
          totalAmount: total,
          farmer: farmerName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order.');
      }

      clearCart();
      navigate('/order-success');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">Checkout</h1>
        {error && <p className="text-center text-red-600 mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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
              <h2 className="text-xl font-semibold mb-4">Payment Details (Dummy)</h2>
              <div className="space-y-4">
                <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} placeholder="Card Number" required className="w-full p-3 border rounded-md" />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            <div className="space-y-4">
              {(cartItems as CartItem[]).map(item => (
                <div key={item._id} className="flex justify-between items-center">
                  <span>{item.name}</span>
                  <span className="font-semibold">{item.price}</span>
                </div>
              ))}
            </div>
            <div className="border-t my-6"></div>
            <div className="space-y-4 text-gray-700">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>₹{shippingCost.toFixed(2)}</span></div>
            </div>
            <div className="border-t my-6"></div>
            <div className="flex justify-between text-xl font-bold"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
            <button type="submit" disabled={isLoading} className="mt-8 w-full bg-green-600 text-white font-bold py-3 px-6 rounded-md hover:bg-green-700 disabled:bg-gray-400">
              {isLoading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
