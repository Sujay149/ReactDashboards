import { useMemo } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

function TopProductsHorizontalBar({ orders = [] }) {
  // Top 10 products sorted by total revenue.
  const data = useMemo(() => {
    const map = {}
    orders.forEach(o => {
      ;(o.items || []).forEach(i => {
        const key = i.product || 'Unknown'
        map[key] = (map[key] || 0) + (i.price || 0) * (i.quantity || 0)
      })
    })
    return Object.entries(map)
      .map(([product, revenue]) => ({ product, revenue: Math.round(revenue) }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
      .reverse()
  }, [orders])

  if (!data.length) return <div className="bg-white rounded-3xl shadow p-8 text-center">No product data.</div>

  return (
    <div className="bg-white rounded-3xl shadow p-4 sm:p-6 md:p-8">
      <h2 className="mb-4 text-center text-xl font-semibold sm:text-2xl">Top Products by Revenue</h2>
      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={v => `₹${Math.round(v / 1000)}k`} />
          <YAxis type="category" dataKey="product" width={130} />
          <Tooltip formatter={v => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']} />
          <Bar dataKey="revenue" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TopProductsHorizontalBar
