import { useMemo } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

function DeliveryTimeBar({ orders = [] }) {
  // Average delivery days by city.
  const data = useMemo(() => {
    const map = {}
    orders.forEach(o => {
      const city = o.customer?.city || 'Unknown'
      const p = o.payment?.timestamps?.placed
      const d = o.payment?.timestamps?.delivered
      if (!p || !d) return
      const days = (new Date(d) - new Date(p)) / 86400000
      if (!map[city]) map[city] = { total: 0, count: 0 }
      map[city].total += days
      map[city].count += 1
    })
    return Object.entries(map)
      .map(([city, v]) => ({ city, days: Number((v.total / v.count).toFixed(1)) }))
      .sort((a, b) => b.days - a.days)
      .slice(0, 10)
  }, [orders])

  if (!data.length) return <div className="bg-white rounded-3xl shadow p-8 text-center">No delivery data.</div>

  return (
    <div className="bg-white rounded-3xl shadow p-4 sm:p-6 md:p-8">
      <h2 className="mb-4 text-center text-xl font-semibold sm:text-2xl">Delivery Time Analysis (Days)</h2>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="city" angle={-30} textAnchor="end" interval={0} height={60} />
          <YAxis />
          <Tooltip formatter={v => [`${v} days`, 'Avg Delivery']} />
          <Bar dataKey="days" fill="#f59e0b" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DeliveryTimeBar
