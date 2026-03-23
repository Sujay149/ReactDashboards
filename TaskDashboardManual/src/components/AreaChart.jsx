import React from "react";
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const fallbackData = [
  { date: "2026-03-10", total: 2 },
  { date: "2026-03-11", total: 5 },
  { date: "2026-03-12", total: 7 },
];

function AreaChart({ data = fallbackData }) {
  return (
    <div className="bg-[#242424] rounded-xl p-4 sm:p-5 text-white shadow-md h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="date" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Tooltip />
          <Area type="monotone" dataKey="total" stroke="#f97316" fill="#f97316" fillOpacity={0.25} />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AreaChart;