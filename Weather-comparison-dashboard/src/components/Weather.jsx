import { useEffect, useMemo, useState } from "react";
import FeelsLikeAreaChart from "./charts/FeelsLikeAreaChart";
import HumidityBarChart from "./charts/HumidityBarChart";
import TemperatureLineChart from "./charts/TemperatureLineChart";

const CITIES = [
  { name: "Hyderabad" },
  { name: "Bangalore" },
  { name: "Chennai" },
  { name: "Mumbai" },
  { name: "Delhi" },
];

function Weather() {
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; // hopefully activated by now

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
              <div
                key={city.name}
                className="border rounded-xl bg-white shadow-sm hover:shadow-lg transition-shadow min-h-[260px] flex flex-col overflow-hidden"
              >
                {/* Header with city + icon */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 text-center border-b">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {city.name}
                  </h3>
                </div>

                {loading ? (
                  <div className="flex-1 flex items-center justify-center text-gray-400">
                    Loading...
                  </div>
                ) : w && w.cod === 200 ? (
                  <div className="p-5 flex-1 flex flex-col gap-3 text-sm">
                    {/* Main temperature block */}
                    <div className="text-center mb-2">
                      <p className="text-3xl font-bold text-gray-800">
                        {typeof w?.main?.temp === "number"
                          ? `${Math.round(w.main.temp)}°C`
                          : "—"}
                      </p>
                      <p className="text-gray-600 capitalize">
                        {w?.weather?.[0]?.description || "—"}
                      </p>
                    </div>

                    {/* Feels like + min/max */}
                    <div className="grid grid-cols-3 gap-2 text-center border-b pb-3">
                      <div>
                        <p className="text-gray-500 text-xs">Feels like</p>
                        <p className="font-medium">
                          {typeof w?.main?.feels_like === "number"
                            ? `${Math.round(w.main.feels_like)}°C`
                            : "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Min</p>
                        <p className="font-medium">
                          {typeof w?.main?.temp_min === "number"
                            ? `${Math.round(w.main.temp_min)}°C`
                            : "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Max</p>
                        <p className="font-medium">
                          {typeof w?.main?.temp_max === "number"
                            ? `${Math.round(w.main.temp_max)}°C`
                            : "—"}
                        </p>
                      </div>
                    </div>

                    {/* Humidity & Pressure */}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Humidity</span>
                      <span className="font-medium">{w?.main?.humidity ?? "—"}%</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Pressure</span>
                      <span className="font-medium">{w?.main?.pressure ?? "—"} hPa</span>
                    </div>

                    {/* Wind */}
                    <div className="flex justify-between items-center border-t pt-3">
                      <span className="text-gray-600">Wind</span>
                      <span className="font-medium">
                        {typeof w?.wind?.speed === "number"
                          ? `${Math.round(w.wind.speed * 3.6)} km/h`
                          : "—"}
                        {typeof w?.wind?.deg === "number" ? ` (${w.wind.deg}°)` : ""}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Sunrise</span>
                      <span className="font-medium">
                        {w?.sys?.sunrise
                          ? new Date(w.sys.sunrise * 1000).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </span>
                      
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500 text-sm p-4 text-center">
                    {w?.message || "No data available"}
                    {w?.cod && ` (Error ${w.cod})`}
                  </div>
                  
                )}
              </div>
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