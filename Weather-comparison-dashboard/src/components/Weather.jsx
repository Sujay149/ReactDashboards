import { useEffect, useMemo, useState } from "react";
import FeelsLikeAreaChart from "./charts/FeelsLikeAreaChart";
import HumidityBarChart from "./charts/HumidityBarChart";
import TemperatureLineChart from "./charts/TemperatureLineChart";
import WeatherCard from "./WeatherCard";

const CITIES = [
  { id: 1269843, name: "Hyderabad" },
  { id: 1277333, name: "Bangalore" },
  { id: 1264527, name: "Chennai" },
  { id: 1275339, name: "Mumbai" },
  { id: 1273294, name: "Delhi" },
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

        const ids = CITIES.map((city) => city.id).join(",");
        const requestUrl = `https://api.openweathermap.org/data/2.5/group?id=${ids}&units=metric&appid=${API_KEY}`;
        console.info("[Weather API] Request URL:", requestUrl);

        let weatherByCity = {};
        const response = await fetch(requestUrl);
        console.info("[Weather API] Response status:", response.status);

        if (response.ok) {
          const payload = await response.json();
          const data = Array.isArray(payload?.list) ? payload.list : [];
          console.info("[Weather API] Cities returned:", data.length);

          data.forEach((weather) => {
            weatherByCity[weather.id] = weather;
          });
        } else {
          let details = "";
          try {
            const errBody = await response.json();
            details = errBody?.message ? `: ${errBody.message}` : "";
          } catch {
            details = "";
          }

          console.warn(
            `[Weather API] Group endpoint failed (HTTP ${response.status}${details}). Falling back to per-city requests.`
          );

          const fallbackResponses = await Promise.all(
            CITIES.map((city) => {
              const cityUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city.name},IN&units=metric&appid=${API_KEY}`;
              console.info("[Weather API] Fallback city URL:", cityUrl);
              return fetch(cityUrl);
            })
          );

          const fallbackPayloads = await Promise.all(
            fallbackResponses.map(async (res) => {
              let body = null;
              try {
                body = await res.json();
              } catch {
                body = null;
              }
              return { ok: res.ok, status: res.status, body };
            })
          );

          fallbackPayloads.forEach(({ ok, status, body }, index) => {
            const cityId = CITIES[index].id;
            console.info(`[Weather API] Fallback ${CITIES[index].name} status:`, status);
            if (ok && body) {
              weatherByCity[cityId] = body;
            }
          });

          if (Object.keys(weatherByCity).length === 0) {
            throw new Error(`HTTP ${response.status}${details}`);
          }
        }

        setWeatherData(weatherByCity);
      } catch (err) {
        console.error("Fetch failed:", err);
        console.error("[Weather API] Request failed:", err?.message || err);
        setError(err.message || "Failed to load weather. Check API key / network.");
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [API_KEY]);

  const chartData = useMemo(() => {
    return CITIES.map((city) => {
      const data = weatherData[city.id];

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
            const w = weatherData[city.id];
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