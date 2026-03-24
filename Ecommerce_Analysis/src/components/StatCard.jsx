// StatCard.jsx (or inside App.js)
function StatCard({ title, value, color = "blue", subtitle, unit }) {
  const colorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    indigo: "text-indigo-600",
    orange: "text-orange-600",
    purple: "text-purple-600",
    teal: "text-teal-600"
  };

  return (
    <div className="w-full bg-white flex min-h-[150px] flex-col items-center justify-center rounded-3xl shadow p-4 text-center transition-all duration-300 hover:shadow-xl sm:p-6">
      <div className={`mb-3 break-words text-3xl font-bold sm:text-4xl xl:text-5xl ${colorClasses[color]}`}>
        {value}{unit ? ` ${unit}` : ''}
      </div>
      <p className="text-sm font-medium text-gray-600 sm:text-base">{title}</p>
      {subtitle ? <p className="mt-1 text-xs text-slate-500 sm:text-sm">{subtitle}</p> : null}
    </div>
  );
}
export default StatCard