import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

interface Tool {
  _id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  pricePerDay: number;
  location: string;
  available: boolean;
  listedBy: {
    _id: string;
    name: string;
  };
}

const ToolDetailPage = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTool = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/tools/${toolId}`);
        if (!response.ok) throw new Error('Tool not found');
        const data = await response.json();
        setTool(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTool();
  }, [toolId]);

  if (loading) return <div className="text-center py-40">Loading Tool Details...</div>;
  if (error || !tool) return <div className="text-center py-40 text-red-500">Error: {error || 'Tool not found!'}</div>;

  const mapSrc = `http://googleusercontent.com/maps.google.com/5`;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-sm text-gray-500 mb-4">
          <Link to="/rent-tools" className="hover:text-green-600">Rent Tools</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{tool.name}</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3">
            <div className="bg-white p-4 rounded-lg shadow-xl sticky top-24">
              <div className="relative">
                <img src={tool.imageUrl || 'https://placehold.co/600x400/EEE/31343C?text=No+Image'} alt={tool.name} className="w-full h-auto aspect-video object-cover rounded-lg" />
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold text-white ${tool.available ? 'bg-green-600' : 'bg-red-600'}`}>
                  {tool.available ? 'Available' : 'Rented Out'}
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 flex flex-col space-y-6">
            <h1 className="text-4xl font-extrabold text-gray-900">{tool.name}</h1>
            <div className="p-6 bg-white rounded-lg shadow-lg border">
              <div className="space-y-4">
                <div className="flex justify-between items-center"><span className="text-gray-600">Category:</span><span className="font-semibold text-gray-800">{tool.category}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-600">Location:</span><span className="font-semibold text-gray-800">{tool.location}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-600">Listed by:</span><span className="font-semibold text-green-700">{tool.listedBy.name}</span></div>
                <div className="pt-4 border-t flex justify-between items-baseline"><span className="text-gray-600">Rental Price:</span><p className="text-3xl font-bold text-gray-900">₹{tool.pricePerDay.toLocaleString('en-IN')}<span className="text-lg font-normal text-gray-500">/day</span></p></div>
              </div>
            </div>
            <div className="pt-6"><h3 className="text-xl font-bold text-gray-800 mb-2">Description</h3><p className="text-gray-700 leading-relaxed">{tool.description || "No description provided."}</p></div>
            <div className="pt-4">
              <button disabled={!tool.available} className="w-full bg-green-600 text-white font-bold py-4 px-8 rounded-full hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed">
                {tool.available ? 'Contact Owner & Rent' : 'Currently Unavailable'}
              </button>
            </div>
          </div>
        </div>
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tool Location</h2>
          <div className="rounded-lg shadow-xl overflow-hidden"><iframe src={mapSrc} width="100%" height="400" style={{ border: 0 }} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe></div>
        </div>
      </div>
    </div>
  );
};

export default ToolDetailPage;