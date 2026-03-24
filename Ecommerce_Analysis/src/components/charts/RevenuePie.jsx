import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function RevenuePie({ orders = [] }) {

  // Prepare data for Pie Chart
  const revenueByCategory = useMemo(() => {
    const map = {};

    orders.forEach(order => {
      order.items?.forEach(item => {
        const category = item.category || 'Uncategorized';
        const revenue = (item.price || 0) * (item.quantity || 0);
        map[category] = (map[category] || 0) + revenue;
      });
    });

    return Object.entries(map).map(([name, value]) => ({
      name,
      value: Math.round(value)
    }));
  }, [orders]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

  if (revenueByCategory.length === 0) {
    return <div className="text-center py-12 text-gray-500">No revenue data available</div>;
  }

  return (
    <div className="bg-white rounded-3xl shadow p-4 sm:p-6 md:p-8">
      <h2 className="mb-4 text-center text-xl font-semibold sm:mb-6 sm:text-2xl">Revenue by Category</h2>

      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={revenueByCategory}
            cx="50%"
            cy="50%"
            outerRadius={150}
            dataKey="value"
            nameKey="name"
            label={false}
          >
            {revenueByCategory.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']} />
          <Legend verticalAlign="bottom" height={40} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RevenuePie;