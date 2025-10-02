import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthenticationContext';

// Define the shape of the order data we expect from the backend
interface Order {
  _id: string;
  totalAmount: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
  products: { name: string }[]; // Include products for more detail
}

const MyOrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Fetch orders for the currently logged-in user
        const response = await fetch(`http://localhost:5000/api/orders/myorders/${user.name}`);
        if (!response.ok) {
          throw new Error('Failed to fetch your orders.');
        }
        const data = await response.json();
        setOrders(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]); // Refetch orders if the user changes (e.g., on login)

  // Render a loading state while data is being fetched
  if (loading) {
    return <div className="text-center py-20 font-semibold">Loading your order history...</div>;
  }

  // Render an error message if the fetch fails
  if (error) {
    return <div className="text-center py-20 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Order History</h1>
      <div className="bg-white shadow-md rounded-lg">
        {orders.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {orders.map((order) => (
              <li key={order._id} className="p-6 flex justify-between items-center hover:bg-gray-50">
                <div>
                  <p className="font-semibold text-gray-800">Order #{order._id.slice(-6).toUpperCase()}</p>
                  <p className="text-sm text-gray-500">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                   <p className="text-sm text-gray-500 truncate mt-1">
                    {order.products.map(p => p.name).join(', ')}
                   </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">₹{order.totalAmount.toFixed(2)}</p>
                  <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-600">You haven't placed any orders yet.</p>
            <Link to="/products" className="mt-4 inline-block text-green-600 font-semibold hover:underline">
              Start Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;

