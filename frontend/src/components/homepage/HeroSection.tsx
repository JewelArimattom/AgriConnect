import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

const HeroSection = () => {
  const [location, setLocation] = useState('');
  const [product, setProduct] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?location=${location}&product=${product}`);
  };

  return (
    <div className="bg-green-50 text-center py-12 px-4 sm:py-20">
      
      <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
        Connect Directly with Local Farmers
      </h1>
      <p className="text-md md:text-lg text-gray-600 mb-8">
        Find fresh, local produce right from the source.
      </p>
      
      <form 
        onSubmit={handleSearch}
        className="max-w-xl mx-auto flex flex-col sm:flex-row gap-2"
      >
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter your Village/Town..."
          className="flex-grow p-3 border rounded-md"
          required
        />
        <input
          type="text"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="e.g., 'Organic Tomatoes'"
          className="p-3 border rounded-md"
        />
        <button 
          type="submit" 
          className="bg-green-600 text-white font-bold py-3 px-6 rounded-md hover:bg-green-700"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default HeroSection;