import { Routes, Route } from 'react-router-dom';
import Home from "./components/homepage/Home";
import Navbar from './components/NavBar/NavBar'; 
import About from './pages/About';
import Contact from './pages/Contact';
import Footer from './components/Footer/Footer';

const Products = () => <div className="p-8 text-center"><h1>Products Page</h1></div>;
const NotFound = () => <div className="p-8 text-center"><h1>404 - Page Not Found</h1></div>;

const App = () => {
  return (
    <div>
            <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
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