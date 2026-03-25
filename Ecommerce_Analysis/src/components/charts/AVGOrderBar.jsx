import { useEffect, useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

function AVGOrderBar({ orders = [] }) {
  const [fetchedOrders, setFetchedOrders] = useState(null);

  // Fetch orders only if not passed from parent
  useEffect(() => {
    if (orders.length > 0) return;

    fetch('http://localhost:3002/orders')
      .then(res => res.json())
      .then(data => setFetchedOrders(Array.isArray(data) ? data : []))
      .catch(() => setFetchedOrders([]));
  }, [orders]);

  const sourceOrders = useMemo(
    () => (orders.length > 0 ? orders : fetchedOrders || []),
    [orders, fetchedOrders]
  );

  // Calculate Average Order Value by City - Top 10
  const aovByCity = useMemo(() => {
    const cityMap = {};

    sourceOrders.forEach((order) => {
      const city = order?.customer?.city || 'Unknown';

      const orderRevenue = (order.items || []).reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
        0
      );

      if (!cityMap[city]) {
        cityMap[city] = { total: 0, count: 0 };
      }

      cityMap[city].total += orderRevenue;
      cityMap[city].count += 1;
    });

    return Object.entries(cityMap)
      .map(([city, data]) => ({
        city,
        AOV: data.count > 0 ? Math.round(data.total / data.count) : 0,
      }))
      .sort((a, b) => b.AOV - a.AOV)
      .slice(0, 10); // Show only Top 10 cities
  }, [sourceOrders]);

  const barColors = [
    '#3b82f6', '#22c55e', '#ef4444', '#eab308',
    '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
    '#06b6d4', '#84cc16'
  ];

  if (sourceOrders.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500 bg-white rounded-3xl shadow">
        No orders loaded yet...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 md:p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Average Order Value by City</h2>
        <p className="text-slate-500 mt-1">Top 10 Cities</p>
      </div>

      <ResponsiveContainer width="100%" height={420}>
        <BarChart
          data={aovByCity}
          margin={{ top: 20, right: 30, left: 20, bottom: 90 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

          <XAxis
            dataKey="city"
            tick={{ fontSize: 13 }}
            tickLine={false}
            axisLine={{ stroke: '#cbd5e1' }}
            angle={-45}
            textAnchor="end"
            height={90}
          />

          <YAxis
            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            tick={{ fontSize: 13 }}
            tickLine={false}
            axisLine={{ stroke: '#cbd5e1' }}
          />

          <Tooltip
            formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Average Order Value']}
            cursor={{ fill: '#f8fafc' }}
          />

          <Bar 
            dataKey="AOV" 
            radius={[8, 8, 0, 0]} 
            maxBarSize={70}
            minPointSize={10}
          >
            {aovByCity.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={barColors[index % barColors.length]} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AVGOrderBar;