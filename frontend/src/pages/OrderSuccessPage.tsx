import { Link } from 'react-router-dom';

const OrderSuccessPage = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-screen bg-gray-50">
      <div className="bg-white p-12 rounded-lg shadow-lg">
        <svg className="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="text-3xl font-extrabold text-gray-900">Thank You for Your Order!</h1>
        <p className="text-gray-600 mt-2">Your order has been placed successfully and is being processed.</p>
        <Link 
          to="/" 
          className="mt-8 inline-block bg-green-600 text-white font-bold py-3 px-6 rounded-md hover:bg-green-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage;