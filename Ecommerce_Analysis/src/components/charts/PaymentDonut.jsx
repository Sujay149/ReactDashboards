import { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function PaymentDonut({ orders = [] }) {
  // Count orders by payment method.
  const data = useMemo(() => {
    const map = {}
    orders.forEach(o => {
      const m = o.payment?.method || 'Unknown'
      map[m] = (map[m] || 0) + 1
    })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [orders])

  if (!data.length) return <div className="bg-white rounded-3xl shadow p-8 text-center">No payment data.</div>

  const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6']
  return (
    <div className="bg-white rounded-3xl shadow p-4 sm:p-6 md:p-8">
      <h2 className="mb-4 text-center text-xl font-semibold sm:text-2xl">Payment Method Breakdown</h2>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110}>
            {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PaymentDonut
