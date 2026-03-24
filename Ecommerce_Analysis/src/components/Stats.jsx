import { useMemo } from 'react'
import StatCard from './StatCard'
function Stats({ orders = [] }) {
  const metrics = useMemo(() => {
    const revenue = orders.reduce((t, o) => t + (o.items || []).reduce((s, i) => s + (i.price || 0) * (i.quantity || 0), 0), 0)
    const methods = orders.reduce((acc, o) => {
      const m = o.payment?.method
      if (m) acc[m] = (acc[m] || 0) + 1
      return acc
    }, {})
    const mostUsed = Object.entries(methods).reduce((a, [method, count]) => (count > a.count ? { method, count } : a), { method: 'N/A', count: 0 })
    const delivered = orders.filter(o => o.payment?.timestamps?.placed && o.payment?.timestamps?.delivered)
    const totalDays = delivered.reduce((sum, o) => sum + (new Date(o.payment.timestamps.delivered) - new Date(o.payment.timestamps.placed)) / 86400000, 0)
    return {
      revenue,
      avgOrder: orders.length ? revenue / orders.length : 0,
      customers: new Set(orders.map(o => o.customer?.name).filter(Boolean)).size,
      upi: orders.filter(o => o.payment?.method === 'UPI').length,
      mostUsed: mostUsed.method,
      avgDelivery: delivered.length ? totalDays / delivered.length : 0,
    }
  }, [orders])

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        
        <StatCard 
          title="Total Orders" 
          value={orders.length} 
          subtitle={`UPI: ${metrics.upi}`}
          color="blue" 
        />

        <StatCard 
          title="Total Revenue" 
          value={`₹${metrics.revenue.toLocaleString('en-IN')}`} 
          color="green" 
        />

        <StatCard 
          title="Average Order Value" 
          value={`₹${metrics.avgOrder.toFixed(2)}`} 
          color="indigo" 
        />

        <StatCard 
          title="Total Customers" 
          value={metrics.customers} 
          color="purple" 
        />

        <StatCard 
          title="Most Used Payment" 
          value={metrics.mostUsed} 
          color="orange" 
        />

        <StatCard 
          title="Avg Delivery Time" 
          value={metrics.avgDelivery.toFixed(1)} 
          color="teal" 
          unit="days" 
        />

      </div>
   
  )
}

export default Stats