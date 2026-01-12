import { useState } from "react";
import "./Weather.css";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get coordinates from city name using OpenStreetMap Nominatim
  const getCoordinates = async (cityName) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        cityName
      )}&format=json&limit=1`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch location data");
    }

    const data = await response.json();

    if (data.length === 0) {
      throw new Error("City not found. Please check the spelling.");
    }

    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
      name: data[0].display_name,
    };
  };

  // Weather code to description mapping
  const getWeatherDescription = (code) => {
    const descriptions = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Foggy",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Slight snow",
      73: "Moderate snow",
      75: "Heavy snow",
      77: "Snow grains",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      85: "Slight snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail",
    };
    return descriptions[code] || "Unknown";
  };

  // Weather code to icon mapping
  const getWeatherIcon = (code, isDay) => {
    if (code === 0) return isDay ? "☀️" : "🌙";
    if (code <= 3) return isDay ? "🌤️" : "🌙";
    if (code <= 48) return "🌫️";
    if (code <= 55) return "🌦️";
    if (code <= 65) return "🌧️";
    if (code <= 77) return "🌨️";
    if (code <= 82) return "🌧️";
    if (code <= 86) return "🌨️";
    if (code >= 95) return "⛈️";
    return "🌡️";
  };

  const fetchWeather = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setWeatherData(null);

    try {
      // Use Marseille as default if no city is entered
      const searchCity = city.trim() || "Marseille";

      // First, get coordinates from city name
      const location = await getCoordinates(searchCity);

      // Then fetch weather data using coordinates
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,pressure_msl,is_day&timezone=auto`
      );

      if (!weatherResponse.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const weatherData = await weatherResponse.json();

      setWeatherData({
        location: location.name,
        temperature: weatherData.current.temperature_2m,
        feelsLike: weatherData.current.apparent_temperature,
        humidity: weatherData.current.relative_humidity_2m,
        windSpeed: weatherData.current.wind_speed_10m,
        pressure: weatherData.current.pressure_msl,
        weatherCode: weatherData.current.weather_code,
        isDay: weatherData.current.is_day,
        description: getWeatherDescription(weatherData.current.weather_code),
        icon: getWeatherIcon(
          weatherData.current.weather_code,
          weatherData.current.is_day
        ),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weather-container">
      <h1>Weather Forecast</h1>

      <form onSubmit={fetchWeather} className="weather-form">
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter city name (e.g., Paris, New York, Tokyo)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="weather-input"
          />
          <button type="submit" disabled={loading} className="weather-button">
            {loading ? "Loading..." : "Get Weather"}
          </button>
        </div>
      </form>

      {error && <div className="weather-error">{error}</div>}

      {weatherData && (
        <div className="weather-result">
          <h2>{weatherData.location}</h2>
          <div className="weather-info">
            <div className="weather-main">
              <div className="weather-icon">{weatherData.icon}</div>
              <div className="temperature">{Math.round(weatherData.temperature)}°C</div>
              <div className="description">{weatherData.description}</div>
            </div>
            <div className="weather-details">
              <div className="detail-item">
                <span className="detail-label">Feels like:</span>
                <span className="detail-value">{Math.round(weatherData.feelsLike)}°C</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Humidity:</span>
                <span className="detail-value">{weatherData.humidity}%</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Wind Speed:</span>
                <span className="detail-value">{weatherData.windSpeed} km/h</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Pressure:</span>
                <span className="detail-value">{Math.round(weatherData.pressure)} hPa</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
