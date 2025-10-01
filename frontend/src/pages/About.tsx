
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer/Footer';

const About: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);
  return (
    <>
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className={`max-w-7xl mx-auto transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-green-700 mb-4 transition-all duration-700 ease-out">About FarmConnect</h1>
          <p className="text-xl text-gray-600 mb-8 transition-all duration-700 delay-300 ease-out">Bridging the gap between farmers and buyers</p>
        </div>

        {/* Mission Section */}
        <div className={`mt-12 bg-white rounded-lg shadow-lg p-8 transition-all duration-1000 delay-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            FarmConnect is dedicated to revolutionizing the agricultural marketplace by creating
            a seamless connection between farmers and buyers. We eliminate unnecessary intermediaries
            while providing reliable oversight to ensure fair trades and quality products.
          </p>
        </div>

        {/* How It Works Section */}
        <div className={`mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 delay-700`}>
          <div className={`bg-white rounded-lg shadow-lg p-6 transition-all duration-700 transform hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h3 className="text-xl font-semibold text-green-700 mb-3">For Farmers</h3>
            <p className="text-gray-600">
              List your products, set fair prices, and reach a wider market of potential buyers.
              Our platform ensures timely payments and transparent transactions.
            </p>
          </div>

          <div className={`bg-white rounded-lg shadow-lg p-6 transition-all duration-700 delay-200 transform hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h3 className="text-xl font-semibold text-green-700 mb-3">For Buyers</h3>
            <p className="text-gray-600">
              Access fresh, high-quality agricultural products directly from verified farmers.
              Enjoy competitive prices and reliable delivery services.
            </p>
          </div>

          <div className={`bg-white rounded-lg shadow-lg p-6 transition-all duration-700 delay-400 transform hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h3 className="text-xl font-semibold text-green-700 mb-3">Our Role</h3>
            <p className="text-gray-600">
              We provide a secure platform, verify participants, ensure quality standards,
              and facilitate smooth transactions between farmers and buyers.
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className={`mt-12 bg-white rounded-lg shadow-lg p-8 transition-all duration-1000 delay-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose FarmConnect?</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-3">
            {[
              'Direct farmer-to-buyer connections reducing costs',
              'Verified sellers and quality assurance',
              'Secure payment processing',
              'Transparent pricing and fair trade practices',
              'Support for local farming communities'
            ].map((benefit, index) => (
              <li key={index} className={`transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{ transitionDelay: `${index * 200}ms` }}>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact CTA */}
        <div className={`mt-12 text-center transition-all duration-1000 delay-1500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-xl text-gray-700 mb-4">Want to learn more about how we can help you?</p>
          <button 
            onClick={() => navigate('/contact')}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}

export default About
