import { useState } from 'react'

const TYPE_COLORS = {
  page_view: 'bg-blue-100 text-blue-700',
  click: 'bg-yellow-100 text-yellow-700',
  purchase: 'bg-green-100 text-green-700',
  form_submit: 'bg-purple-100 text-purple-700',
  video_play: 'bg-red-100 text-red-700',
  download: 'bg-orange-100 text-orange-700',
}

function LiveEventFeedTable({ rows }) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const eventTypes = [...new Set(rows.map((r) => r.eventType))].sort()

  const filtered = rows.filter((event) => {
    if (typeFilter !== 'all' && event.eventType !== typeFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        (event.userName || '').toLowerCase().includes(q) ||
        (event.eventName || '').toLowerCase().includes(q) ||
        (event.eventType || '').toLowerCase().includes(q)
      )
    }
    return true
  })

  const formatTime = (ts) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Live Event Feed
            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
              {filtered.length}
            </span>
          </h2>
          <p className="text-xs text-gray-500">Most recent events, refreshed every 5 seconds.</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 outline-none focus:border-blue-400"
          >
            <option value="all">All types</option>
            {eventTypes.map((t) => (
              <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              <th className="px-3 py-2">Time</th>
              <th className="px-3 py-2">User</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Event</th>
              <th className="px-3 py-2">Session</th>
              <th className="px-3 py-2">Segment</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-sm text-gray-400">
                  No events match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((event) => (
                <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="whitespace-nowrap px-3 py-2 text-gray-600">
                    {formatTime(event.timestamp)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 font-medium text-gray-800">
                    {event.userName || event.userId}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-gray-700">
                    {event.eventType?.replace(/_/g, ' ')}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-gray-700">{event.eventName}</td>
                  <td className="whitespace-nowrap px-3 py-2">
                    <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                      {event.properties?.sessionId || '—'}
                    </code>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-gray-700">
                    {event.userSegment || '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LiveEventFeedTable
