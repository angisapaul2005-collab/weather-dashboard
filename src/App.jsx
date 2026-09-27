import { useState } from "react";
import "./App.css";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

function formatTime(timestamp, timezone) {
  const date = new Date((timestamp + timezone) * 1000);

  return date.toLocaleTimeString("en-US", {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    if (!API_KEY) {
      setError("API key is missing. Please check your .env file.");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("City not found. Please check the city name.");
        }

        if (response.status === 401) {
          throw new Error("Invalid API key.");
        }

        throw new Error("Unable to fetch weather data.");
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      searchWeather();
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>🌤️ Weather Dashboard</h1>
        <p className="subtitle">
          Search for a city to see live weather information
        </p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button onClick={searchWeather}>
            Search
          </button>
        </div>

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading weather...</p>
          </div>
        )}

        {error && <div className="error">{error}</div>}

        {!loading && !error && !weather && (
          <div className="welcome">
            <div className="welcome-icon">🌍</div>
            <h2>Search for a city</h2>
            <p>
              Enter any city name above to get current weather information.
            </p>
          </div>
        )}

        {weather && !loading && (
          <div className="weather-card">
            <div className="location">
              <h2>
                {weather.name}, {weather.sys.country}
              </h2>
            </div>

            <div className="main-weather">
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
              />

              <div>
                <div className="temperature">
                  {Math.round(weather.main.temp)}°C
                </div>

                <p className="condition">
                  {weather.weather[0].description}
                </p>
              </div>
            </div>

            <div className="details">
              <div className="detail">
                <span>💧</span>
                <div>
                  <small>Humidity</small>
                  <strong>{weather.main.humidity}%</strong>
                </div>
              </div>

              <div className="detail">
                <span>💨</span>
                <div>
                  <small>Wind Speed</small>
                  <strong>{weather.wind.speed} m/s</strong>
                </div>
              </div>

              <div className="detail">
                <span>🌡️</span>
                <div>
                  <small>Feels Like</small>
                  <strong>
                    {Math.round(weather.main.feels_like)}°C
                  </strong>
                </div>
              </div>

              <div className="detail">
                <span>🔽</span>
                <div>
                  <small>Pressure</small>
                  <strong>{weather.main.pressure} hPa</strong>
                </div>
              </div>
            </div>

            <div className="sun-times">
              <div>
                <span>🌅</span>
                <div>
                  <small>Sunrise</small>
                  <strong>
                    {formatTime(
                      weather.sys.sunrise,
                      weather.timezone
                    )}
                  </strong>
                </div>
              </div>

              <div>
                <span>🌇</span>
                <div>
                  <small>Sunset</small>
                  <strong>
                    {formatTime(
                      weather.sys.sunset,
                      weather.timezone
                    )}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;