import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthenticationContext';

// The URL for your backend API endpoint to create products
const API_URL = 'http://localhost:5000/api/products';

const SellYourProduct = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get the currently logged-in user

  // A single state object to manage all form fields
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    category: 'Fresh Produce',
    buyType: 'direct_buy',
    price: '',
    startingBid: '',
    auctionEndTime: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // A single handler to update the form data state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!user) {
      setError('You must be logged in to sell a product.');
      setIsLoading(false);
      return;
    }

    // Construct the payload based on the form data
    const payload = {
      ...formData,
      farmer: user.name, // Assign the product to the logged-in user
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit product.');
      }

      alert('Product submitted successfully!');
      navigate('/dashboard'); // Redirect to the dashboard on success
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-extrabold text-center mb-6">List a New Product</h2>
        {error && <p className="text-center text-sm text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Details */}
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Product Name (e.g., Organic Apples)" required className="w-full p-3 border rounded-md"/>
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Detailed Description" required rows={4} className="w-full p-3 border rounded-md"></textarea>
          <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Image URL" required className="w-full p-3 border rounded-md"/>

          {/* Category Dropdown */}
          <select name="category" value={formData.category} onChange={handleChange} required className="w-full p-3 border bg-white rounded-md">
            <option value="Fresh Produce">Fresh Produce</option>
            <option value="Dairy & Eggs">Dairy & Eggs</option>
            <option value="Meat & Poultry">Meat & Poultry</option>
            <option value="Bakery">Bakery</option>
            <option value="Pantry Staples">Pantry Staples</option>
            <option value="Plants & Flowers">Plants & Flowers</option>
            <option value="Artisanal Goods">Artisanal Goods</option>
          </select>

          {/* Buy Type Selection */}
          <select name="buyType" value={formData.buyType} onChange={handleChange} required className="w-full p-3 border bg-white rounded-md">
            <option value="direct_buy">Direct Buy</option>
            <option value="enquiry">Send Enquiry</option>
            <option value="auction">Live Auction</option>
          </select>

          {/* --- Conditional Fields --- */}
          {formData.buyType === 'direct_buy' && (
            <input name="price" value={formData.price} onChange={handleChange} placeholder="Price (e.g., ₹250/kg)" required className="w-full p-3 border rounded-md"/>
          )}

          {formData.buyType === 'auction' && (
            <div className="space-y-4 p-4 border rounded-md bg-gray-50">
              <input name="startingBid" value={formData.startingBid} onChange={handleChange} placeholder="Starting Bid (e.g., 100)" type="number" required className="w-full p-3 border rounded-md"/>
              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Auction End Time</label>
                 <input name="auctionEndTime" value={formData.auctionEndTime} onChange={handleChange} type="datetime-local" required className="w-full p-3 border rounded-md"/>
              </div>
            </div>
          )}

          {formData.buyType === 'enquiry' && (
             <div className="p-4 border rounded-md bg-blue-50 text-blue-800 text-sm">
                Customers will be able to send you an enquiry about this product.
             </div>
          )}

          <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 disabled:bg-gray-400">
            {isLoading ? 'Submitting...' : 'Submit Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellYourProduct;

