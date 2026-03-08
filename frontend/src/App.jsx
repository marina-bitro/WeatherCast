import { useEffect, useState } from "react";
import LoadingAnimation from "./LoadingAnimation.jsx";
import { motion } from "framer-motion";

function App() {

  const [weather, setWeather] = useState(null);
  const [hourly, setHourly] = useState({});
  const [daily, setDaily] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const LAT = 37.98;
  const LON = 23.72;

  useEffect(() => {

    fetch(`http://localhost:5000/weather?lat=${LAT}&lon=${LON}`)
      .then(res => res.json())
      .then(data => {

        setWeather(data.current_weather);
        setHourly(data.hourly || {});
        setDaily(data.daily || {});
        setLoading(false);

      })
      .catch(err => {
        console.error(err);
        setError("Failed to load weather data");
        setLoading(false);
      });

  }, []);

  const getWeatherIcon = (code) => {

    if (code === 0) return "☀️";
    if (code <= 3) return "⛅";
    if (code <= 48) return "🌫";
    if (code <= 67) return "🌧";
    if (code <= 77) return "❄️";
    if (code <= 99) return "⛈";
    return "❓";

  };

  const now = new Date();

  return (

    <>

      {!loading && (
        <nav className="weatherNavbar">
          <h2>WeatherCast</h2>
        </nav>
      )}

      <div className="app-container">

        {loading ? (

          <LoadingAnimation />

        ) : (

          <motion.div
            className="weather-card"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >

            {error && <p>{error}</p>}

            {weather && (

              <div className="header-card">

                <h1>Athens</h1>

                <div className="weather-icon">
                  {getWeatherIcon(weather.weathercode)}
                </div>

                <div className="weather-info">

                  <h2>{Math.round(weather.temperature)}°C</h2>

                  <p>💨 Wind {Math.round(weather.windspeed)} km/h</p>

                </div>

              </div>

            )}

            {/* Hourly Forecast */}

            {hourly?.time && (() => {

              const currentIndex = hourly.time.findIndex(t => new Date(t) >= now);
              const startIndex = currentIndex === -1 ? 0 : currentIndex;

              const nextHours = hourly.time
                .map((t, i) => ({
                  time: t,
                  temp: hourly.temperature_2m[i]
                }))
                .slice(startIndex, startIndex + 13);

              return (

                <div className="hourly-scroll">

                  {nextHours.map((item, i) => {

                    const hour = new Date(item.time);

                    return (

                      <motion.div
                        key={i}
                        className="hour-card"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: i * 0.05,
                          duration: 0.3
                        }}
                        whileHover={{ scale: 1.08 }}
                      >

                        <p>
                          {i === 0 ? "Now" : `${hour.getHours()}:00`}
                        </p>

                        <p>{Math.round(item.temp)}°</p>

                      </motion.div>

                    );
                  })}

                </div>

              );

            })()}

            {/* Weekly Forecast */}

            {daily?.time && (

              <div className="daily-list">

                <h2 className="section-title">This week</h2>

                {daily.time.map((date, i) => (

                  <motion.div
                    key={i}
                    className="daily-card"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >

                    <p>
                      {new Date(date).toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "numeric"
                      })}
                    </p>

                    <p>
                      {Math.round(daily.temperature_2m_max[i])}° /
                      {Math.round(daily.temperature_2m_min[i])}°
                    </p>

                  </motion.div>

                ))}

              </div>

            )}

          </motion.div>

        )}

      </div>

    </>

  );
}

export default App;