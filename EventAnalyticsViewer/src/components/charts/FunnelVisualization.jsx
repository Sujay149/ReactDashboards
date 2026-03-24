const STAGE_LABELS = {
  app_opened: 'App Opened',
  task_viewed: 'Task Viewed',
  task_created: 'Task Created',
  task_completed: 'Task Completed',
}

const STAGE_COLORS = ['#2563eb', '#0891b2', '#ca8a04', '#16a34a']

function FunnelVisualization({ data }) {
  const maxUsers = data.length > 0 ? Math.max(...data.map((d) => d.users), 1) : 1

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="mb-1 text-base font-semibold text-gray-900">Funnel Conversion</h2>
      <p className="mb-4 text-xs text-gray-500">
        app_opened → task_viewed → task_created → task_completed
      </p>

      <div className="space-y-3">
        {data.map((row, i) => {
          const barWidth = maxUsers > 0 ? (row.users / maxUsers) * 100 : 0
          const color = STAGE_COLORS[i % STAGE_COLORS.length]

          return (
            <div key={row.stage}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">
                  {STAGE_LABELS[row.stage] || row.stage}
                </span>
                <span className="text-gray-500">
                  {row.users} users · <strong>{row.conversionRate}%</strong>
                  {row.dropOffPct > 0 && (
                    <span className="ml-1 text-red-500">(↓{row.dropOffPct}%)</span>
                  )}
                </span>
              </div>
              <div className="h-7 w-full rounded bg-gray-100">
                <div
                  className="h-full rounded"
                  style={{ width: `${barWidth}%`, backgroundColor: color }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {data.length >= 2 && (
        <div className="mt-4 rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-xs text-gray-600">
          Overall conversion: <strong>{data[data.length - 1].conversionRate}%</strong>
          {' '}({data[0].users} → {data[data.length - 1].users} users)
        </div>
      )}
    </div>
  )
}

export default FunnelVisualization
