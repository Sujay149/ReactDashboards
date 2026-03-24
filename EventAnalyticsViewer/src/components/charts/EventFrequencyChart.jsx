import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const COLORS = ['#2563eb', '#16a34a', '#ea580c', '#dc2626', '#7c3aed', '#0891b2', '#ca8a04']

function EventFrequencyChart({ data, eventTypes }) {
  const [selected, setSelected] = useState(new Set(eventTypes))

  const activeTypes = useMemo(() => {
    const valid = eventTypes.filter((t) => selected.has(t))
    return valid.length ? valid : eventTypes
  }, [selected, eventTypes])

  const toggleType = (type) => {
    setSelected((prev) => {
      const next = new Set(prev.size ? prev : eventTypes)
      if (next.has(type)) next.delete(type)
      else next.add(type)
      return next
    })
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="mb-1 text-base font-semibold text-gray-900">Event Frequency Over Time</h2>
      <p className="mb-4 text-xs text-gray-500">Hourly event counts by type. Toggle event types below.</p>

      <div className="mb-4 flex flex-wrap gap-2">
        {eventTypes.map((type, i) => (
          <label
            key={type}
            className={`flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
              activeTypes.includes(type)
                ? 'border-blue-300 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-500'
            }`}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={activeTypes.includes(type)}
              onChange={() => toggleType(type)}
            />
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            {type.replace(/_/g, ' ')}
          </label>
        ))}
      </div>

      <div className="h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 16, left: -8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="hour" interval={1} tick={{ fontSize: 11, fill: '#6b7280' }} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#6b7280' }} tickLine={false} axisLine={false} />
            <Tooltip />
            <Legend
              formatter={(value) => (
                <span style={{ color: '#374151', fontSize: '0.75rem' }}>{value.replace(/_/g, ' ')}</span>
              )}
            />
            {activeTypes.map((type) => {
              const color = COLORS[eventTypes.indexOf(type) % COLORS.length]
              return (
                <Line
                  key={type}
                  type="monotone"
                  dataKey={type}
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2 }}
                />
              )
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default EventFrequencyChart
