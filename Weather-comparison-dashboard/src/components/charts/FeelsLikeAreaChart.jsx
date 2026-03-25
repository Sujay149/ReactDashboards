import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function FeelsLikeAreaChart({ data, loading, hasData }) {
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => setIsLayoutReady(true));
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="min-w-0 rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-gray-700">
        Feels Like vs Actual (Area)
      </h2>
      <div className="h-64 min-w-0">
        {loading || !hasData || !isLayoutReady ? (
          <div className="flex h-full items-center justify-center text-gray-400">
            Loading chart...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="city" />
              <YAxis unit="°C" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="actual"
                name="Actual"
                stroke="#f97316"
                fill="#fed7aa"
                connectNulls
              />
              <Area
                type="monotone"
                dataKey="feelsLike"
                name="Feels Like"
                stroke="#8b5cf6"
                fill="#ddd6fe"
                connectNulls
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default FeelsLikeAreaChart;
