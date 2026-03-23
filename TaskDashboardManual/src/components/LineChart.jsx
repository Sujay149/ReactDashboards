import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const fallbackData = [
  { date: "2026-03-10", created: 2, completed: 1 },
  { date: "2026-03-11", created: 3, completed: 2 },
  { date: "2026-03-12", created: 2, completed: 2 },
];

function LineChart({ data = fallbackData }) {
  return (
    <div className="bg-[#242424] rounded-xl p-4 sm:p-5 text-white shadow-md h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="date" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Tooltip />
          <Line type="monotone" dataKey="created" stroke="#22c55e" strokeWidth={3} />
          <Line type="monotone" dataKey="completed" stroke="#f97316" strokeWidth={3} />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LineChart;