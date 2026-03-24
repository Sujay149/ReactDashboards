function Header({ totalEvents, error, lastUpdated }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Event Analytics Dashboard</h1>
      <div className="mt-1 flex items-center gap-4 text-sm text-gray-500">
        <span>Total events: <strong className="text-gray-800">{totalEvents}</strong></span>
        <span>·</span>
        <span>Live refresh: every 5s</span>
        <span>·</span>
        <span>Last updated: {lastUpdated || '—'}</span>
      </div>
      {error && (
        <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  )
}

export default Header
