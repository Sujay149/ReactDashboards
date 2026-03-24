import { useMemo } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts'

function CustomerTierGroupedBar({ orders = [] }) {
  const norm = (t) => (t === 'premium' ? 'Gold' : t === 'regular' ? 'Silver' : 'Bronze')

  // Compare both order count and revenue for each tier.
  const data = useMemo(() => {
    const tiers = { Gold: { revenue: 0, orders: 0 }, Silver: { revenue: 0, orders: 0 }, Bronze: { revenue: 0, orders: 0 } }
    orders.forEach(o => {
      const tier = norm(o.customer?.tier)
      const revenue = (o.items || []).reduce((s, i) => s + (i.price || 0) * (i.quantity || 0), 0)
      tiers[tier].revenue += revenue
      tiers[tier].orders += 1
    })
    return Object.entries(tiers).map(([tier, v]) => ({ tier, revenue: Math.round(v.revenue), orders: v.orders }))
  }, [orders])

  return (
    <div className="bg-white rounded-3xl shadow p-4 sm:p-6 md:p-8">
      <h2 className="mb-4 text-center text-xl font-semibold sm:text-2xl">Customer Tier Comparison</h2>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="tier" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="orders" fill="#3b82f6" />
          <Bar dataKey="revenue" fill="#22c55e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CustomerTierGroupedBar
