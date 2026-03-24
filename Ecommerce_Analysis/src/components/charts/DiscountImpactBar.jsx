import { useMemo } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

function DiscountImpactBar({ orders = [] }) {
  // Sum total discount value by discount type.
  const data = useMemo(() => {
    const total = { Percentage: 0, Flat: 0 }
    orders.forEach(o => {
      ;(o.items || []).forEach(i => {
        const subtotal = (i.price || 0) * (i.quantity || 0)
        const type = i.discount?.type
        const value = Number(i.discount?.value) || 0
        if (type === 'percentage') total.Percentage += (subtotal * value) / 100
        if (type === 'flat') total.Flat += value
      })
    })
    return [
      { type: 'Percentage', amount: Math.round(total.Percentage) },
      { type: 'Flat', amount: Math.round(total.Flat) },
    ]
  }, [orders])

  return (
    <div className="bg-white rounded-3xl shadow p-4 sm:p-6 md:p-8">
      <h2 className="mb-4 text-center text-xl font-semibold sm:text-2xl">Discount Impact Analysis</h2>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="type" />
          <YAxis tickFormatter={v => `₹${Math.round(v / 1000)}k`} />
          <Tooltip formatter={v => [`₹${Number(v).toLocaleString('en-IN')}`, 'Discount Value']} />
          <Bar dataKey="amount" fill="#ef4444" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DiscountImpactBar
