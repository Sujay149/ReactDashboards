
import { useMemo } from 'react'
import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from 'recharts'

function DailyOrdersLine({ orders = [] }) {

    const dailyOrderVolume = useMemo(() => {
        const byDay = orders.reduce((acc, order) => {
            const placedAt = order.payment?.timestamps?.placed
            if (!placedAt) return acc

            const day = String(placedAt).slice(0, 10)
            acc[day] = (acc[day] || 0) + 1
            return acc
        }, {})

        return Object.entries(byDay)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, ordersCount]) => ({
                date,
                orders: ordersCount,
            }))
    }, [orders])

    if (!dailyOrderVolume.length) {
        return <div className="p-4 text-center">No daily orders data available.</div>
    }

    return (
        <div className="rounded-3xl bg-white p-4 shadow sm:p-6">
            <h2 className="mb-4 text-center text-xl font-semibold sm:text-2xl">Daily Order Volume</h2>

            <ResponsiveContainer width="100%" height={320}>
                <LineChart data={dailyOrderVolume} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => [`${value}`, 'Orders']} />
                    <Line
                        type="monotone"
                        dataKey="orders"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default DailyOrdersLine