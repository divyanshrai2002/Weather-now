import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError("");
    setWeather(null);

    try {
      // Step 1: Get city coordinates
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("City not found");
        setLoading(false);
        return;
      }

      const { latitude, longitude } = geoData.results[0];

      // Step 2: Get weather data
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();

      setWeather({
        city: geoData.results[0].name,
        country: geoData.results[0].country,
        temperature: weatherData.current_weather.temperature,
        windspeed: weatherData.current_weather.windspeed,
        weathercode: weatherData.current_weather.weathercode,
      });
    } catch (error) {
      console.error(error);
      setError("Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-200 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Weather Now</h1>

      {/* Search Bar */}
      <div className="flex gap-2 mb-6 w-full max-w-md">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name..."
          className="flex-1 p-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={fetchWeather}
          className="px-5 py-3 bg-blue-500 text-white rounded-xl shadow-md hover:bg-blue-600 transition"
        >
          Search
        </button>
      </div>

      {/* Loading */}
      {loading && <p className="text-gray-600">Fetching weather...</p>}

      {/* Error */}
      {error && <p className="text-red-500 font-medium">{error}</p>}

      {/* Weather Card */}
      {weather && (
        <div className="bg-white rounded-2xl shadow-lg p-6 w-80 text-center">
          <h2 className="text-xl font-semibold mb-2">
            {weather.city}, {weather.country}
          </h2>
          <p className="text-4xl font-bold text-blue-600 mb-2">
            {weather.temperature}°C
          </p>
          <p className="text-gray-600">💨 {weather.windspeed} km/h wind</p>
        </div>
      )}
    </div>
  );
}

export default App;


