import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function HumidityBarChart({ data, loading, hasData }) {
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => setIsLayoutReady(true));
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="min-w-0 rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-gray-700">
        Humidity by City (Bar)
      </h2>
      <div className="h-64 min-w-0">
        {loading || !hasData || !isLayoutReady ? (
          <div className="flex h-full items-center justify-center text-gray-400">
            Loading chart...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="city" />
              <YAxis unit="%" />
              <Tooltip />
              <Bar dataKey="humidity" name="Humidity" fill="#06b6d4" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default HumidityBarChart;
