import { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthenticationContext';

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
  farmLocation?: string;
  harvestDate?: string;
  organic?: boolean;
  certifications?: string[];
}

// Badge component for product status
const StatusBadge = ({ type, status }: { type: string, status?: string }) => {
  const getBadgeConfig = () => {
    switch (type) {
      case 'stock':
        return status === 'inStock' 
          ? { color: 'bg-green-100 text-green-800', text: 'In Stock' }
          : { color: 'bg-red-100 text-red-800', text: 'Out of Stock' };
      case 'organic':
        return { color: 'bg-emerald-100 text-emerald-800', text: 'Organic' };
      case 'auction':
        return status === 'Live' 
          ? { color: 'bg-red-100 text-red-800 animate-pulse', text: 'Live Auction' }
          : status === 'Upcoming'
          ? { color: 'bg-blue-100 text-blue-800', text: 'Upcoming' }
          : { color: 'bg-gray-100 text-gray-800', text: 'Ended' };
      case 'enquiry':
        return { color: 'bg-blue-100 text-blue-800', text: 'Contact for Price' };
      default:
        return { color: 'bg-gray-100 text-gray-800', text: type };
    }
  };

  const config = getBadgeConfig();
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.text}
    </span>
  );
};

// Enhanced Direct Buy Panel
const DirectBuyPanel = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/cart');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
      <div className="flex items-baseline gap-2 mb-4">
        <p className="text-4xl font-bold text-gray-900">{product.price}</p>
        {product.organic && <StatusBadge type="organic" />}
      </div>
      
      <StatusBadge type="stock" status={product.inStock !== false ? 'inStock' : 'outOfStock'} />
      
      <div className="mt-6 space-y-4">
        <button 
          onClick={() => addToCart(product)}
          disabled={product.inStock === false}
          className="w-full flex items-center justify-center gap-2 border-2 border-green-600 text-green-600 font-semibold py-4 px-6 rounded-xl hover:bg-green-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add to Cart
        </button>
        <button 
          onClick={handleBuyNow}
          disabled={product.inStock === false}
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-4 px-6 rounded-xl hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Buy Now
        </button>
      </div>

      {/* Trust indicators */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Quality Guaranteed
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Farm Fresh
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Enquiry Panel
const EnquiryPanel = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Available on Enquiry</h3>
      <p className="text-gray-600 mb-6">Contact us for custom pricing and bulk availability.</p>
      <button 
        onClick={() => navigate('/contact')}
        className="w-full bg-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        Send Enquiry
      </button>
    </div>
  );
};

// Enhanced Auction Panel
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
      onBidSuccess(data);
      setBidAmount('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsBidding(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Live Auction</h3>
        <StatusBadge type="auction" status={auctionStatus} />
      </div>
      
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <p className="text-center font-mono text-lg text-gray-700">{timeLeft}</p>
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Current Bid:</span>
          <span className="text-2xl font-bold text-green-600">₹{product.currentPrice || product.startingBid}</span>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Starting Bid:</span>
          <span>₹{product.startingBid}</span>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Total Bids:</span>
          <span>{product.bids?.length || 0}</span>
        </div>
      </div>

      {auctionStatus === 'Live' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Bid Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">₹</span>
              <input 
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                placeholder={`Minimum ₹${(product.currentPrice || product.startingBid)! + 1}`}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                disabled={isBidding}
                min={(product.currentPrice || product.startingBid)! + 1}
              />
            </div>
          </div>
          
          <button 
            onClick={handlePlaceBid}
            disabled={isBidding || !bidAmount}
            className="w-full bg-green-600 text-white font-semibold py-4 px-6 rounded-xl hover:bg-green-700 transition-all duration-300 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isBidding ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Placing Bid...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Place Bid
              </>
            )}
          </button>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-700 text-sm text-center">{error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Main Product Detail Component
const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

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

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading product details...</p>
      </div>
    </div>
  );

  if (error || !product) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
        <Link to="/products" className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors">
          Browse Products
        </Link>
      </div>
    </div>
  );

  // Mock additional images for demo
  const productImages = [
    product.imageUrl,
    product.imageUrl, // In real app, these would be different images
    product.imageUrl,
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 py-4 text-sm text-gray-600">
            <Link to="/" className="hover:text-green-600 transition-colors">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/products" className="hover:text-green-600 transition-colors">Products</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <img 
                src={productImages[selectedImage] || 'https://placehold.co/800x800/EEE/31343C?text=No+Image'} 
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover"
              />
            </div>
            <div className="flex gap-3">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-1 h-20 bg-white rounded-lg border-2 overflow-hidden transition-all ${
                    selectedImage === index ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <StatusBadge type={product.buyType} status={product.buyType === 'auction' ? 'Live' : undefined} />
                {product.organic && <StatusBadge type="organic" />}
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">{product.name}</h1>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Farmer: {product.farmer}
                </span>
                {product.farmLocation && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {product.farmLocation}
                  </span>
                )}
              </div>
            </div>

            {/* Action Panel */}
            {renderActionPanel(product)}

            {/* Product Description */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Product Details</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
              
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Category:</span>
                  <p className="text-gray-600">{product.category}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Subcategory:</span>
                  <p className="text-gray-600">{product.subCategory}</p>
                </div>
                {product.harvestDate && (
                  <div>
                    <span className="font-medium text-gray-900">Harvest Date:</span>
                    <p className="text-gray-600">{new Date(product.harvestDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Farmer Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">About the Farmer</h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">👨‍🌾</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{product.farmer}</h4>
                  <p className="text-sm text-gray-600">Trusted partner since 2020</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;