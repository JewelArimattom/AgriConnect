import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthenticationContext';

// --- Reusable Modal Component (no changes needed here) ---
const ListToolModal = ({ onClose, onAddTool }: { onClose: () => void, onAddTool: (tool: Omit<Tool, '_id' | 'available' | 'listedBy'>) => void }) => {
    // ... same modal code as before
    const [formData, setFormData] = useState({ name: '', category: 'Tractors' as Tool['category'], imageUrl: '', pricePerDay: '', location: '', description: '' });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.pricePerDay || !formData.location) { alert('Please fill out all required fields.'); return; }
        onAddTool({ ...formData, pricePerDay: parseFloat(formData.pricePerDay) });
        onClose();
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">List Your Tool for Rent</h2><button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl">&times;</button></div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="name" value={formData.name} onChange={handleChange} placeholder="Tool Name (e.g., Compact Tractor)" required className="w-full p-3 border rounded-md"/>
                    <select name="category" value={formData.category} onChange={handleChange} required className="w-full p-3 border bg-white rounded-md">
                        <option value="Tractors">Tractors</option><option value="Harvesting">Harvesting Equipment</option><option value="Soil Preparation">Soil Preparation</option><option value="Seeding & Planting">Seeding & Planting</option>
                    </select>
                    <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Image URL (optional)" className="w-full p-3 border rounded-md"/>
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Tool Description" rows={3} className="w-full p-3 border rounded-md"></textarea>
                    <input name="pricePerDay" value={formData.pricePerDay} onChange={handleChange} placeholder="Price per Day (e.g., 5000)" type="number" required className="w-full p-3 border rounded-md"/>
                    <input name="location" value={formData.location} onChange={handleChange} placeholder="Your Location (e.g., Pala, Kottayam)" required className="w-full p-3 border rounded-md"/>
                    <button type="submit" className="w-full py-3 px-4 bg-green-600 text-white font-bold rounded-md hover:bg-green-700">List My Tool</button>
                </form>
            </div>
        </div>
    );
};

interface Tool {
  _id: string; // Use _id to match MongoDB
  name: string;
  category: 'Tractors' | 'Harvesting' | 'Soil Preparation' | 'Seeding & Planting';
  imageUrl: string;
  pricePerDay: number;
  location: string;
  available: boolean;
  description?: string;
  listedBy: { _id: string; name: string; };
}

const RentToolsPage = () => {
  const { user } = useAuth();
  const [tools, setTools] = useState<Tool[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState(false);
  const [sortOrder, setSortOrder] = useState('default');

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/tools');
        if (!response.ok) throw new Error('Failed to fetch tools.');
        const data = await response.json();
        setTools(data);
      } catch (err: any) { setError(err.message); } finally { setLoading(false); }
    };
    fetchTools();
  }, []);

  const categories = useMemo(() => ['All', ...Array.from(new Set(tools.map(t => t.category)))], [tools]);

  const handleAddTool = async (newToolData: Omit<Tool, '_id' | 'available' | 'listedBy'>) => {
    if (!user) { alert("You must be logged in to list a tool."); return; }
    const payload = { ...newToolData, listedBy: user._id };
    try {
      const response = await fetch('http://localhost:5000/api/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Failed to list the tool.');
      const savedTool = await response.json();
      // To show the owner's name immediately, we can add it from the logged-in user context
      const toolWithOwner = { ...savedTool, listedBy: { _id: user._id, name: user.name }};
      setTools(prevTools => [toolWithOwner, ...prevTools]);
    } catch (err: any) { alert(err.message); }
  };

  const filteredAndSortedTools = useMemo(() => {
    let filtered = [...tools];
    if (categoryFilter !== 'All') { filtered = filtered.filter(tool => tool.category === categoryFilter); }
    if (availabilityFilter) { filtered = filtered.filter(tool => tool.available); }
    switch (sortOrder) {
      case 'price-asc': filtered.sort((a, b) => a.pricePerDay - b.pricePerDay); break;
      case 'price-desc': filtered.sort((a, b) => b.pricePerDay - a.pricePerDay); break;
      default: break;
    }
    return filtered;
  }, [tools, categoryFilter, availabilityFilter, sortOrder]);

  if(loading) return <div className="text-center py-40">Loading Tools...</div>;
  if(error) return <div className="text-center py-40 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left mb-12">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Farming Equipment Rentals</h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500">Find the right tools to boost your farm's productivity and efficiency.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="mt-6 sm:mt-0 whitespace-nowrap bg-green-600 text-white font-bold py-3 px-6 rounded-full hover:bg-green-700 transition-all duration-300 shadow-lg">+ List Your Tool</button>
        </div>
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm text-gray-600">{filteredAndSortedTools.length} tools found</span>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500">
            <option value="default">Sort by: Default</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option>
          </select>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Filters</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Category</h3>
                <div className="space-y-2">
                  {categories.map(cat => ( <button key={cat} onClick={() => setCategoryFilter(cat)} className={`block w-full text-left px-4 py-2 rounded-md transition-colors ${categoryFilter === cat ? 'bg-green-600 text-white font-bold' : 'text-gray-600 hover:bg-gray-100'}`}>{cat}</button>))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Availability</h3>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.checked)} className="rounded border-gray-300 text-green-600 focus:ring-green-500"/>
                  <span className="text-gray-600">Show Available Only</span>
                </label>
              </div>
            </div>
          </aside>
          <main className="lg:col-span-3">
            {filteredAndSortedTools.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredAndSortedTools.map((tool) => (
                  <div key={tool._id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 group">
                    <div className="relative">
                      <img className="h-56 w-full object-cover" src={tool.imageUrl || 'https://placehold.co/600x400/EEE/31343C?text=No+Image'} alt={tool.name} />
                      <div className={`absolute top-2 right-2 px-2 py-1 rounded text-sm font-semibold text-white ${tool.available ? 'bg-green-600' : 'bg-red-600'}`}>{tool.available ? 'Available' : 'Rented Out'}</div>
                    </div>
                    <div className="p-6">
                      <p className="text-sm text-gray-500">{tool.category}</p>
                      <h3 className="text-xl font-semibold text-gray-800 mt-1">{tool.name}</h3>
                      <p className="text-sm text-gray-500 mt-2">Location: {tool.location}</p>
                      <p className="text-2xl font-bold text-green-600 mt-4">₹{tool.pricePerDay.toLocaleString('en-IN')}<span className="text-sm font-normal text-gray-500">/day</span></p>
                      <Link to={`/rent-tools/${tool._id}`} className={`mt-6 block w-full text-center font-bold py-2 px-4 rounded-md transition-colors ${tool.available ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-400 text-gray-200 cursor-not-allowed'}`} onClick={(e) => !tool.available && e.preventDefault()}>
                        {tool.available ? 'View Details' : 'Unavailable'}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : ( <div className="text-center py-20 bg-white rounded-lg shadow-md"><h2 className="text-2xl font-bold text-gray-800">No Tools Found</h2><p className="text-gray-500 mt-2">Try adjusting your filters or check back later!</p></div> )}
          </main>
        </div>
      </div>
      {isModalOpen && <ListToolModal onClose={() => setIsModalOpen(false)} onAddTool={handleAddTool} />}
    </div>
  );
};

export default RentToolsPage;