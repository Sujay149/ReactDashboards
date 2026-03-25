import {
    Bar,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    BarChart as RechartsBarChart,
} from 'recharts'

function BarChart({ nestedData }) {
    const chartData = nestedData.map((user) => ({
        name: user.name,
        posts: user.posts.length,
    }))

    return (
        <div className="rounded-xl bg-white p-4 shadow dark:bg-zinc-800">
            <h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Posts Per User
            </h3>
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                        data={chartData}
                        margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
                    >
                        <CartesianGrid/>
                        <XAxis
                            dataKey="name"
                            tick={{ fill: '#52525b', fontSize: 12 }}
                            interval={0}
                            angle={-20}
                            textAnchor="end"
                            height={64}
                        />
                        <YAxis allowDecimals={false} tick={{ fill: '#52525b', fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="posts" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                    </RechartsBarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
export default BarChart