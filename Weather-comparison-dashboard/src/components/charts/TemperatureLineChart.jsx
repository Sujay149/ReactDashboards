import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function TemperatureLineChart({ data, loading, hasData }) {
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => setIsLayoutReady(true));
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="min-w-0 rounded-xl border bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-gray-700">
        Temperature Comparison (Line)
      </h2>
      <div className="h-64 min-w-0">
        {loading || !hasData || !isLayoutReady ? (
          <div className="flex h-full items-center justify-center text-gray-400">
            Loading chart...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="city" />
              <YAxis unit="°C" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="actual"
                name="Actual Temp"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={{ r: 4 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default TemperatureLineChart;
