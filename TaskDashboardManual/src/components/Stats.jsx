const StatCard = ({ title, value }) => {
  return (
    <div className="bg-[#242424] rounded-xl p-5 shadow-md hover:shadow-lg h-32 transition flex flex-col justify-between w-full">
      <h2 className="text-white text-sm">{title}</h2>
      <p className="text-2xl text-white font-bold">{value}</p>
    </div>
  );
};

export default StatCard;