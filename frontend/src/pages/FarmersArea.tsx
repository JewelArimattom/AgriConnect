import { useState, useEffect } from "react";
import {
  Camera,
  Leaf,
  TrendingUp,
  BookOpen,
  Calculator,
  AlertCircle,
  CheckCircle,
  MapPin,
  DollarSign,
  BarChart3,
  Sun,
  CloudRain,
  Cloud,
  Zap,
  Sprout,
  Heart,
} from "lucide-react";

interface CropRecommendation {
  name: string;
  season: string;
  duration: string;
  profitMargin: string;
  risk: "Low" | "Medium" | "High";
  waterRequirements: string;
  marketDemand: "High" | "Medium" | "Low";
  suitability: number;
  description: string;
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
  tips: string[];
}

interface MarketPrice {
  commodity: string;
  category: "Crop" | "Animal" | "Plant" | "Anime" | "Other";
  currentPrice: number;
  unit: string;
  priceChange: number;
  priceChangePercent: number;
  market: string;
  demand: "High" | "Medium" | "Low";
  trend: "Up" | "Down" | "Stable";
  lastUpdated: string;
  description: string;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  condition: string;
  windSpeed: number;
  description: string;
  location: string;
  feelsLike: number;
  uvIndex: number;
  visibility: number;
  lastUpdated: string;
}

