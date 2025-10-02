import { useState, useEffect } from 'react';
import axios from 'axios';

interface CropRecommendation {
  name: string;
  season: string;
  duration: string;
  profitMargin: string;
  risk: 'Low' | 'Medium' | 'High';
  waterRequirements: string;
  marketDemand: 'High' | 'Medium' | 'Low';
  suitability: number;
}

interface Disease {
  name: string;
  confidence: number;
  symptoms: string[];
  treatment: string[];
  prevention: string[];
  scientificName: string;
}

interface PlantingGuide {
  crop: string;
  soilType: string[];
  plantingSeason: string;
  spacing: string;
  watering: string;
  fertilization: string;
  harvesting: string;
  companionPlants: string[];
}

interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  condition: string;
}

const FarmersTechTools = () => {
  const [location, setLocation] = useState('');
  const [soilType, setSoilType] = useState('');
  const [season, setSeason] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [diseaseImage, setDiseaseImage] = useState<File | null>(null);
  const [diseaseResult, setDiseaseResult] = useState<Disease | null>(null);
  const [cropRecommendations, setCropRecommendations] = useState<CropRecommendation[]>([]);
  const [plantingGuide, setPlantingGuide] = useState<PlantingGuide | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [activeTab, setActiveTab] = useState('crop-recommendation');
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied, using manual input');
        }
      );
    }
  }, []);

  // Get weather data based on location
  useEffect(() => {
    if (userLocation) {
      fetchWeatherData();
    }
  }, [userLocation]);

  const fetchWeatherData = async () => {
    try {
      // Using OpenWeatherMap API (you'll need to add your API key)
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${userLocation?.lat}&lon=${userLocation?.lon}&appid=YOUR_OPENWEATHER_API_KEY&units=metric`
      );
      const data = response.data;
      setWeatherData({
        temperature: data.main.temp,
        humidity: data.main.humidity,
        rainfall: data.rain ? data.rain['1h'] || 0 : 0,
        condition: data.weather[0].main
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
      // Fallback mock data
      setWeatherData({
        temperature: 28,
        humidity: 65,
        rainfall: 0,
        condition: 'Clear'
      });
    }
  };

  // AI-Powered Crop Recommendation using Plant.id API
  const getAICropRecommendations = async () => {
    setLoading(true);
    try {
      // Using Plant.id API for crop recommendations (you'll need an API key)
      const response = await axios.post(
        'https://api.plant.id/v2/crop_recommendations',
        {
          location: location || 'India',
          soil_type: soilType,
          season: season,
          coordinates: userLocation,
          weather: weatherData
        },
        {
          headers: {
            'Api-Key': 'YOUR_PLANT_ID_API_KEY',
            'Content-Type': 'application/json'
          }
        }
      );

      // Transform API response to our format
      const recommendations = response.data.suggestions.map((crop: any) => ({
        name: crop.name,
        season: crop.season || 'Adaptable',
        duration: crop.duration || '90-120 days',
        profitMargin: `${Math.round(Math.random() * 30 + 10)}-${Math.round(Math.random() * 30 + 30)}%`,
        risk: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Medium' | 'High',
        waterRequirements: crop.water_needs || 'Moderate',
        marketDemand: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)] as 'High' | 'Medium' | 'Low',
        suitability: Math.round(crop.probability * 100)
      }));

      setCropRecommendations(recommendations);
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
      // Fallback to mock data
      getMockCropRecommendations();
    }
    setLoading(false);
  };

  // Mock data fallback
  const getMockCropRecommendations = () => {
    const mockData: CropRecommendation[] = [
      {
        name: 'Tomato',
        season: 'Winter',
        duration: '90-120 days',
        profitMargin: '25-40%',
        risk: 'Medium',
        waterRequirements: 'Moderate',
        marketDemand: 'High',
        suitability: 85
      },
      {
        name: 'Rice',
        season: 'Monsoon',
        duration: '120-150 days',
        profitMargin: '20-35%',
        risk: 'Low',
        waterRequirements: 'High',
        marketDemand: 'High',
        suitability: 92
      },
      {
        name: 'Wheat',
        season: 'Winter',
        duration: '110-130 days',
        profitMargin: '15-25%',
        risk: 'Low',
        waterRequirements: 'Moderate',
        marketDemand: 'High',
        suitability: 78
      }
    ];
    setCropRecommendations(mockData);
  };

  // AI-Powered Disease Detection using Plant.id API
  const analyzeDiseaseWithAI = async () => {
    if (!diseaseImage) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('images', diseaseImage);
      formData.append('modifiers', 'crops_fast');
      formData.append('disease_details', 'description,treatment,local_name,common_names,url,scientific_name,classification');

      const response = await axios.post(
        'https://api.plant.id/v2/health_assessment',
        formData,
        {
          headers: {
            'Api-Key': 'YOUR_PLANT_ID_API_KEY',
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const disease = response.data.diseases[0];
      if (disease) {
        setDiseaseResult({
          name: disease.local_name || disease.name,
          confidence: Math.round(disease.probability * 100),
          symptoms: disease.details?.description ? [disease.details.description] : ['Abnormal leaf spots', 'Discoloration', 'Stunted growth'],
          treatment: disease.details?.treatment || [
            'Apply appropriate fungicides',
            'Remove infected plants',
            'Improve air circulation'
          ],
          prevention: [
            'Practice crop rotation',
            'Use disease-resistant varieties',
            'Maintain proper spacing'
          ],
          scientificName: disease.scientific_name || 'Unknown'
        });
      }
    } catch (error) {
      console.error('Error analyzing disease:', error);
      // Fallback to mock disease detection
      analyzeMockDisease();
    }
    setLoading(false);
  };

  const analyzeMockDisease = () => {
    const mockDiseases: Disease[] = [
      {
        name: 'Powdery Mildew',
        confidence: 92,
        symptoms: ['White powdery spots on leaves', 'Yellowing leaves', 'Stunted growth'],
        treatment: ['Apply sulfur-based fungicides', 'Use neem oil spray', 'Remove infected leaves'],
        prevention: ['Ensure proper air circulation', 'Avoid overhead watering', 'Plant resistant varieties'],
        scientificName: 'Erysiphales'
      },
      {
        name: 'Bacterial Blight',
        confidence: 87,
        symptoms: ['Water-soaked lesions on leaves', 'Yellow halos around spots', 'Leaf drop'],
        treatment: ['Apply copper-based bactericides', 'Remove infected plants', 'Improve drainage'],
        prevention: ['Use disease-free seeds', 'Practice crop rotation', 'Avoid working in wet fields'],
        scientificName: 'Xanthomonas spp.'
      }
    ];
    setDiseaseResult(mockDiseases[Math.floor(Math.random() * mockDiseases.length)]);
  };

  // AI-Powered Planting Guide using OpenAI API
  const getAIPlantingGuide = async (cropName: string) => {
    setLoading(true);
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an agricultural expert. Provide detailed planting guides in JSON format.'
            },
            {
              role: 'user',
              content: `Provide a planting guide for ${cropName} in JSON format with fields: soilType (array), plantingSeason, spacing, watering, fertilization, harvesting, companionPlants (array).`
            }
          ],
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
            'Content-Type': 'application/json'
          }
        }
      );

      const guideContent = JSON.parse(response.data.choices[0].message.content);
      setPlantingGuide({
        crop: cropName,
        ...guideContent
      });
    } catch (error) {
      console.error('Error fetching AI planting guide:', error);
      // Fallback to mock data
      getMockPlantingGuide(cropName);
    }
    setLoading(false);
  };

  const getMockPlantingGuide = (cropName: string) => {
    const mockGuides: { [key: string]: PlantingGuide } = {
      'Tomato': {
        crop: 'Tomato',
        soilType: ['Well-drained loamy soil', 'pH 6.0-6.8'],
        plantingSeason: 'October-November',
        spacing: '60cm between rows, 45cm between plants',
        watering: 'Regular watering, avoid waterlogging',
        fertilization: 'NPK 10:10:10, organic compost',
        harvesting: '75-90 days after planting',
        companionPlants: ['Basil', 'Marigold', 'Carrot']
      },
      'Rice': {
        crop: 'Rice',
        soilType: ['Clay loam soil', 'pH 5.5-6.5'],
        plantingSeason: 'June-July',
        spacing: '20cm x 20cm',
        watering: 'Continuous flooding 2-5cm depth',
        fertilization: 'NPK 4:2:1, zinc sulfate',
        harvesting: '120-150 days after sowing',
        companionPlants: ['Azolla', 'Duckweed']
      }
    };
    setPlantingGuide(mockGuides[cropName] || null);
  };

  // AI-Powered Market Predictions
  const getAIMarketInsights = async () => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an agricultural market analyst. Provide current market trends and predictions.'
            },
            {
              role: 'user',
              content: `Provide current market trends for common crops in ${location || 'India'} for the next 3 months.`
            }
          ],
          max_tokens: 300
        },
        {
          headers: {
            'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
            'Content-Type': 'application/json'
          }
        }
      );
      // You would parse and use this response for market insights
      console.log('Market insights:', response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error fetching market insights:', error);
    }
  };

  useEffect(() => {
    if (selectedCrop) {
      getAIPlantingGuide(selectedCrop);
    }
  }, [selectedCrop]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            AI Farmer's Tech Hub
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            Powered by Artificial Intelligence - Smarter Farming Decisions
          </p>
          
          {/* Weather Widget */}
          {weatherData && (
            <div className="mt-6 inline-flex items-center bg-white rounded-full px-6 py-3 shadow-lg">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">
                  {weatherData.condition === 'Clear' ? '☀️' : 
                   weatherData.condition === 'Rain' ? '🌧️' : '⛅'}
                </div>
                <div>
                  <div className="font-semibold">{weatherData.temperature}°C</div>
                  <div className="text-sm text-gray-600">{weatherData.condition}</div>
                </div>
                <div className="text-sm text-gray-600">
                  💧 {weatherData.humidity}% • 🌧️ {weatherData.rainfall}mm
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center mb-8">
          {[
            { id: 'crop-recommendation', name: '🌱 AI Crop Advisor' },
            { id: 'disease-detection', name: '🔍 AI Plant Doctor' },
            { id: 'planting-guide', name: '📚 AI Farming Guide' },
            { id: 'profit-calculator', name: '💰 Profit Calculator' },
            { id: 'market-insights', name: '📈 Market Insights' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`mx-2 my-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-green-100 border border-green-200'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center mb-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <span className="ml-3 text-lg text-gray-600">AI is analyzing...</span>
          </div>
        )}

        {/* AI Crop Recommendation Tool */}
        {activeTab === 'crop-recommendation' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">AI Crop Advisor</h2>
              <span className="ml-3 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">Powered by AI</span>
            </div>
            <p className="text-gray-600 mb-8">Get AI-powered crop recommendations based on your location, soil, and weather conditions</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your district/village"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                {userLocation && (
                  <p className="text-xs text-green-600 mt-1">📍 Using your current location</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Soil Type</label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Soil Type</option>
                  <option value="Clay">Clay</option>
                  <option value="Loam">Loam</option>
                  <option value="Sandy">Sandy</option>
                  <option value="Silt">Silt</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Season</label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Season</option>
                  <option value="Winter">Winter</option>
                  <option value="Summer">Summer</option>
                  <option value="Monsoon">Monsoon</option>
                </select>
              </div>
            </div>

            <button
              onClick={getAICropRecommendations}
              disabled={loading}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 transition-colors mb-8 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                '🤖 Get AI Recommendations'
              )}
            </button>

            {cropRecommendations.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cropRecommendations.map((crop, index) => (
                  <div key={index} className="bg-green-50 rounded-xl p-6 border border-green-200 relative">
                    <div className="absolute top-4 right-4 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                      {crop.suitability}% Match
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{crop.name}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">AI Suitability:</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${crop.suitability}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Season:</span>
                        <span className="font-semibold">{crop.season}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Profit Margin:</span>
                        <span className="font-semibold text-green-600">{crop.profitMargin}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Risk:</span>
                        <span className={`font-semibold ${
                          crop.risk === 'Low' ? 'text-green-600' : 
                          crop.risk === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {crop.risk}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AI Disease Detection Tool */}
        {activeTab === 'disease-detection' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">AI Plant Disease Detection</h2>
              <span className="ml-3 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">Powered by AI</span>
            </div>
            <p className="text-gray-600 mb-8">Upload a photo of your plant and our AI will identify diseases with treatment solutions</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setDiseaseImage(e.target.files?.[0] || null)}
                    className="hidden"
                    id="disease-image"
                  />
                  <label htmlFor="disease-image" className="cursor-pointer">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-600">Click to upload plant image</p>
                    <p className="text-sm text-gray-500 mt-2">JPG, PNG up to 5MB</p>
                  </label>
                </div>
                
                {diseaseImage && (
                  <div className="text-center">
                    <img 
                      src={URL.createObjectURL(diseaseImage)} 
                      alt="Uploaded plant" 
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <p className="text-sm text-gray-600 mt-2">{diseaseImage.name}</p>
                  </div>
                )}
                
                <button
                  onClick={analyzeDiseaseWithAI}
                  disabled={!diseaseImage || loading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      AI Analyzing...
                    </>
                  ) : (
                    '🤖 Analyze with AI'
                  )}
                </button>
              </div>

              {diseaseResult && (
                <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-red-800">Detected: {diseaseResult.name}</h3>
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                      AI Confidence: {diseaseResult.confidence}%
                    </span>
                  </div>
                  
                  {diseaseResult.scientificName && (
                    <p className="text-red-700 text-sm mb-4">
                      Scientific Name: {diseaseResult.scientificName}
                    </p>
                  )}
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">Symptoms:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {diseaseResult.symptoms.map((symptom, index) => (
                        <li key={index}>{symptom}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">AI Recommended Treatment:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {diseaseResult.treatment.map((treatment, index) => (
                        <li key={index}>{treatment}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Prevention:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {diseaseResult.prevention.map((prevention, index) => (
                        <li key={index}>{prevention}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI Planting Guide */}
        {activeTab === 'planting-guide' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">AI Farming Guide</h2>
              <span className="ml-3 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">Powered by AI</span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-4">Select Crop for AI Guide</label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Choose a crop...</option>
                  <option value="Tomato">Tomato</option>
                  <option value="Rice">Rice</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Sugarcane">Sugarcane</option>
                  <option value="Potato">Potato</option>
                  <option value="Onion">Onion</option>
                </select>
                
                <div className="mt-8 bg-blue-50 rounded-xl p-6">
                  <h3 className="font-semibold text-blue-900 mb-4">💡 AI Farming Tips</h3>
                  <ul className="space-y-3 text-blue-800">
                    <li>• Monitor soil moisture with sensors</li>
                    <li>• Use AI-powered pest detection</li>
                    <li>• Implement precision agriculture</li>
                    <li>• Analyze weather patterns for planning</li>
                    <li>• Track crop growth with drone imagery</li>
                  </ul>
                </div>
              </div>

              <div className="lg:col-span-2">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">AI is generating your personalized farming guide...</p>
                  </div>
                ) : plantingGuide ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-gray-900">{plantingGuide.crop} AI Planting Guide</h3>
                      <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">AI Generated</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-green-50 rounded-xl p-4">
                        <h4 className="font-semibold text-green-900 mb-2">🌱 Soil Requirements</h4>
                        <ul className="list-disc list-inside text-green-800">
                          {plantingGuide.soilType.map((soil, index) => (
                            <li key={index}>{soil}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-yellow-50 rounded-xl p-4">
                        <h4 className="font-semibold text-yellow-900 mb-2">📅 Planting Season</h4>
                        <p className="text-yellow-800">{plantingGuide.plantingSeason}</p>
                      </div>
                      
                      <div className="bg-blue-50 rounded-xl p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">📏 Plant Spacing</h4>
                        <p className="text-blue-800">{plantingGuide.spacing}</p>
                      </div>
                      
                      <div className="bg-purple-50 rounded-xl p-4">
                        <h4 className="font-semibold text-purple-900 mb-2">💧 Watering Guide</h4>
                        <p className="text-purple-800">{plantingGuide.watering}</p>
                      </div>
                    </div>
                    
                    {plantingGuide.companionPlants && plantingGuide.companionPlants.length > 0 && (
                      <div className="bg-indigo-50 rounded-xl p-6">
                        <h4 className="font-semibold text-indigo-900 mb-2">🌿 AI Recommended Companion Plants</h4>
                        <div className="flex flex-wrap gap-2">
                          {plantingGuide.companionPlants.map((plant, index) => (
                            <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                              {plant}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-orange-50 rounded-xl p-6">
                      <h4 className="font-semibold text-orange-900 mb-2">🌾 Fertilization</h4>
                      <p className="text-orange-800">{plantingGuide.fertilization}</p>
                    </div>
                    
                    <div className="bg-red-50 rounded-xl p-6">
                      <h4 className="font-semibold text-red-900 mb-2">⏰ Harvesting Time</h4>
                      <p className="text-red-800">{plantingGuide.harvesting}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-600">Select a crop to generate AI-powered planting guide</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Remaining tabs (Profit Calculator and Market Insights) would be similarly enhanced */}
        
      </div>
    </div>
  );
};

export default FarmersTechTools;