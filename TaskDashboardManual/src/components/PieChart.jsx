import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const fallbackData = [
  { name: "Completed", value: 80 },
  { name: "Pending", value: 40 },
];

function PieChart({ data = fallbackData }) {
  return (
    <div className="bg-[#242424] rounded-xl p-4 sm:p-5 text-white shadow-md hover:shadow-lg h-[350px] w-full transition">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={95}
            dataKey="value"
            label
          >
            <Cell fill="#22c55e" />
            <Cell fill="#ef4444" />
          </Pie>
          <Tooltip />
          <Legend />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieChart;