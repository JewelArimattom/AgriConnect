import { Routes, Route } from 'react-router-dom';
import Home from "./components/homepage/Home";
import Navbar from './components/NavBar/NavBar'; 
import { AuthProvider } from './context/AuthContext';
import Footer from './components/Footer/Footer';
import LatestCollection from './components/homepage/LatestCollection';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import About from './pages/About';
import Contact from './pages/Contact';
import SignIn from './pages/signin';

const NotFound = () => <div className="p-8 text-center min-h-screen"><h1>404 - Page Not Found</h1></div>;

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <AuthProvider>
        <Navbar />
        <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<LatestCollection />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} /> 
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      </AuthProvider>
    </div>
  );
}

export default App;