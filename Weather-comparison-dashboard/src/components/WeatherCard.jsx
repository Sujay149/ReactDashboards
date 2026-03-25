function WeatherCard({ cityName, weather, loading }) {
  return (
    <div className="border rounded-xl bg-white shadow-sm hover:shadow-lg transition-shadow min-h-[260px] flex flex-col overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 text-center border-b">
        <h3 className="text-lg font-semibold text-gray-800">{cityName}</h3>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">Loading...</div>
      ) : weather && weather.cod === 200 ? (
        <div className="p-5 flex-1 flex flex-col gap-3 text-sm">
          <div className="text-center mb-2">
            <p className="text-3xl font-bold text-gray-800">
              {typeof weather?.main?.temp === "number" ? `${Math.round(weather.main.temp)}°C` : "—"}
            </p>
            <p className="text-gray-600 capitalize">{weather?.weather?.[0]?.description || "—"}</p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center border-b pb-3">
            <div>
              <p className="text-gray-500 text-xs">Feels like</p>
              <p className="font-medium">
                {typeof weather?.main?.feels_like === "number" ? `${Math.round(weather.main.feels_like)}°C` : "—"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Min</p>
              <p className="font-medium">
                {typeof weather?.main?.temp_min === "number" ? `${Math.round(weather.main.temp_min)}°C` : "—"}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Max</p>
              <p className="font-medium">
                {typeof weather?.main?.temp_max === "number" ? `${Math.round(weather.main.temp_max)}°C` : "—"}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Humidity</span>
            <span className="font-medium">{weather?.main?.humidity ?? "—"}%</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Pressure</span>
            <span className="font-medium">{weather?.main?.pressure ?? "—"} hPa</span>
          </div>

          <div className="flex justify-between items-center border-t pt-3">
            <span className="text-gray-600">Wind</span>
            <span className="font-medium">
              {typeof weather?.wind?.speed === "number" ? `${Math.round(weather.wind.speed * 3.6)} km/h` : "—"}
              {typeof weather?.wind?.deg === "number" ? ` (${weather.wind.deg}°)` : ""}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Sunrise</span>
            <span className="font-medium">
              {weather?.sys?.sunrise
                ? new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm p-4 text-center">
          {weather?.message || "No data available"}
          {weather?.cod && ` (Error ${weather.cod})`}
        </div>
      )}
    </div>
  );
}

export default WeatherCard;