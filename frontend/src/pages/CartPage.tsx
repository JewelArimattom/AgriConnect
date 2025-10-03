import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const subtotal = cartItems.reduce((total, item) => {
    const price = parseFloat(item.price.replace('₹', ''));
    return total + price;
  }, 0);

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20 min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="bg-green-600 text-white font-bold py-3 px-6 rounded-md hover:bg-green-700">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="bg-white shadow-md rounded-lg">
          <ul className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <li key={item.id} className="flex items-center justify-between p-4 sm:p-6">
                <div className="flex items-center">
                  <img src={item.imageUrl} alt={item.name} className="h-20 w-20 rounded-md object-cover mr-4 sm:mr-6" />
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-gray-600">{item.price}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 font-semibold text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row justify-end gap-4">
            <button
              onClick={clearCart}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-md text-center font-semibold hover:bg-gray-100"
            >
              Clear Cart
            </button>
            <Link
              to="/checkout"
              className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-md text-center font-semibold hover:bg-green-700"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
