import { Routes, Route } from 'react-router-dom';

// Layout Components
import Navbar from './components/NavBar/NavBar'; 
import Footer from './components/Footer/Footer';

// Page Components
import Home from "./components/homepage/Home";
import LatestCollection from './components/homepage/LatestCollection';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import About from './pages/About';
import Contact from './pages/Contact';
import ProductsPage from './pages/ProductsPage';

// Fallback Component for 404
const NotFound = () => <div className="p-8 text-center min-h-screen"><h1>404 - Page Not Found</h1></div>;

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<LatestCollection />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/productspage" element={<ProductsPage />} />
          
          {/* E-commerce Flow Routes */}
          <Route path="/cart" element={<CartPage />} /> 
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          
          {/* Static Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Catch-all 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
