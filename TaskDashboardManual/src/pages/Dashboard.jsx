import React, { useEffect, useMemo, useState } from "react";
import StatCard from "../components/Stats";
import PieChart from "../components/PieChart";
import BarChart from "../components/BarChart";
import LineChart from "../components/LineChart";
import AreaChart from "../components/AreaChart";
import TaskDetails from "../components/TaskDetails";

const TASKS_API_URL = "http://localhost:3001/tasks";

function buildLineData(tasks) {
  const groupedByDate = {};

  tasks.forEach((task) => {
    const createdDate = task.createdAt;
    if (!groupedByDate[createdDate]) {
      groupedByDate[createdDate] = { date: createdDate, created: 0, completed: 0 };
    }
    groupedByDate[createdDate].created += 1;

    if (task.completedAt) {
      const completedDate = task.completedAt;
      if (!groupedByDate[completedDate]) {
        groupedByDate[completedDate] = { date: completedDate, created: 0, completed: 0 };
      }
      groupedByDate[completedDate].completed += 1;
    }
  });

  return Object.values(groupedByDate).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
}

function buildAreaData(lineData) {
  let runningTotal = 0;
  return lineData.map((item) => {
    runningTotal += item.created;
    return { date: item.date, total: runningTotal };
  });
}

function calculateAverageCompletionDays(tasks) {
  const completedTasks = tasks.filter((task) => task.completedAt);

  const totalDays = completedTasks.reduce((sum, task) => {
    const createdDate = new Date(task.createdAt);
    const completedDate = new Date(task.completedAt);
    const days = (completedDate - createdDate) / (1000 * 60 * 60 * 24);
    return sum + days;
  }, 0);

  return completedTasks.length ? (totalDays / completedTasks.length).toFixed(1) : 0;
}

function buildAnalytics(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === "completed").length;
  const pending = tasks.filter((task) => task.status === "pending").length;
  const photos = tasks.filter((task) => task.hasImage).length;

  const line = buildLineData(tasks);

  return {
    total,
    completed,
    photos,
    avg: calculateAverageCompletionDays(tasks),
    pie: [
      { name: "Completed", value: completed },
      { name: "Pending", value: pending },
    ],
    bar: [
      { name: "High", value: tasks.filter((task) => task.priority === "high").length },
      { name: "Medium", value: tasks.filter((task) => task.priority === "medium").length },
      { name: "Low", value: tasks.filter((task) => task.priority === "low").length },
    ],
    line,
    area: buildAreaData(line),
  };
}

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadTasks() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(TASKS_API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch task data.");
        }

        const data = await response.json();
        setTasks(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Could not load tasks from json-server.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadTasks();

    return () => controller.abort();
  }, []);

  const analytics = useMemo(() => buildAnalytics(tasks), [tasks]);

  return (
      <div className="min-h-screen w-full bg-[#181818] px-4 py-4 sm:px-6 md:px-8">
        {/* header */}
      <div className="rounded-xl bg-[#34524f] border border-[#E3B991] p-4 sm:p-5 md:p-6">

  <p className="text-sm sm:text-base md:text-lg text-[#D68C42] font-semibold">
    TaskTrack Analytics
  </p>

  <h1 className="text-xl sm:text-2xl md:text-3xl text-[#A65C4C] font-bold mt-2">
    TaskTrack Dashboard
  </h1>

</div>
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
 <StatCard title="Total Tasks" value={analytics.total} />
 <StatCard title="Completed Tasks" value={analytics.completed} />
 <StatCard title="Avg Time" value={analytics.avg} />
 <StatCard title="Photos Attached" value={analytics.photos} />
</div>

 {isLoading && <p className="mt-4 text-[#E3B991]">Loading tasks from json-server...</p>}
 {error && <p className="mt-4 text-red-400">{error}</p>}

 {/* charts */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
  <PieChart data={analytics.pie} />
  <BarChart data={analytics.bar} />
  <LineChart data={analytics.line} />
  <AreaChart data={analytics.area} />
 </div>
 <TaskDetails tasks={tasks} />
</div>

    )
}
export default Dashboard