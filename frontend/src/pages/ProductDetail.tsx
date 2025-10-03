import  { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthenticationContext';

// --- 1. EXPANDED PRODUCT INTERFACE ---
// This now matches the full backend schema for all product types.
interface Product {
  _id: string;
  name: string;
  farmer: string;
  price: string;
  imageUrl: string;
  description: string;
  category: string;
  subCategory: string;
  buyType: 'direct_buy' | 'enquiry' | 'auction';
  auctionStartTime?: string;
  auctionEndTime?: string;
  startingBid?: number;
  currentPrice?: number;
  bids?: { bidder: string; amount: number; timestamp: string }[];
  inStock?: boolean;
}

// --- 2. DYNAMIC ACTION PANEL COMPONENTS ---

// -- Panel for Direct Buy products --
const DirectBuyPanel = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/cart');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border">
      <p className="text-4xl font-bold text-gray-900">{product.price}</p>
      {product.inStock !== false ? (
         <p className="text-sm font-semibold text-green-600 mt-1">In Stock</p>
      ) : (
         <p className="text-sm font-semibold text-red-600 mt-1">Out of Stock</p>
      )}
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <button 
          onClick={() => addToCart(product)}
          disabled={product.inStock === false}
          className="flex items-center justify-center w-full sm:w-auto border-2 border-green-600 text-green-600 font-bold py-3 px-6 rounded-full hover:bg-green-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add to Cart
        </button>
        <button 
          onClick={handleBuyNow}
          disabled={product.inStock === false}
          className="flex items-center justify-center w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

// -- Panel for Enquiry products --
const EnquiryPanel = () => {
  const navigate = useNavigate();
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border text-center">
      <p className="text-2xl font-bold text-gray-900">Available on Enquiry</p>
      <p className="text-gray-600 mt-2">Please contact us for pricing and availability.</p>
      <button 
        onClick={() => navigate('/contact')}
        className="mt-6 w-full bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg"
      >
        Send Enquiry
      </button>
    </div>
  );
};

// -- Panel for Auction products --
const AuctionPanel = ({ product, onBidSuccess }: { product: Product, onBidSuccess: (updatedProduct: Product) => void }) => {
  const { user } = useAuth();
  const [bidAmount, setBidAmount] = useState<number | ''>('');
  const [timeLeft, setTimeLeft] = useState('');
  const [auctionStatus, setAuctionStatus] = useState<'Upcoming' | 'Live' | 'Ended'>('Upcoming');
  const [error, setError] = useState('');
  const [isBidding, setIsBidding] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const startTime = new Date(product.auctionStartTime!);
      const endTime = new Date(product.auctionEndTime!);

      if (now < startTime) {
        setAuctionStatus('Upcoming');
        const diff = startTime.getTime() - now.getTime();
        setTimeLeft(`Starts in: ${Math.floor(diff / (1000 * 60 * 60 * 24))}d ${Math.floor((diff / (1000 * 60 * 60)) % 24)}h ${Math.floor((diff / 1000 / 60) % 60)}m`);
      } else if (now > endTime) {
        setAuctionStatus('Ended');
        setTimeLeft('Auction has ended');
        clearInterval(interval);
      } else {
        setAuctionStatus('Live');
        const diff = endTime.getTime() - now.getTime();
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${d}d ${h}h ${m}m ${s}s left`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [product.auctionStartTime, product.auctionEndTime]);
  
  const handlePlaceBid = async () => {
    if (!user) {
      setError('You must be logged in to place a bid.');
      return;
    }
    if (!bidAmount || bidAmount <= (product.currentPrice || 0)) {
      setError(`Your bid must be higher than the current price of ₹${product.currentPrice}.`);
      return;
    }

    setError('');
    setIsBidding(true);
    try {
      const response = await fetch(`http://localhost:5000/api/products/${product._id}/bids`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, amount: bidAmount }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to place bid.');
      }
      onBidSuccess(data); // Update the parent component's state
      setBidAmount(''); // Clear input on success
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsBidding(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900">Live Auction</h3>
        <span className={`px-3 py-1 text-sm font-bold rounded-full text-white ${
          auctionStatus === 'Live' ? 'bg-red-600 animate-pulse' : 
          auctionStatus === 'Upcoming' ? 'bg-blue-500' : 'bg-gray-500'
        }`}>
          {auctionStatus}
        </span>
      </div>
      <p className="text-center font-mono text-xl text-gray-700 my-4 bg-gray-100 p-2 rounded">{timeLeft}</p>
      
      <div className="flex justify-between text-lg mt-4">
        <span className="text-gray-600">Current Bid:</span>
        <span className="font-bold text-green-600">₹{product.currentPrice || product.startingBid}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>Number of bids:</span>
        <span>{product.bids?.length || 0}</span>
      </div>

      {auctionStatus === 'Live' && (
        <div className="mt-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-700">₹</span>
            <input 
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(Number(e.target.value))}
              placeholder={`Enter > ₹${product.currentPrice}`}
              className="w-full p-3 border-2 rounded-lg focus:ring-green-500 focus:border-green-500"
              disabled={isBidding}
            />
          </div>
          <button 
            onClick={handlePlaceBid}
            disabled={isBidding}
            className="mt-4 w-full bg-green-600 text-white font-bold py-3 px-8 rounded-full hover:bg-green-700 transition-all duration-300 shadow-lg disabled:bg-gray-400"
          >
            {isBidding ? 'Placing Bid...' : 'Place Bid'}
          </button>
          {error && <p className="text-red-600 text-sm mt-2 text-center">{error}</p>}
        </div>
      )}
    </div>
  );
};

// --- 3. MAIN PRODUCT DETAIL COMPONENT ---

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/products/${productId}`);
      if (!response.ok) throw new Error('Product not found');
      const data = await response.json();
      setProduct(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // Callback to update product state after a successful bid
  const handleBidSuccess = (updatedProduct: Product) => {
    setProduct(updatedProduct);
  };
  
  const renderActionPanel = (product: Product) => {
    switch (product.buyType) {
      case 'direct_buy':
        return <DirectBuyPanel product={product} />;
      case 'enquiry':
        return <EnquiryPanel />;
      case 'auction':
        return <AuctionPanel product={product} onBidSuccess={handleBidSuccess} />;
      default:
        return null;
    }
  };

  if (loading) return <div className="text-center py-40">Loading Product...</div>;
  if (error || !product) return <div className="text-center py-40 text-red-500">Error: {error || 'Product not found!'}</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Image */}
          <div className="bg-white p-4 rounded-lg shadow-xl sticky top-24">
            <img 
              src={product.imageUrl || 'https://placehold.co/600x400/EEE/31343C?text=No+Image'} 
              alt={product.name} 
              className="w-full h-auto aspect-square object-cover rounded-lg"
            />
          </div>

          {/* Right Column: Details */}
          <div className="flex flex-col space-y-8">
            <div>
              <div className="text-sm text-gray-500 mb-2">
                <Link to="/" className="hover:text-green-600">Home</Link>
                <span className="mx-2">/</span>
                <Link to="/products" className="hover:text-green-600">Products</Link>
                <span className="mx-2">/</span>
                <span>{product.category}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">{product.name}</h1>
              <p className="text-md text-gray-600 mt-2">From <span className="font-semibold text-green-700">{product.farmer}</span></p>
            </div>
            
            {renderActionPanel(product)}

            <div className="pt-6 border-t">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Product Description</h3>
                <p className="text-gray-700 text-lg leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
        
        {/* You can add a "Related Products" section here in the future */}
      </div>
    </div>
  );
};

export default ProductDetail;