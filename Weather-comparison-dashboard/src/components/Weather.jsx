import { useEffect, useMemo, useState } from "react";
import FeelsLikeAreaChart from "./charts/FeelsLikeAreaChart";
import HumidityBarChart from "./charts/HumidityBarChart";
import TemperatureLineChart from "./charts/TemperatureLineChart";
import WeatherCard from "./WeatherCard";

const CITIES = [
  { name: "Hyderabad" },
  { name: "Bangalore" },
  { name: "Chennai" },
  { name: "Mumbai" },
  { name: "Delhi" },
];

function Weather() {
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; 

  const [weatherData, setWeatherData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        setError(null);
        setLoading(true);

        const responses = await Promise.all(
          CITIES.map((city) =>
            fetch(
              `https://api.openweathermap.org/data/2.5/weather?q=${city.name},IN&units=metric&appid=${API_KEY}`
            )
          )
        );

        const data = await Promise.all(
          responses.map(async (res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
          })
        );

        const weatherByCity = {};
        data.forEach((weather, index) => {
          weatherByCity[CITIES[index].name] = weather;
        });

        setWeatherData(weatherByCity);
      } catch (err) {
        console.error("Fetch failed:", err);
        setError(err.message || "Failed to load weather. Check API key / network.");
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [API_KEY]);

  const chartData = useMemo(() => {
    return CITIES.map((city) => {
      const data = weatherData[city.name];

      const temp = data?.main?.temp;
      const feelsLike = data?.main?.feels_like;
      const humidity = data?.main?.humidity;
      const windSpeedMs = data?.wind?.speed;
      const windDeg = data?.wind?.deg;
      const description = data?.weather?.[0]?.description;
      const sunriseUnix = data?.sys?.sunrise;

      return {
        city: city.name,
        actual: typeof temp === "number" ? Number(temp.toFixed(1)) : null,
        feelsLike:
          typeof feelsLike === "number" ? Number(feelsLike.toFixed(1)) : null,
        humidity: typeof humidity === "number" ? humidity : null,
        windKmh:
          typeof windSpeedMs === "number"
            ? Number((windSpeedMs * 3.6).toFixed(1))
            : null,
        windDeg: typeof windDeg === "number" ? windDeg : null,
        description: description || "N/A",
        sunrise: sunriseUnix
          ? new Date(sunriseUnix * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A",
      };
    });
  }, [weatherData]);

  const hasChartData = chartData.some(
    (item) => item.actual !== null || item.humidity !== null
  );

  return (
    <>
      <h1 className="m-8 font-bold text-2xl md:text-3xl text-center text-gray-800">
        Weather Dashboard – Major Indian Cities
      </h1>

      {error && (
        <div className="mx-auto max-w-4xl p-6 text-center text-red-600 font-medium bg-red-50 rounded-lg">
          Error: {error}
          <br />
          <small className="text-red-500">
            Most common fix: make sure your API key is activated (wait 10–120 min after creation) and not rate-limited.
          </small>
        </div>
      )}

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {CITIES.map((city) => {
            const w = weatherData[city.name];
            return (
              <WeatherCard
                key={city.name}
                cityName={city.name}
                weather={w}
                loading={loading}
              />
            );
          })}
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <TemperatureLineChart
            data={chartData}
            loading={loading}
            hasData={hasChartData}
          />
          <HumidityBarChart
            data={chartData}
            loading={loading}
            hasData={hasChartData}
          />
          <FeelsLikeAreaChart
            data={chartData}
            loading={loading}
            hasData={hasChartData}
          />
        </div>
      </div>
    </>
  );
}

export default Weather;