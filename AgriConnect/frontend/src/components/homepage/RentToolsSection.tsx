import { Link } from 'react-router-dom';

// A simple checkmark icon component for the features list
const CheckIcon = () => (
  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const RentToolsSection = () => {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Text Content & Call to Action */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Power Your Farm with the Right Tools
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Access modern, high-quality farming equipment without the heavy investment. Our rental service provides the tools you need, right when you need them.
            </p>
            
            <ul className="mt-8 space-y-4 inline-block text-left">
              <li className="flex items-start">
                <CheckIcon />
                <span className="ml-3 text-lg text-gray-700"><span className="font-semibold">Cost-Effective:</span> Pay only for what you use.</span>
              </li>
              <li className="flex items-start">
                <CheckIcon />
                <span className="ml-3 text-lg text-gray-700"><span className="font-semibold">Modern Equipment:</span> Access the latest technology.</span>
              </li>
              <li className="flex items-start">
                <CheckIcon />
                <span className="ml-3 text-lg text-gray-700"><span className="font-semibold">Flexible Rentals:</span> Daily, weekly, or monthly options.</span>
              </li>
            </ul>

            <div className="mt-10">
              <Link
                to="/rent-tools" 
                className="inline-block bg-green-600 text-white font-bold text-lg py-4 px-10 rounded-full hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Explore Rental Tools
              </Link>
            </div>
          </div>
          
          {/* Right Column: Image */}
          <div className="w-full h-full flex items-center justify-center">
            <img 
              className="w-full max-w-lg rounded-lg shadow-xl"
              src="https://t4.ftcdn.net/jpg/06/41/88/33/360_F_641883382_1ED7kfd4Flhkl8PIhrSMUHGcISBCrmmG.jpg"
              alt="Modern tractor in a field"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default RentToolsSection;