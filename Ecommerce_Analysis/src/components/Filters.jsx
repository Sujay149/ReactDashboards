function Filters({ filters, setFilters, cityOptions = [], methodOptions = [] }) {
  const tierOptions = ['Gold', 'Silver', 'Bronze']

  // Toggle helper for multi-select checkboxes.
  const toggle = (key, value) => {
    const next = filters[key].includes(value)
      ? filters[key].filter(v => v !== value)
      : [...filters[key], value]
    setFilters({ ...filters, [key]: next })
  }

  const renderSection = (title, keyName, options) => (
    <div>
      <p className="mb-2 text-sm font-semibold text-slate-700">{title}</p>
      <div className={`flex flex-wrap gap-2 ${options.length > 10 ? 'max-h-40 overflow-y-auto pr-1' : ''}`}>
        {options.map(opt => (
          <label key={opt} className="flex items-center gap-1 rounded border px-2 py-1 text-sm">
            <input type="checkbox" checked={filters[keyName].includes(opt)} onChange={() => toggle(keyName, opt)} />
            {opt}
          </label>
        ))}
      </div>
    </div>
  )

  return (
    <div className="bg-white rounded-3xl shadow p-4 space-y-4 sm:p-6">
      <h2 className="text-xl font-semibold">Filters</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="text-sm font-semibold text-slate-700">
          Start Date
          <input
            type="date"
            className="mt-1 w-full rounded border px-3 py-2"
            value={filters.startDate}
            onChange={e => setFilters({ ...filters, startDate: e.target.value })}
          />
        </label>

        <label className="text-sm font-semibold text-slate-700">
          End Date
          <input
            type="date"
            className="mt-1 w-full rounded border px-3 py-2"
            value={filters.endDate}
            onChange={e => setFilters({ ...filters, endDate: e.target.value })}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="lg:col-span-2">{renderSection('City', 'cities', cityOptions)}</div>
        {renderSection('Customer Tier', 'tiers', tierOptions)}
        {renderSection('Payment Method', 'methods', methodOptions)}
      </div>
    </div>
  )
}

export default Filters
