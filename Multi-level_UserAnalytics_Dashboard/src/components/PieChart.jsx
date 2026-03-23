import {
	Cell,
	Legend,
	Pie,
	PieChart as RechartsPieChart,
	ResponsiveContainer,
	Tooltip,
} from 'recharts'

const COLORS = ['#0ea5e9', '#22c55e', '#f97316', '#8b5cf6', '#ef4444', '#14b8a6']

function PieChart({ nestedData }) {
	const chartData = nestedData.map((user) => {
		const comments = user.posts.reduce(
			(total, post) => total + post.comments.length,
			0,
		)

		return {
			name: user.name,
			comments,
		}
	})

	return (
		<div className="rounded-xl bg-white p-4 shadow dark:bg-zinc-800">
			<h3 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
				Comments Distribution Across Users
			</h3>
			<div className="h-72 w-full">
				<ResponsiveContainer width="100%" height="100%">
					<RechartsPieChart>
						<Pie
							data={chartData}
							dataKey="comments"
							nameKey="name"
							cx="50%"
							cy="50%"
							outerRadius={90}
							label
						>
							{chartData.map((entry, index) => (
								<Cell
									key={`${entry.name}-${entry.comments}`}
									fill={COLORS[index % COLORS.length]}
								/>
							))}
						</Pie>
						<Tooltip />
						<Legend />
					</RechartsPieChart>
				</ResponsiveContainer>
			</div>
		</div>
	)
}

export default PieChart