const FarmersTechTools = () => {
  const [location, setLocation] = useState("");
  const [soilType, setSoilType] = useState("");
  const [season, setSeason] = useState("");
  const [landSize, setLandSize] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("");
  const [diseaseImage, setDiseaseImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [diseaseResult, setDiseaseResult] = useState<Disease | null>(null);
  const [cropRecommendations, setCropRecommendations] = useState<
    CropRecommendation[]
  >([]);
  const [plantingGuide, setPlantingGuide] = useState<PlantingGuide | null>(
    null
  );
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [activeTab, setActiveTab] = useState("crop-recommendation");
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          getLocationName(position.coords.latitude, position.coords.longitude);
        },
        () => {
          console.log("Location access denied");
        }
      );
    }
  }, []);

  const getLocationName = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );
      const data = await response.json();
      setLocation(
        data.locality || data.city || data.principalSubdivision || ""
      );
    } catch (error) {
      console.error("Error getting location name:", error);
    }
  };

  // Initialize weather data on component mount
  useEffect(() => {
    fetchWeatherData();
  }, []);

  // Gemini AI API call function with fallback models
  const callGeminiAPI = async (prompt: string) => {
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      throw new Error("Gemini API key not found in environment variables");
    }

    const models = [
      "gemini-2.5-flash-lite", // Primary model (lite)
      "gemini-2.5-flash", // Fallback model
    ];

    for (const model of models) {
      try {
        console.log(`Trying Gemini model: ${model}`);

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: prompt,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 2048,
              },
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.warn(`Model ${model} failed:`, errorData);
          continue; // Try next model
        }

        const data = await response.json();

        if (
          !data.candidates ||
          !data.candidates[0] ||
          !data.candidates[0].content
        ) {
          console.warn(`Model ${model} returned invalid response structure`);
          continue; // Try next model
        }

        const content = data.candidates[0].content.parts[0].text;

        // Clean up the response to extract JSON
        let cleanedContent = content.trim();

        // Remove markdown code blocks if present
        const jsonMatch = cleanedContent.match(/```(?:json)?\n?([\s\S]*?)```/);
        if (jsonMatch) {
          cleanedContent = jsonMatch[1].trim();
        }

        // Try to parse the JSON
        try {
          const parsed = JSON.parse(cleanedContent);
          console.log(`Successfully used model: ${model}`);
          return parsed;
        } catch (parseError) {
          console.error(
            `Model ${model} returned invalid JSON:`,
            cleanedContent
          );
          continue; // Try next model
        }
      } catch (error) {
        console.error(`Error with model ${model}:`, error);
        continue; // Try next model
      }
    }

    // If all models fail, throw an error to trigger mock data fallback
    throw new Error("All Gemini models failed to respond properly");
  };

  // Fetch market prices
  const fetchMarketPrices = async () => {
    setLoading(true);
    setError(null);

    try {
      const prompt = `You are an agricultural market analyst. Provide current market prices and trends for various farming commodities including crops, animals, plants, and agricultural merchandise for ${
        location || "India"
      }.

Provide your response ONLY as a valid JSON array with exactly this structure (no additional text, no markdown, just the JSON array):
[
  {
    "commodity": "Product Name",
    "category": "Crop" or "Animal" or "Plant" or "Other",
    "currentPrice": 150,
    "unit": "kg" or "liter" or "piece" or "animal",
    "priceChange": 15,
    "priceChangePercent": 10.5,
    "market": "Market Name",
    "demand": "High" or "Medium" or "Low",
    "trend": "Up" or "Down" or "Stable",
    "lastUpdated": "2024-10-05",
    "description": "Brief 1-2 sentence market analysis"
  }
]

Provide at least 8 diverse commodities including crops, animals, and plants.`;

      const prices = await callGeminiAPI(prompt);
      if (prices && Array.isArray(prices) && prices.length > 0) {
        setMarketPrices(prices);
      } else {
        throw new Error("Invalid response format from AI");
      }
    } catch (error) {
      console.error("Error fetching market prices:", error);
      // Use comprehensive mock data
      const mockPrices: MarketPrice[] = [
        {
          commodity: "Organic Tomatoes",
          category: "Crop",
          currentPrice: 45,
          unit: "kg",
          priceChange: 5,
          priceChangePercent: 12.5,
          market: "Delhi Mandi",
          demand: "High",
          trend: "Up",
          lastUpdated: "2024-01-15",
          description:
            "High demand due to festival season, excellent for greenhouse farming",
        },
        {
          commodity: "Basmati Rice",
          category: "Crop",
          currentPrice: 85,
          unit: "kg",
          priceChange: -3,
          priceChangePercent: -3.4,
          market: "Punjab Market",
          demand: "Medium",
          trend: "Down",
          lastUpdated: "2024-01-15",
          description: "Export demand slowing down, good time for storage",
        },
        {
          commodity: "Dairy Cows",
          category: "Animal",
          currentPrice: 45000,
          unit: "animal",
          priceChange: 2000,
          priceChangePercent: 4.6,
          market: "Haryana Livestock",
          demand: "High",
          trend: "Up",
          lastUpdated: "2024-01-15",
          description:
            "Increased demand for dairy products, good investment opportunity",
        },
        {
          commodity: "Bonsai Plants",
          category: "Plant",
          currentPrice: 1200,
          unit: "piece",
          priceChange: 150,
          priceChangePercent: 14.3,
          market: "Online Market",
          demand: "Medium",
          trend: "Up",
          lastUpdated: "2024-01-15",
          description: "Urban gardening trend increasing, high profit margin",
        },
        {
          commodity: "Farm Anime Merch",
          category: "Anime",
          currentPrice: 899,
          unit: "set",
          priceChange: 50,
          priceChangePercent: 5.9,
          market: "E-commerce",
          demand: "High",
          trend: "Up",
          lastUpdated: "2024-01-15",
          description:
            "Popular farming anime driving sales, growing niche market",
        },
        {
          commodity: "Hydroponic Lettuce",
          category: "Crop",
          currentPrice: 120,
          unit: "kg",
          priceChange: 15,
          priceChangePercent: 14.3,
          market: "Metro Cities",
          demand: "High",
          trend: "Up",
          lastUpdated: "2024-01-15",
          description:
            "Year-round demand in urban areas, sustainable farming option",
        },
        {
          commodity: "Goat Meat",
          category: "Animal",
          currentPrice: 600,
          unit: "kg",
          priceChange: 25,
          priceChangePercent: 4.3,
          market: "Rural Markets",
          demand: "High",
          trend: "Up",
          lastUpdated: "2024-01-15",
          description: "Festival season demand, low maintenance livestock",
        },
        {
          commodity: "Medicinal Herbs",
          category: "Plant",
          currentPrice: 800,
          unit: "kg",
          priceChange: 60,
          priceChangePercent: 8.1,
          market: "Ayurvedic Companies",
          demand: "Medium",
          trend: "Up",
          lastUpdated: "2024-01-15",
          description: "Growing demand in pharmaceutical industry",
        },
      ];
      setMarketPrices(mockPrices);
    }
    setLoading(false);
  };

  // Fetch weather data from WeatherAPI.com
  const fetchWeatherData = async (weatherLocation?: string) => {
    setLoading(true);
    setError(null);

    try {
      const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

      if (!WEATHER_API_KEY) {
        throw new Error("Weather API key not found in environment variables");
      }

      // Use provided location or current location or default to "auto:ip" for IP-based location
      const query = weatherLocation || location || "auto:ip";

      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(
          query
        )}&aqi=no`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Weather API error: ${errorData.error?.message || "Unknown error"}`
        );
      }

      const data = await response.json();

      // Transform WeatherAPI response to our WeatherData interface
      const weatherData: WeatherData = {
        temperature: Math.round(data.current.temp_c),
        humidity: data.current.humidity,
        rainfall: data.current.precip_mm,
        condition: data.current.condition.text,
        windSpeed: Math.round(data.current.wind_kph),
        description: `Weather in ${data.location.name}, ${data.location.region}`,
        location: `${data.location.name}, ${data.location.region}`,
        feelsLike: Math.round(data.current.feelslike_c),
        uvIndex: data.current.uv,
        visibility: data.current.vis_km,
        lastUpdated: data.current.last_updated,
      };

      setWeatherData(weatherData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError(
        "Failed to fetch weather data. Please check your location and try again."
      );

      // Fallback to mock data
      const mockWeather: WeatherData = {
        temperature: 28,
        humidity: 65,
        rainfall: 0,
        condition: "Sunny",
        windSpeed: 12,
        description: "Perfect weather for farming activities",
        location: weatherLocation || location || "Current Location",
        feelsLike: 30,
        uvIndex: 7,
        visibility: 10,
        lastUpdated: new Date().toLocaleString(),
      };
      setWeatherData(mockWeather);
    }
    setLoading(false);
  };

  // AI-Powered Crop Recommendation
  const getAICropRecommendations = async () => {
    if (!soilType || !season) {
      setError("Please fill in all required fields (Soil Type and Season)");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const prompt = `You are an expert agricultural advisor with deep knowledge of regional farming practices across India. Based on the following farming conditions, recommend the top 5 most suitable crops, prioritizing crops that are traditionally grown and commercially successful in the specified region.

Farming Conditions:
- Location: ${location || "India"}
- Soil Type: ${soilType}
- Season: ${season}
- Land Size: ${landSize || "Not specified"} acres

Regional Crop Preferences (IMPORTANT):
${
  location
    ? `For ${location}, consider these regional specialties and traditional crops:`
    : "Consider pan-India crops with regional adaptations:"
}
${
  location?.toLowerCase().includes("kerala")
    ? `
- Kerala specialties: Coconut, Rubber, Tea, Coffee, Pepper, Cardamom, Banana, Pineapple, Tapioca, Rice, Cashew, Arecanut
- Traditional crops: Rice (paddy), Coconut, Banana, Tapioca, Vegetables like bitter gourd, drumstick, snake gourd
- Commercial crops: Rubber, Tea, Coffee, Pepper, Cardamom, Pineapple, Ginger, Turmeric`
    : ""
}

${
  location?.toLowerCase().includes("tamil") ||
  location?.toLowerCase().includes("tamil nadu")
    ? `
- Tamil Nadu specialties: Rice, Sugarcane, Cotton, Groundnut, Coconut, Tea, Coffee, Banana, Mango, Cashew
- Traditional crops: Rice, Sugarcane, Cotton, Groundnut, Coconut, Banana, Mango
- Commercial crops: Rice, Sugarcane, Cotton, Groundnut, Tea, Coffee, Cashew`
    : ""
}

${
  location?.toLowerCase().includes("karnataka")
    ? `
- Karnataka specialties: Coffee, Tea, Sugarcane, Cotton, Rice, Ragi, Jowar, Groundnut, Coconut, Mango, Cashew
- Traditional crops: Rice, Ragi, Jowar, Groundnut, Sugarcane, Cotton
- Commercial crops: Coffee, Tea, Sugarcane, Cotton, Cashew, Mango`
    : ""
}

${
  location?.toLowerCase().includes("maharashtra")
    ? `
- Maharashtra specialties: Sugarcane, Cotton, Soybean, Rice, Wheat, Jowar, Bajra, Groundnut, Orange, Grapes
- Traditional crops: Cotton, Sugarcane, Soybean, Rice, Wheat, Jowar, Bajra
- Commercial crops: Sugarcane, Cotton, Soybean, Grapes, Orange, Pomegranate`
    : ""
}

${
  location?.toLowerCase().includes("punjab") ||
  location?.toLowerCase().includes("haryana")
    ? `
- Punjab/Haryana specialties: Wheat, Rice, Cotton, Sugarcane, Maize, Potato, Mustard, Barley
- Traditional crops: Wheat, Rice, Cotton, Sugarcane, Maize, Mustard
- Commercial crops: Wheat, Rice, Cotton, Sugarcane, Potato, Mustard`
    : ""
}

${
  location?.toLowerCase().includes("rajasthan")
    ? `
- Rajasthan specialties: Mustard, Wheat, Barley, Bajra, Guar, Rapeseed, Moth bean, Cluster bean, Cumin, Coriander
- Traditional crops: Mustard, Wheat, Barley, Bajra, Guar, Rapeseed
- Commercial crops: Mustard, Guar, Cumin, Coriander, Moth bean, Cluster bean`
    : ""
}

${
  location?.toLowerCase().includes("gujarat")
    ? `
- Gujarat specialties: Cotton, Groundnut, Wheat, Rice, Sugarcane, Maize, Castor, Sesame, Cumin, Fennel
- Traditional crops: Cotton, Groundnut, Wheat, Rice, Sugarcane, Maize
- Commercial crops: Cotton, Groundnut, Castor, Cumin, Sesame, Fennel`
    : ""
}

${
  location?.toLowerCase().includes("west bengal") ||
  location?.toLowerCase().includes("bengal")
    ? `
- West Bengal specialties: Rice, Jute, Tea, Potato, Sugarcane, Wheat, Maize, Mustard, Pineapple, Mango
- Traditional crops: Rice, Jute, Potato, Sugarcane, Wheat, Mustard
- Commercial crops: Rice, Jute, Tea, Potato, Pineapple, Mango`
    : ""
}

${
  location?.toLowerCase().includes("uttar pradesh") ||
  location?.toLowerCase().includes("uttar")
    ? `
- Uttar Pradesh specialties: Wheat, Rice, Sugarcane, Potato, Mustard, Maize, Barley, Gram, Lentils, Mango
- Traditional crops: Wheat, Rice, Sugarcane, Potato, Mustard, Maize
- Commercial crops: Sugarcane, Potato, Wheat, Rice, Mango, Mustard`
    : ""
}

${
  location?.toLowerCase().includes("bihar")
    ? `
- Bihar specialties: Rice, Wheat, Maize, Potato, Sugarcane, Lentils, Gram, Mustard, Mango, Litchi
- Traditional crops: Rice, Wheat, Maize, Potato, Sugarcane, Lentils
- Commercial crops: Rice, Wheat, Sugarcane, Potato, Mango, Litchi`
    : ""
}

${
  location?.toLowerCase().includes("madhya pradesh") ||
  location?.toLowerCase().includes("madhya")
    ? `
- Madhya Pradesh specialties: Soybean, Wheat, Gram, Rice, Cotton, Mustard, Maize, Groundnut, Garlic, Onion
- Traditional crops: Soybean, Wheat, Gram, Rice, Cotton, Mustard
- Commercial crops: Soybean, Wheat, Gram, Cotton, Garlic, Onion`
    : ""
}

${
  location?.toLowerCase().includes("andhra") ||
  location?.toLowerCase().includes("telangana")
    ? `
- Andhra Pradesh/Telangana specialties: Rice, Cotton, Sugarcane, Maize, Groundnut, Mango, Tobacco, Chili, Turmeric
- Traditional crops: Rice, Cotton, Sugarcane, Maize, Groundnut, Mango
- Commercial crops: Rice, Cotton, Mango, Chili, Turmeric, Tobacco`
    : ""
}

${
  !location || location.toLowerCase() === "india"
    ? `
- Pan-India crops: Rice, Wheat, Cotton, Sugarcane, Maize, Groundnut, Mustard, Potato, Onion, Tomato
- Consider regional adaptations based on soil and climate conditions`
    : ""
}

Provide your response ONLY as a valid JSON array with exactly this structure (no additional text, no markdown, just the JSON array):
[
  {
    "name": "Crop Name",
    "season": "Ideal/Possible/Not Recommended",
    "duration": "X-Y days",
    "profitMargin": "X-Y%",
    "risk": "Low" or "Medium" or "High",
    "waterRequirements": "Low" or "Moderate" or "High",
    "marketDemand": "High" or "Medium" or "Low",
    "suitability": number between 1-100,
    "description": "2-3 sentence description explaining why this crop is suitable for the given conditions, including regional context"
  }
]

Ensure:
1. Prioritize crops traditionally grown in the specified region/state
2. Suitability score reflects how well the crop matches the region, soil type, and season
3. Include at least 2-3 regional specialty crops in the top 5 recommendations
4. Recommendations are sorted by suitability (highest first)
5. All fields use the exact format specified above
6. Response is valid JSON that can be parsed directly`;

      const recommendations = await callGeminiAPI(prompt);

      if (
        recommendations &&
        Array.isArray(recommendations) &&
        recommendations.length > 0
      ) {
        // Sort by suitability score descending
        const sortedRecommendations = recommendations.sort(
          (a, b) => b.suitability - a.suitability
        );
        setCropRecommendations(sortedRecommendations);
      } else {
        throw new Error("Invalid response format from AI");
      }
    } catch (error) {
      console.error("Error fetching AI recommendations:", error);
      // Fallback mock data
      const recommendations = [
        {
          name: "Rice",
          season: season === "Monsoon" ? "Ideal" : "Possible",
          duration: "120-150 days",
          profitMargin: "25-40%",
          risk: "Low",
          waterRequirements: "High",
          marketDemand: "High",
          suitability: 92,
          description:
            "Excellent choice for monsoon season with high water availability. Strong market demand and government support.",
        },
        {
          name: "Wheat",
          season: season === "Winter" ? "Ideal" : "Not Recommended",
          duration: "110-130 days",
          profitMargin: "20-35%",
          risk: "Low",
          waterRequirements: "Moderate",
          marketDemand: "High",
          suitability: season === "Winter" ? 88 : 45,
          description:
            "Best suited for winter season. Requires well-drained loamy soil with good organic content.",
        },
        {
          name: "Tomato",
          season: "Year-round",
          duration: "75-90 days",
          profitMargin: "30-50%",
          risk: "Medium",
          waterRequirements: "Moderate",
          marketDemand: "High",
          suitability: 85,
          description:
            "High-value crop with strong market demand. Requires careful disease management and proper irrigation.",
        },
        {
          name: "Cotton",
          season: season === "Summer" ? "Ideal" : "Not Recommended",
          duration: "150-180 days",
          profitMargin: "35-55%",
          risk: "Medium",
          waterRequirements: "Moderate",
          marketDemand: "High",
          suitability: season === "Summer" ? 78 : 40,
          description:
            "High profit potential with export opportunities. Needs adequate rainfall and integrated pest management.",
        },
        {
          name: "Pulses (Lentils)",
          season: "Winter",
          duration: "90-120 days",
          profitMargin: "25-40%",
          risk: "Low",
          waterRequirements: "Low",
          marketDemand: "High",
          suitability: 80,
          description:
            "Nitrogen-fixing crop that improves soil health. Low water requirement and good for crop rotation.",
        },
      ].sort((a, b) => b.suitability - a.suitability) as CropRecommendation[];

      setCropRecommendations(recommendations);
    }
    setLoading(false);
  };

  // AI Disease Detection with Image Analysis
  const analyzeDiseaseWithAI = async () => {
    if (!diseaseImage) return;

    setLoading(true);
    setError(null);

    try {
      // Convert image to base64
      const imageToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            // Remove the data:image/jpeg;base64, prefix
            const base64 = result.split(",")[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      };

      const imageBase64 = await imageToBase64(diseaseImage);

      const prompt = `You are an expert plant pathologist and agricultural disease specialist. Analyze this plant image and identify any diseases or health issues.

Please provide your response ONLY as a valid JSON object with exactly this structure (no additional text, no markdown, just the JSON object):
{
  "name": "Disease Name (e.g., Early Blight, Powdery Mildew, Leaf Spot)",
  "confidence": 85,
  "symptoms": [
    "Symptom description 1",
    "Symptom description 2",
    "Symptom description 3",
    "Symptom description 4"
  ],
  "treatment": [
    "Treatment recommendation 1",
    "Treatment recommendation 2",
    "Treatment recommendation 3",
    "Treatment recommendation 4",
    "Treatment recommendation 5"
  ],
  "prevention": [
    "Prevention measure 1",
    "Prevention measure 2",
    "Prevention measure 3",
    "Prevention measure 4",
    "Prevention measure 5"
  ],
  "scientificName": "Scientific name of the pathogen (e.g., Alternaria solani, Erysiphales order)"
}

Guidelines for analysis:
1. Focus on common agricultural diseases affecting crops like tomatoes, potatoes, rice, wheat, etc.
2. Provide confidence percentage based on visual symptoms (70-95 range)
3. Include 4-5 specific symptoms observed or typically associated
4. Provide 4-5 practical treatment recommendations
5. Include 4-5 prevention measures
6. Use proper scientific nomenclature when possible
7. If no disease is detected, classify as "Healthy Plant" with confidence 90-95%
8. Consider regional context if location is available: ${location || "India"}

Analyze the image carefully and provide accurate, helpful agricultural advice.`;

      const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

      if (!GEMINI_API_KEY) {
        throw new Error("Gemini API key not found in environment variables");
      }

      const models = [
        "gemini-2.5-flash-lite", // Primary model for vision analysis
        "gemini-2.5-flash", // Fallback model
      ];

      let diseaseResult = null;

      for (const model of models) {
        try {
          console.log(`Trying Gemini model: ${model} for image analysis`);

          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        text: prompt,
                      },
                      {
                        inlineData: {
                          mimeType: diseaseImage.type,
                          data: imageBase64,
                        },
                      },
                    ],
                  },
                ],
                generationConfig: {
                  temperature: 0.4,
                  topK: 32,
                  topP: 0.8,
                  maxOutputTokens: 2048,
                },
              }),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            console.warn(`Model ${model} failed:`, errorData);
            continue; // Try next model
          }

          const data = await response.json();

          if (
            !data.candidates ||
            !data.candidates[0] ||
            !data.candidates[0].content
          ) {
            console.warn(`Model ${model} returned invalid response structure`);
            continue; // Try next model
          }

          const content = data.candidates[0].content.parts[0].text;

          // Clean up the response to extract JSON
          let cleanedContent = content.trim();

          // Remove markdown code blocks if present
          const jsonMatch = cleanedContent.match(
            /```(?:json)?\n?([\s\S]*?)```/
          );
          if (jsonMatch) {
            cleanedContent = jsonMatch[1].trim();
          }

          // Try to parse the JSON
          try {
            const parsed = JSON.parse(cleanedContent);

            // Validate the structure
            if (
              parsed &&
              typeof parsed === "object" &&
              parsed.name &&
              typeof parsed.confidence === "number" &&
              Array.isArray(parsed.symptoms) &&
              Array.isArray(parsed.treatment) &&
              Array.isArray(parsed.prevention) &&
              parsed.scientificName
            ) {
              diseaseResult = parsed;
              console.log(
                `Successfully used model: ${model} for image analysis`
              );
              break; // Success, exit the loop
            } else {
              console.warn(
                `Model ${model} returned invalid JSON structure:`,
                parsed
              );
              continue; // Try next model
            }
          } catch (parseError) {
            console.error(
              `Model ${model} returned invalid JSON:`,
              cleanedContent
            );
            continue; // Try next model
          }
        } catch (error) {
          console.error(`Error with model ${model}:`, error);
          continue; // Try next model
        }
      }

      if (diseaseResult) {
        setDiseaseResult(diseaseResult);
      } else {
        throw new Error(
          "All Gemini models failed to analyze the image properly"
        );
      }
    } catch (error) {
      console.error("Error analyzing disease:", error);
      setError(
        "Failed to analyze image. Please try again with a clearer photo."
      );

      // Fallback to mock data if AI fails
      const mockDiseases: Disease[] = [
        {
          name: "Unable to Analyze",
          confidence: 0,
          symptoms: [
            "Image analysis failed",
            "Please try uploading a clearer image",
            "Ensure the plant parts are clearly visible",
            "Avoid blurry or dark photos",
          ],
          treatment: [
            "Upload a clearer image for better analysis",
            "Ensure good lighting when taking photos",
            "Focus on affected areas of the plant",
            "Try different angles if possible",
          ],
          prevention: [
            "Take clear, well-lit photos for accurate analysis",
            "Include multiple views of affected areas",
            "Avoid uploading very large files",
            "Ensure the image shows plant symptoms clearly",
          ],
          scientificName: "Analysis Failed",
        },
      ];

      setDiseaseResult(mockDiseases[0]);
    }
    setLoading(false);
  };

  // AI Planting Guide
  const getAIPlantingGuide = async (cropName: string) => {
    if (!cropName) return;

    setLoading(true);
    setError(null);

    try {
      const prompt = `You are an expert agricultural advisor. Create a comprehensive planting guide for ${cropName}.

Provide your response ONLY as a valid JSON object with exactly this structure (no additional text, no markdown, just the JSON object):
{
  "crop": "${cropName}",
  "soilType": ["soil requirement 1", "soil requirement 2", "soil requirement 3", "soil requirement 4"],
  "plantingSeason": "best planting season with months",
  "spacing": "plant spacing details",
  "watering": "watering requirements and schedule",
  "fertilization": "fertilization schedule and nutrients",
  "harvesting": "harvesting timeframe and methods",
  "companionPlants": ["plant1", "plant2", "plant3", "plant4"],
  "tips": ["expert tip 1", "expert tip 2", "expert tip 3", "expert tip 4", "expert tip 5"]
}

Ensure all fields are filled with detailed, practical information specific to ${cropName}.`;

      const guide = await callGeminiAPI(prompt);
      if (guide && typeof guide === "object" && guide.crop) {
        setPlantingGuide(guide);
      } else {
        throw new Error("Invalid response format from AI");
      }
    } catch (error) {
      console.error("Error fetching planting guide:", error);
      // Fallback mock data
      const guides: { [key: string]: PlantingGuide } = {
        Tomato: {
          crop: "Tomato",
          soilType: [
            "Well-drained loamy soil",
            "pH 6.0-6.8",
            "Rich in organic matter",
            "Good water retention capacity",
          ],
          plantingSeason: "October-November (Winter), February-March (Summer)",
          spacing: "60cm between rows, 45cm between plants",
          watering:
            "Regular watering (2-3 times/week), Avoid waterlogging, Drip irrigation recommended, Maintain consistent soil moisture",
          fertilization:
            "NPK 19:19:19 for vegetative growth, Switch to 13:0:45 during flowering, Apply organic compost, Foliar spray of micronutrients",
          harvesting:
            "75-90 days after transplanting, Harvest when fruit is firm and fully colored, Pick in cool morning hours",
          companionPlants: [
            "Basil",
            "Marigold",
            "Carrot",
            "Onion",
            "Parsley",
            "Garlic",
          ],
          tips: [
            "Stake plants for better support and air circulation",
            "Remove suckers for better fruit development",
            "Monitor for pests like whiteflies and aphids regularly",
            "Maintain consistent soil moisture to prevent blossom end rot",
            "Use yellow sticky traps for pest monitoring",
          ],
        },
        Rice: {
          crop: "Rice",
          soilType: [
            "Clay loam soil",
            "pH 5.5-6.5",
            "High water retention capacity",
            "Rich in organic content",
          ],
          plantingSeason: "June-July (Kharif), November-December (Rabi)",
          spacing: "20cm x 15cm (transplanting), 2-3 seedlings per hill",
          watering:
            "Continuous flooding 2-5cm depth, Drain before harvesting, Maintain proper water level",
          fertilization:
            "Basal: 60kg N, 30kg P, 30kg K per hectare, Top dressing: 30kg N at tillering and panicle stage",
          harvesting:
            "120-150 days after sowing, When 80% grains turn golden yellow, Harvest at proper moisture content",
          companionPlants: [
            "Azolla (nitrogen fixation)",
            "Duck weed",
            "Water fern",
          ],
          tips: [
            "Proper land leveling essential for uniform water distribution",
            "Control weeds in early stages of growth",
            "Monitor for brown plant hopper and stem borer",
            "Ensure proper drainage before harvest",
            "Use certified seeds for better yield",
          ],
        },
        Wheat: {
          crop: "Wheat",
          soilType: [
            "Well-drained loamy soil",
            "pH 6.0-7.5",
            "Good fertility",
            "Moderate water holding capacity",
          ],
          plantingSeason: "November-December (Rabi season)",
          spacing:
            "22.5cm between rows, Broadcast sowing for traditional method",
          watering:
            "Critical stages: Crown root, Tillering, Jointing, Flowering, Milk stage, 4-6 irrigations total",
          fertilization:
            "NPK 120:60:40 kg/ha, Apply nitrogen in 3 splits, Zinc application for better yield",
          harvesting:
            "110-130 days after sowing, When grains harden and moisture is 20-25%, Use combine harvester",
          companionPlants: [
            "Mustard as border crop",
            "Chickpea in mixed cropping",
            "Linseed",
          ],
          tips: [
            "Timely sowing is crucial for good yield",
            "Use certified seeds of recommended varieties",
            "Control weeds at 30-35 days after sowing",
            "Protect from rust diseases with timely spraying",
            "Harvest at proper moisture content to avoid losses",
          ],
        },
        Cotton: {
          crop: "Cotton",
          soilType: [
            "Deep black cotton soil",
            "pH 6.5-8.0",
            "Good drainage",
            "Rich in calcium",
          ],
          plantingSeason: "April-May (Summer), June-July (Kharif)",
          spacing:
            "90cm x 60cm (Normal spacing), 60cm x 30cm (High density planting)",
          watering:
            "Critical stages: Flowering and boll development, Avoid water stress, Drip irrigation recommended",
          fertilization:
            "NPK 100:50:50 kg/ha, Additional micronutrients, Split application of nitrogen",
          harvesting:
            "150-180 days after sowing, Multiple pickings when bolls open, Hand picking for quality",
          companionPlants: [
            "Marigold for pest control",
            "Castor as border crop",
            "Soybean in intercropping",
          ],
          tips: [
            "Monitor for pink bollworm regularly",
            "Use pheromone traps for pest management",
            "Proper spacing prevents disease spread",
            "Regular scouting for nutrient deficiencies",
            "Avoid late picking to maintain fiber quality",
          ],
        },
        Maize: {
          crop: "Maize",
          soilType: [
            "Well-drained loamy soil",
            "pH 6.0-7.0",
            "Rich in organic matter",
            "Good water holding capacity",
          ],
          plantingSeason: "June-July (Kharif), February-March (Rabi)",
          spacing: "60cm x 25cm between rows and plants",
          watering:
            "Regular irrigation during critical growth stages, Avoid waterlogging, 500-600mm total water requirement",
          fertilization:
            "NPK 120:60:40 kg/ha, Apply nitrogen in splits, Zinc and boron as micronutrients",
          harvesting:
            "90-120 days after sowing, When kernels are hard and milky layer disappears, Harvest at 20-25% moisture",
          companionPlants: ["Beans", "Squash", "Pumpkin", "Cowpea"],
          tips: [
            "Ensure proper seed treatment before sowing",
            "Practice crop rotation to prevent diseases",
            "Monitor for stem borers and fall armyworm",
            "Intercrop with legumes for nitrogen fixation",
            "Harvest at right moisture content to avoid losses",
          ],
        },
        Potato: {
          crop: "Potato",
          soilType: [
            "Sandy loam soil",
            "pH 5.5-6.5",
            "Well-drained",
            "Free from stones and clods",
          ],
          plantingSeason:
            "October-November (Autumn), January-February (Spring)",
          spacing: "60cm between rows, 20cm between plants",
          watering:
            "Keep soil moist but not waterlogged, Critical during tuber initiation, Reduce watering before harvest",
          fertilization:
            "NPK 200:100:150 kg/ha, High potassium requirement, Apply farmyard manure",
          harvesting:
            "75-90 days after planting, When haulms turn yellow, Cure tubers for 2-3 weeks before storage",
          companionPlants: ["Beans", "Corn", "Horseradish", "Cabbage"],
          tips: [
            "Use certified disease-free seed potatoes",
            "Practice proper crop rotation",
            "Hill up soil around plants for better tuber development",
            "Control late blight with timely fungicide application",
            "Store in cool, dark place at 4-7°C",
          ],
        },
        Onion: {
          crop: "Onion",
          soilType: [
            "Fertile loamy soil",
            "pH 6.0-7.0",
            "Good drainage",
            "Rich in organic matter",
          ],
          plantingSeason: "October-November (Rabi), March-April (Summer)",
          spacing: "15cm x 10cm for seeds, 30cm x 15cm for seedlings",
          watering:
            "Regular light irrigation, Avoid overwatering, Critical during bulb formation",
          fertilization:
            "NPK 100:50:50 kg/ha, Apply phosphorus at planting, Nitrogen in splits",
          harvesting:
            "90-120 days after sowing, When tops fall over naturally, Dry in field for 7-10 days",
          companionPlants: ["Carrot", "Lettuce", "Tomato", "Strawberry"],
          tips: [
            "Use healthy seed or seedlings",
            "Maintain proper plant spacing for good bulb development",
            "Control thrips and onion fly with insecticides",
            "Avoid excessive nitrogen to prevent bolting",
            "Cure bulbs properly before storage",
          ],
        },
        Garlic: {
          crop: "Garlic",
          soilType: [
            "Well-drained loamy soil",
            "pH 6.0-7.0",
            "Rich in organic matter",
            "Avoid waterlogged soils",
          ],
          plantingSeason: "October-November (Rabi)",
          spacing: "20cm between rows, 10cm between cloves",
          watering:
            "Moderate irrigation, Keep soil moist during bulb formation, Stop watering 2-3 weeks before harvest",
          fertilization:
            "NPK 100:50:50 kg/ha, Apply well-decomposed FYM, Split nitrogen application",
          harvesting:
            "120-150 days after planting, When leaves turn yellow, Dry bulbs in shade",
          companionPlants: ["Tomato", "Carrot", "Cabbage", "Rose"],
          tips: [
            "Use healthy, disease-free cloves",
            "Plant cloves with pointed end up",
            "Control nematodes with soil fumigation",
            "Avoid planting after onion family crops",
            "Store in cool, dry place",
          ],
        },
        Soybean: {
          crop: "Soybean",
          soilType: [
            "Well-drained clay loam soil",
            "pH 6.0-7.5",
            "Rich in organic matter",
            "Good water holding capacity",
          ],
          plantingSeason: "June-July (Kharif)",
          spacing: "45cm x 5-10cm between rows and plants",
          watering:
            "Rainfed crop, Supplementary irrigation if needed, Critical during flowering and pod filling",
          fertilization:
            "NPK 20:40:20 kg/ha, Inoculate with Rhizobium, Apply phosphorus at sowing",
          harvesting:
            "90-110 days after sowing, When pods turn yellow and dry, Harvest at 15-18% moisture",
          companionPlants: ["Maize", "Cotton", "Sugarcane", "Sorghum"],
          tips: [
            "Inoculate seeds with Rhizobium culture",
            "Practice crop rotation with cereals",
            "Control pod borers and aphids",
            "Harvest at right maturity to avoid shattering",
            "Dry properly before storage",
          ],
        },
        Sugarcane: {
          crop: "Sugarcane",
          soilType: [
            "Deep alluvial soil",
            "pH 6.5-7.5",
            "Good drainage",
            "Rich in organic matter",
          ],
          plantingSeason: "February-March (Spring), September-October (Autumn)",
          spacing: "90cm between rows, 30cm between setts",
          watering:
            "Frequent irrigation, 2000-2500mm annual rainfall, Critical during tillering and grand growth",
          fertilization:
            "NPK 250:100:250 kg/ha, Heavy nitrogen requirement, Apply in splits",
          harvesting:
            "12-18 months after planting, When juice content is high, Harvest during cool months",
          companionPlants: ["Groundnut", "Soybean", "Pigeon pea", "Turmeric"],
          tips: [
            "Use healthy, disease-free setts",
            "Provide adequate irrigation throughout growth",
            "Control weeds during early growth",
            "Monitor for red rot and smut diseases",
            "Harvest at optimum maturity for better sugar recovery",
          ],
        },
        Banana: {
          crop: "Banana",
          soilType: [
            "Deep, fertile alluvial soil",
            "pH 6.5-7.5",
            "Good drainage",
            "Rich in organic matter",
          ],
          plantingSeason: "June-July (Monsoon), January-February (Spring)",
          spacing: "2.5m x 2.5m for tall varieties, 2m x 2m for dwarf",
          watering:
            "Regular irrigation, 1500-2000mm annual rainfall, Avoid water stress during fruit development",
          fertilization:
            "NPK 200:100:300 kg/ha, Apply organic manure, Foliar application of micronutrients",
          harvesting:
            "12-15 months after planting, When fruits are mature, Harvest in bunches",
          companionPlants: ["Pineapple", "Ginger", "Turmeric", "Cardamom"],
          tips: [
            "Use tissue culture plants for disease-free crop",
            "Provide wind protection during high winds",
            "Control banana weevil and nematodes",
            "Remove male bud after fruit set",
            "Handle fruits carefully to avoid bruising",
          ],
        },
        Mango: {
          crop: "Mango",
          soilType: [
            "Deep, well-drained loamy soil",
            "pH 6.0-7.5",
            "Good water holding capacity",
            "Free from hard pan",
          ],
          plantingSeason: "June-July (Monsoon), December-January (Winter)",
          spacing: "10m x 10m for regular, 5m x 5m for dwarf varieties",
          watering:
            "Regular irrigation during dry periods, Avoid waterlogging, Critical during flowering and fruit development",
          fertilization:
            "NPK 500:250:500 g/tree/year, Apply FYM annually, Zinc and boron as micronutrients",
          harvesting:
            "4-6 years after planting, When fruits are mature, Harvest manually with care",
          companionPlants: ["Lemon grass", "Turmeric", "Ginger", "Marigold"],
          tips: [
            "Choose grafted plants from reliable nurseries",
            "Prune regularly for proper shape and fruiting",
            "Control mango hopper and fruit fly",
            "Protect from frost during winter",
            "Harvest at proper maturity for better quality",
          ],
        },
        Coffee: {
          crop: "Coffee",
          soilType: [
            "Well-drained red loamy soil",
            "pH 5.5-6.5",
            "Rich in organic matter",
            "Slightly acidic",
          ],
          plantingSeason:
            "March-April (Pre-monsoon), October-November (Post-monsoon)",
          spacing: "2.5m x 2.5m for Arabica, 2m x 2m for Robusta",
          watering:
            "1500-2000mm annual rainfall, Supplementary irrigation during dry spells, Shade management important",
          fertilization:
            "NPK 200:100:200 kg/ha, Apply organic manure, Regular soil testing recommended",
          harvesting:
            "3-4 years after planting, When cherries are red ripe, Selective hand picking",
          companionPlants: ["Pepper", "Cardamom", "Banana", "Ginger"],
          tips: [
            "Provide 50% shade during early years",
            "Prune regularly for bushy growth",
            "Control coffee berry borer and leaf rust",
            "Process beans immediately after harvest",
            "Maintain proper drying and storage conditions",
          ],
        },
        Tea: {
          crop: "Tea",
          soilType: [
            "Well-drained acidic soil",
            "pH 4.5-5.5",
            "Rich in organic matter",
            "Good water holding capacity",
          ],
          plantingSeason: "March-April (Pre-monsoon), July-August (Monsoon)",
          spacing: "75cm x 60cm for orthodox, 60cm x 45cm for CTC",
          watering:
            "2000-3000mm annual rainfall, Fog and mist beneficial, Supplementary irrigation in dry areas",
          fertilization:
            "NPK 120:60:120 kg/ha, Apply FYM regularly, Maintain soil pH with lime",
          harvesting:
            "2-3 years after planting, Pluck two leaves and a bud, Regular plucking maintains quality",
          companionPlants: ["Cardamom", "Ginger", "Turmeric", "Lemon grass"],
          tips: [
            "Use clonal planting material",
            "Maintain proper shade (50-60%)",
            "Control blister blight and red spider mite",
            "Regular plucking improves yield and quality",
            "Process leaves within hours of harvest",
          ],
        },
      };

      setTimeout(() => {
        setPlantingGuide(guides[cropName] || null);
        setLoading(false);
      }, 1000);
      return;
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedCrop) {
      getAIPlantingGuide(selectedCrop);
    }
  }, [selectedCrop]);

  useEffect(() => {
    if (activeTab === "market-prices") {
      fetchMarketPrices();
    }
  }, [activeTab]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDiseaseImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const tabs = [
    { id: "crop-recommendation", name: "Crop Advisor", icon: Leaf },
    { id: "disease-detection", name: "Plant Doctor", icon: Camera },
    { id: "planting-guide", name: "Farming Guide", icon: BookOpen },
    { id: "market-prices", name: "Market Prices", icon: TrendingUp },
    { id: "weather", name: "Weather", icon: Cloud },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "Up":
        return "🔼";
      case "Down":
        return "🔽";
      default:
        return "➡️";
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "Up":
        return "text-green-600";
      case "Down":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Crop":
        return "bg-green-100 text-green-800";
      case "Animal":
        return "bg-orange-100 text-orange-800";
      case "Plant":
        return "bg-blue-100 text-blue-800";
      case "Anime":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case "rainy":
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      case "cloudy":
        return <Cloud className="w-8 h-8 text-gray-500" />;
      case "stormy":
        return <Zap className="w-8 h-8 text-purple-500" />;
      default:
        return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-3 rounded-xl">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  AgriTech AI Hub - Farmer Tools
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Smart Farming Solutions Powered by AI
                </p>
              </div>
            </div>

            {/* Weather Widget */}
            {weatherData && (
              <div className="hidden md:flex items-center bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl px-6 py-3 border border-blue-100">
                {getWeatherIcon(weatherData.condition)}
                <div className="border-r border-blue-200 pr-4 ml-3">
                  <div className="text-2xl font-bold text-gray-900">
                    {weatherData.temperature}°C
                  </div>
                  <div className="text-xs text-gray-600">
                    {weatherData.condition}
                  </div>
                  <div className="text-xs text-gray-500">
                    {weatherData.location}
                  </div>
                </div>
                <div className="flex items-center space-x-4 ml-4">
                  <div className="flex items-center">
                    <CloudRain className="w-4 h-4 text-blue-500 mr-1" />
                    <span className="text-sm text-gray-700">
                      {weatherData.humidity}%
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Zap className="w-4 h-4 text-gray-500 mr-1" />
                    <span className="text-sm text-gray-700">
                      {weatherData.windSpeed}km/h
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Sun className="w-4 h-4 text-orange-500 mr-1" />
                    <span className="text-sm text-gray-700">
                      UV {weatherData.uvIndex}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* API Key Input */}
            <div className="hidden md:flex items-center space-x-4"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-green-600 text-white shadow-lg shadow-green-200 scale-105"
                    : "bg-white text-gray-700 hover:bg-green-50 border-2 border-green-100 hover:border-green-300"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="mb-8 bg-white rounded-xl shadow-lg p-8">
            <div className="flex flex-col items-center justify-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600 absolute top-0 left-0"></div>
              </div>
              <p className="mt-4 text-lg text-gray-700 font-medium">
                AI is analyzing your data...
              </p>
              <p className="text-sm text-gray-500">
                This may take a few moments
              </p>
            </div>
          </div>
        )}

        {/* Crop Recommendation Tab */}
        {activeTab === "crop-recommendation" && !loading && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    AI Crop Advisor
                  </h2>
                  <p className="text-green-100 mt-2">
                    Get personalized crop recommendations based on your
                    conditions
                  </p>
                </div>
                <Leaf className="w-12 h-12 text-white opacity-50" />
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter your location"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                  {userLocation && (
                    <p className="text-xs text-green-600 mt-2 flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Using your current location
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Sprout className="w-4 h-4 inline mr-1" />
                    Soil Type *
                  </label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Soil Type</option>
                    <option value="Clay">Clay</option>
                    <option value="Loam">Loam</option>
                    <option value="Sandy">Sandy</option>
                    <option value="Silt">Silt</option>
                    <option value="Black Cotton">Black Cotton</option>
                    <option value="Red">Red</option>
                    <option value="Alluvial">Alluvial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Sun className="w-4 h-4 inline mr-1" />
                    Season *
                  </label>
                  <select
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Season</option>
                    <option value="Winter">Winter (Rabi)</option>
                    <option value="Summer">Summer (Zaid)</option>
                    <option value="Monsoon">Monsoon (Kharif)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    Land Size (acres)
                  </label>
                  <input
                    type="number"
                    value={landSize}
                    onChange={(e) => setLandSize(e.target.value)}
                    placeholder="Enter land size"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <button
                onClick={getAICropRecommendations}
                disabled={loading}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
              >
                <Leaf className="w-5 h-5 mr-2" />
                Get AI Recommendations
              </button>

              {cropRecommendations.length > 0 && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Recommended Crops for You
                  </h3>
                  {cropRecommendations.map((crop, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 hover:border-green-400 transition-all hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h4 className="text-2xl font-bold text-gray-900">
                              {crop.name}
                            </h4>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                crop.suitability >= 80
                                  ? "bg-green-600 text-white"
                                  : crop.suitability >= 60
                                  ? "bg-yellow-500 text-white"
                                  : "bg-gray-400 text-white"
                              }`}
                            >
                              {crop.suitability}% Match
                            </span>
                          </div>

                          <p className="text-gray-700 mb-4">
                            {crop.description}
                          </p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-lg p-3 border border-green-100">
                              <div className="text-xs text-gray-600 mb-1">
                                Season
                              </div>
                              <div className="font-semibold text-gray-900">
                                {crop.season}
                              </div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-green-100">
                              <div className="text-xs text-gray-600 mb-1">
                                Duration
                              </div>
                              <div className="font-semibold text-gray-900">
                                {crop.duration}
                              </div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-green-100">
                              <div className="text-xs text-gray-600 mb-1">
                                Profit Margin
                              </div>
                              <div className="font-semibold text-green-600">
                                {crop.profitMargin}
                              </div>
                            </div>
                            <div className="bg-white rounded-lg p-3 border border-green-100">
                              <div className="text-xs text-gray-600 mb-1">
                                Risk Level
                              </div>
                              <div
                                className={`font-semibold ${
                                  crop.risk === "Low"
                                    ? "text-green-600"
                                    : crop.risk === "Medium"
                                    ? "text-yellow-600"
                                    : "text-red-600"
                                }`}
                              >
                                {crop.risk}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Disease Detection Tab */}
        {activeTab === "disease-detection" && !loading && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-pink-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    AI Plant Doctor
                  </h2>
                  <p className="text-red-100 mt-2">
                    Upload a photo to detect plant diseases instantly
                  </p>
                </div>
                <Camera className="w-12 h-12 text-white opacity-50" />
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="border-3 border-dashed border-gray-300 rounded-2xl p-12 text-center bg-gray-50 hover:bg-gray-100 transition-all">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="disease-image"
                    />
                    <label htmlFor="disease-image" className="cursor-pointer">
                      <Camera className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-semibold text-gray-700 mb-2">
                        Click to upload plant image
                      </p>
                      <p className="text-sm text-gray-500">
                        JPG, PNG up to 10MB
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Take a clear photo of affected leaves or plant parts
                      </p>
                    </label>
                  </div>

                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Uploaded plant"
                        className="w-full h-80 object-cover rounded-xl border-2 border-gray-200"
                      />
                      <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      {diseaseImage && (
                        <p className="text-sm text-gray-600 mt-3 text-center">
                          {diseaseImage.name}
                        </p>
                      )}
                    </div>
                  )}

                  <button
                    onClick={analyzeDiseaseWithAI}
                    disabled={!diseaseImage || loading}
                    className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-4 rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Analyze with AI
                  </button>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Tips for Best Results
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Take photos in good lighting</li>
                      <li>• Focus on affected areas clearly</li>
                      <li>• Avoid blurry or dark images</li>
                      <li>• Include multiple symptoms if possible</li>
                    </ul>
                  </div>
                </div>

                {diseaseResult && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border-2 border-red-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-red-900">
                          {diseaseResult.name}
                        </h3>
                        <div className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                          {diseaseResult.confidence}% Confidence
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-600">Scientific Name</p>
                        <p className="text-red-800 font-semibold italic">
                          {diseaseResult.scientificName}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
                        Symptoms Identified
                      </h4>
                      <ul className="space-y-2">
                        {diseaseResult.symptoms.map((symptom, index) => (
                          <li key={index} className="flex items-start">
                            <span className="bg-orange-100 text-orange-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold mr-3 mt-0.5">
                              {index + 1}
                            </span>
                            <span className="text-gray-700 flex-1">
                              {symptom}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                      <h4 className="font-bold text-green-900 mb-3 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        AI Recommended Treatment
                      </h4>
                      <ul className="space-y-2">
                        {diseaseResult.treatment.map((treatment, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{treatment}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                      <h4 className="font-bold text-blue-900 mb-3">
                        Prevention Measures
                      </h4>
                      <ul className="space-y-2">
                        {diseaseResult.prevention.map((prevention, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-600 mr-2">→</span>
                            <span className="text-gray-700">{prevention}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Planting Guide Tab */}
        {activeTab === "planting-guide" && !loading && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    AI Farming Guide
                  </h2>
                  <p className="text-purple-100 mt-2">
                    Comprehensive planting guides for your crops
                  </p>
                </div>
                <BookOpen className="w-12 h-12 text-white opacity-50" />
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Select Your Crop
                    </label>
                    <select
                      value={selectedCrop}
                      onChange={(e) => setSelectedCrop(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="">Choose a crop...</option>
                      <option value="Tomato">🍅 Tomato</option>
                      <option value="Rice">🌾 Rice</option>
                      <option value="Wheat">🌾 Wheat</option>
                      <option value="Cotton">🌸 Cotton</option>
                      <option value="Pulses (Lentils)">
                        🫘 Pulses (Lentils)
                      </option>
                      <option value="Maize">🌽 Maize</option>
                      <option value="Potato">� Potato</option>
                      <option value="Onion">🧅 Onion</option>
                      <option value="Garlic">🧄 Garlic</option>
                      <option value="Soybean">�🫘 Soybean</option>
                      <option value="Sugarcane">🎋 Sugarcane</option>
                      <option value="Banana">🍌 Banana</option>
                      <option value="Mango">🥭 Mango</option>
                      <option value="Coffee">☕ Coffee</option>
                      <option value="Tea">🍵 Tea</option>
                    </select>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-200">
                    <h3 className="font-bold text-purple-900 mb-4 flex items-center">
                      <Leaf className="w-5 h-5 mr-2" />
                      Smart Farming Tips
                    </h3>
                    <ul className="space-y-3 text-purple-800 text-sm">
                      <li className="flex items-start">
                        <span className="bg-purple-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0">
                          1
                        </span>
                        <span>
                          Monitor soil moisture regularly with sensors
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-purple-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0">
                          2
                        </span>
                        <span>Use AI-powered pest detection systems</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-purple-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0">
                          3
                        </span>
                        <span>Implement precision agriculture techniques</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-purple-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0">
                          4
                        </span>
                        <span>Track crop growth with drone imagery</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-purple-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0">
                          5
                        </span>
                        <span>Maintain detailed farming records</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="lg:col-span-2">
                  {plantingGuide ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-3xl font-bold text-gray-900">
                          {plantingGuide.crop}
                        </h3>
                        <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-semibold">
                          AI Generated Guide
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200">
                          <h4 className="font-bold text-green-900 mb-3 flex items-center">
                            <div className="bg-green-200 rounded-full p-2 mr-2">
                              <Leaf className="w-4 h-4 text-green-700" />
                            </div>
                            Soil Requirements
                          </h4>
                          <ul className="space-y-2 text-green-800">
                            {plantingGuide.soilType.map((soil, index) => (
                              <li key={index} className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>{soil}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-5 border-2 border-yellow-200">
                          <h4 className="font-bold text-yellow-900 mb-3 flex items-center">
                            <div className="bg-yellow-200 rounded-full p-2 mr-2">
                              <Sun className="w-4 h-4 text-yellow-700" />
                            </div>
                            Planting Season
                          </h4>
                          <p className="text-yellow-800 font-medium">
                            {plantingGuide.plantingSeason}
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border-2 border-blue-200">
                          <h4 className="font-bold text-blue-900 mb-3 flex items-center">
                            <div className="bg-blue-200 rounded-full p-2 mr-2">
                              <CloudRain className="w-4 h-4 text-blue-700" />
                            </div>
                            Watering Guide
                          </h4>
                          <p className="text-blue-800">
                            {plantingGuide.watering}
                          </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-200">
                          <h4 className="font-bold text-purple-900 mb-3 flex items-center">
                            <div className="bg-purple-200 rounded-full p-2 mr-2">
                              <TrendingUp className="w-4 h-4 text-purple-700" />
                            </div>
                            Plant Spacing
                          </h4>
                          <p className="text-purple-800">
                            {plantingGuide.spacing}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200">
                        <h4 className="font-bold text-orange-900 mb-3 flex items-center">
                          <Calculator className="w-5 h-5 mr-2" />
                          Fertilization Schedule
                        </h4>
                        <p className="text-orange-800">
                          {plantingGuide.fertilization}
                        </p>
                      </div>

                      {plantingGuide.companionPlants &&
                        plantingGuide.companionPlants.length > 0 && (
                          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
                            <h4 className="font-bold text-indigo-900 mb-4">
                              Companion Plants
                            </h4>
                            <div className="flex flex-wrap gap-3">
                              {plantingGuide.companionPlants.map(
                                (plant, index) => (
                                  <span
                                    key={index}
                                    className="bg-indigo-200 text-indigo-900 px-4 py-2 rounded-full text-sm font-semibold"
                                  >
                                    {plant}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}

                      <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-6 border-2 border-red-200">
                        <h4 className="font-bold text-red-900 mb-3">
                          Harvesting Information
                        </h4>
                        <p className="text-red-800 font-medium">
                          {plantingGuide.harvesting}
                        </p>
                      </div>

                      {plantingGuide.tips && plantingGuide.tips.length > 0 && (
                        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border-2 border-teal-200">
                          <h4 className="font-bold text-teal-900 mb-4">
                            Expert Tips
                          </h4>
                          <ul className="space-y-3">
                            {plantingGuide.tips.map((tip, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-teal-600 mr-3 mt-0.5 flex-shrink-0" />
                                <span className="text-teal-800">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <BookOpen className="w-24 h-24 text-gray-300 mb-4" />
                      <p className="text-xl text-gray-600 font-medium">
                        Select a crop to view planting guide
                      </p>
                      <p className="text-gray-500 mt-2">
                        Get AI-powered comprehensive farming instructions
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Market Prices Tab */}
        {activeTab === "market-prices" && !loading && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    Market Intelligence
                  </h2>
                  <p className="text-orange-100 mt-2">
                    Real-time prices and trends for crops, animals, plants &
                    anime
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-white opacity-50" />
              </div>
            </div>

            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Current Market Prices
                </h3>
                <button
                  onClick={fetchMarketPrices}
                  className="bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-all flex items-center"
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Refresh Prices
                </button>
              </div>

              {marketPrices.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {marketPrices.map((price, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border-2 border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">
                            {price.commodity}
                          </h4>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
                              price.category
                            )}`}
                          >
                            {price.category}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            ₹{price.currentPrice}
                            <span className="text-sm text-gray-600 ml-1">
                              /{price.unit}
                            </span>
                          </div>
                          <div
                            className={`flex items-center justify-end text-sm font-semibold ${getTrendColor(
                              price.trend
                            )}`}
                          >
                            <span className="mr-1">
                              {getTrendIcon(price.trend)}
                            </span>
                            ₹{Math.abs(price.priceChange)} (
                            {price.priceChangePercent}%)
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Market:</span>
                          <span className="font-semibold">{price.market}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Demand:</span>
                          <span
                            className={`font-semibold ${
                              price.demand === "High"
                                ? "text-green-600"
                                : price.demand === "Medium"
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {price.demand}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Trend:</span>
                          <span
                            className={`font-semibold ${getTrendColor(
                              price.trend
                            )}`}
                          >
                            {price.trend}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Updated:</span>
                          <span className="font-semibold">
                            {price.lastUpdated}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-700">
                          {price.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Loading market data...</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Fetching latest prices and trends
                  </p>
                </div>
              )}

              <div className="mt-8 bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
                <h3 className="font-bold text-orange-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Market Insights & Recommendations
                </h3>
                <ul className="space-y-3 text-orange-800">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      High demand for organic tomatoes suggests good profit
                      potential
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      Consider diversifying into hydroponic crops for urban
                      markets
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      Anime merchandise shows growing market in agricultural
                      theme
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      Livestock prices trending up - good time for dairy
                      expansion
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Weather Tab */}
        {activeTab === "weather" && !loading && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    Weather Insights
                  </h2>
                  <p className="text-blue-100 mt-2">
                    Real-time weather data for smart farming decisions
                  </p>
                </div>
                <Cloud className="w-12 h-12 text-white opacity-50" />
              </div>
            </div>

            <div className="p-8">
              {/* Weather Location Input */}
              <div className="mb-6">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Location for Weather
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Enter city name or use current location"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    {userLocation && (
                      <p className="text-xs text-green-600 mt-2 flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Using your current location
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => fetchWeatherData()}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center"
                  >
                    <Cloud className="w-5 h-5 mr-2" />
                    Get Weather
                  </button>
                </div>
              </div>

              {weatherData ? (
                <div className="space-y-6">
                  {/* Current Weather Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-yellow-900">
                          Temperature
                        </h3>
                        <Sun className="w-8 h-8 text-yellow-500" />
                      </div>
                      <p className="text-4xl font-bold text-yellow-900">
                        {weatherData.temperature}°C
                      </p>
                      <p className="text-yellow-700 text-sm mt-2">
                        Feels like {weatherData.feelsLike}°C
                      </p>
                      <p className="text-yellow-600 text-xs mt-1">
                        {weatherData.condition}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-blue-900">Humidity</h3>
                        <CloudRain className="w-8 h-8 text-blue-500" />
                      </div>
                      <p className="text-4xl font-bold text-blue-900">
                        {weatherData.humidity}%
                      </p>
                      <p className="text-blue-700 text-sm mt-2">
                        Moisture level
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 border-2 border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900">Wind Speed</h3>
                        <Zap className="w-8 h-8 text-gray-500" />
                      </div>
                      <p className="text-4xl font-bold text-gray-900">
                        {weatherData.windSpeed}
                      </p>
                      <p className="text-gray-700 text-sm mt-2">km/h</p>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-indigo-900">Rainfall</h3>
                        <Cloud className="w-8 h-8 text-indigo-500" />
                      </div>
                      <p className="text-4xl font-bold text-indigo-900">
                        {weatherData.rainfall}
                      </p>
                      <p className="text-indigo-700 text-sm mt-2">mm today</p>
                    </div>
                  </div>

                  {/* Additional Weather Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                      <h4 className="font-bold text-green-900 mb-3 flex items-center">
                        <Sun className="w-5 h-5 mr-2" />
                        UV Index
                      </h4>
                      <p className="text-2xl font-bold text-green-900">
                        {weatherData.uvIndex}
                      </p>
                      <p className="text-green-700 text-sm mt-1">
                        {weatherData.uvIndex <= 2
                          ? "Low"
                          : weatherData.uvIndex <= 5
                          ? "Moderate"
                          : weatherData.uvIndex <= 7
                          ? "High"
                          : weatherData.uvIndex <= 10
                          ? "Very High"
                          : "Extreme"}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                      <h4 className="font-bold text-purple-900 mb-3 flex items-center">
                        <Cloud className="w-5 h-5 mr-2" />
                        Visibility
                      </h4>
                      <p className="text-2xl font-bold text-purple-900">
                        {weatherData.visibility} km
                      </p>
                      <p className="text-purple-700 text-sm mt-1">
                        {weatherData.visibility >= 10
                          ? "Excellent"
                          : weatherData.visibility >= 5
                          ? "Good"
                          : weatherData.visibility >= 2
                          ? "Moderate"
                          : "Poor"}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200">
                      <h4 className="font-bold text-orange-900 mb-3 flex items-center">
                        <MapPin className="w-5 h-5 mr-2" />
                        Location
                      </h4>
                      <p className="text-orange-900 font-medium">
                        {weatherData.location}
                      </p>
                      <p className="text-orange-700 text-sm mt-1">
                        Last updated:{" "}
                        {new Date(weatherData.lastUpdated).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Weather-Based Farming Recommendations */}
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                    <h3 className="font-bold text-blue-900 mb-4">
                      Weather-Based Farming Recommendations
                    </h3>
                    <ul className="space-y-3 text-blue-800">
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                        <span>
                          {weatherData.temperature >= 25 &&
                          weatherData.temperature <= 35
                            ? "Current temperature is ideal for most farming activities and crop growth"
                            : weatherData.temperature < 15
                            ? "Cool temperatures - consider protecting sensitive crops from cold"
                            : "High temperatures - ensure adequate irrigation and consider shade for seedlings"}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                        <span>
                          {weatherData.humidity >= 40 &&
                          weatherData.humidity <= 70
                            ? "Humidity levels are optimal for plant health"
                            : weatherData.humidity > 80
                            ? "High humidity - monitor for fungal diseases and ensure good air circulation"
                            : "Low humidity - increase irrigation frequency and consider misting"}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                        <span>
                          {weatherData.windSpeed <= 15
                            ? "Wind conditions are favorable for spraying pesticides and fieldwork"
                            : "Strong winds - avoid spraying operations and secure loose farming equipment"}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                        <span>
                          {weatherData.rainfall > 0
                            ? `Recent rainfall (${weatherData.rainfall}mm) - consider reducing irrigation and monitor soil moisture`
                            : "No recent rainfall - ensure adequate irrigation for crops"}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                        <span>
                          {weatherData.uvIndex <= 7
                            ? "UV levels are safe for outdoor farming work"
                            : "High UV index - use protective clothing and sunscreen during outdoor activities"}
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* 7-Day Farming Forecast (Mock for now) */}
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                    <h3 className="font-bold text-green-900 mb-4 flex items-center">
                      <Heart className="w-5 h-5 mr-2" />
                      7-Day Farming Forecast
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                        (day, index) => (
                          <div
                            key={day}
                            className="text-center bg-white rounded-lg p-3 border border-green-100"
                          >
                            <p className="font-semibold text-gray-900">{day}</p>
                            <Sun className="w-6 h-6 text-yellow-500 mx-auto my-1" />
                            <p className="text-sm font-bold text-gray-900">
                              {28 + index}°C
                            </p>
                            <p className="text-xs text-gray-600">
                              {65 - index}% humidity
                            </p>
                          </div>
                        )
                      )}
                    </div>
                    <p className="text-green-700 text-sm mt-4">
                      * 7-day forecast feature coming soon with premium
                      WeatherAPI plan
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Cloud className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Loading weather data...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmersTechTools;
