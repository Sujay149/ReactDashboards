import { useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const COLORS = ['#2563eb', '#16a34a', '#ea580c', '#dc2626', '#7c3aed', '#0891b2']

const TABS = [
  { key: 'devices', label: 'By Device' },
  { key: 'roles', label: 'By Role' },
  { key: 'plans', label: 'By Plan' },
]

function UserSegmentation({ data }) {
  const [activeTab, setActiveTab] = useState('devices')
  const activeData = data[activeTab] || []
  const total = activeData.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">User Segmentation</h2>
          <p className="text-xs text-gray-500">Unique users grouped by device, role, or plan.</p>
        </div>
        <div className="flex gap-1 rounded-md border border-gray-200 bg-gray-50 p-0.5">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded px-3 py-1 text-xs font-medium ${
                activeTab === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex items-center justify-center">
          <div className="h-[240px] w-full max-w-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  stroke="#fff"
                  strokeWidth={2}
                >
                  {activeData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-2">
          {activeData.map((item, index) => {
            const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0
            return (
              <div key={item.name} className="flex items-center gap-3 rounded-md border border-gray-100 bg-gray-50 px-3 py-2">
                <span
                  className="inline-block h-3 w-3 rounded-sm"
                  style={{ background: COLORS[index % COLORS.length] }}
                />
                <span className="flex-1 text-sm capitalize text-gray-700">{item.name.replace(/_/g, ' ')}</span>
                <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                <span className="text-xs text-gray-400">({pct}%)</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default UserSegmentation
