import { Routes, Route } from 'react-router-dom';

import Navbar from './components/NavBar/NavBar'; 
import Footer from './components/Footer/Footer';

import Home from "./components/homepage/Home";
import ProductsPage from './pages/ProductsPage';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import About from './pages/About';
import Contact from './pages/Contact';
import ProfilePage from './pages/MyOrders';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignUpPage';
import UploadProductPage from './pages/SellYourProduct'; 
import FarmerDashboard from './pages/DashboardPage';
import FarmersTechTools from './pages/FarmersArea';
import AnimalProducts from './components/homepage/AnimalProducts'; 
const NotFound = () => <div className="p-8 text-center min-h-screen"><h1>404 - Page Not Found</h1></div>;

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          
          <Route path="/animal-products" element={<AnimalProducts />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          <Route path="/upload-product" element={<UploadProductPage />} />
          <Route path="/dashboard" element={<FarmerDashboard />} />
          <Route path="/farmers-area" element={<FarmersTechTools />} />

          <Route path="/cart" element={<CartPage />} /> 
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;