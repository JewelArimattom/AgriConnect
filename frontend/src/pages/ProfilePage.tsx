import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthenticationContext';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // This effect checks if the user is logged in. If not, it redirects to the login page.
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to the homepage after logging out
  };

  // Render nothing while the redirect is happening to prevent a flash of content
  if (!user) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Welcome, {user.name}!
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage your account details and view your order history below.
          </p>
        </div>

        {/* Mock Order History Section */}
        <div className="mt-8 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Your Orders</h2>
          <div className="space-y-4">
            {/* Example Order */}
            <div className="flex justify-between items-center p-4 border rounded-md hover:bg-gray-50">
              <div>
                <p className="font-semibold">Order #FC1024</p>
                <p className="text-sm text-gray-500">Date: October 2, 2025</p>
              </div>
              <span className="font-bold text-green-600">₹1500.00</span>
            </div>
            {/* Example Order */}
            <div className="flex justify-between items-center p-4 border rounded-md hover:bg-gray-50">
              <div>
                <p className="font-semibold">Order #FC1023</p>
                <p className="text-sm text-gray-500">Date: September 28, 2025</p>
              </div>
              <span className="font-bold text-green-600">₹850.00</span>
            </div>
          </div>
        </div>
        
        {/* Account Actions */}
        <div className="mt-8 text-center">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white font-bold py-3 px-6 rounded-md hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
