const HOURS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)

const FUNNEL_STAGES = ['app_opened', 'task_viewed', 'task_created', 'task_completed']

const FUNNEL_STAGE_ALIASES = {
  app_opened: ['app_opened', 'page_view'],
  task_viewed: ['task_viewed', 'view_cart', 'product_details', 'video_play'],
  task_created: ['task_created', 'add_to_cart', 'start_checkout', 'form_submit'],
  task_completed: ['task_completed', 'purchase', 'order_completed', 'subscription_purchased'],
}

function toKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
}

function getUserKey(event) {
  return event?.userId ?? event?.userEmail ?? event?.userName ?? 'unknown-user'
}

export function buildHourlyFrequency(events = []) {
  const eventTypes = Array.from(
    new Set(events.map((e) => toKey(e?.eventType)).filter(Boolean)),
  ).sort()

  const base = Object.fromEntries(eventTypes.map((type) => [type, 0]))
  const buckets = Object.fromEntries(HOURS.map((hour) => [hour, { hour, ...base }]))

  for (const event of events) {
    const date = new Date(event?.timestamp)
    const eventType = toKey(event?.eventType)

    if (Number.isNaN(date.getTime()) || !eventType || !buckets[`${String(date.getHours()).padStart(2, '0')}:00`]) {
      continue
    }

    const hour = `${String(date.getHours()).padStart(2, '0')}:00`
    buckets[hour][eventType] += 1
  }

  return { eventTypes, data: HOURS.map((hour) => buckets[hour]) }
}

export function buildFunnel(events = []) {
  const users = {}

  for (const event of events) {
    const userKey = getUserKey(event)
    if (!users[userKey]) users[userKey] = []
    users[userKey].push(event)
  }

  const stageCounts = Object.fromEntries(FUNNEL_STAGES.map((stage) => [stage, 0]))

  for (const userEvents of Object.values(users)) {
    const ordered = [...userEvents].sort(
      (a, b) => new Date(a?.timestamp).getTime() - new Date(b?.timestamp).getTime(),
    )

    let progress = 0
    for (const event of ordered) {
      const keyA = toKey(event?.eventType)
      const keyB = toKey(event?.eventName)
      const stage = FUNNEL_STAGES[progress]
      const aliases = FUNNEL_STAGE_ALIASES[stage] || [stage]

      if (aliases.includes(keyA) || aliases.includes(keyB)) {
        progress += 1
        if (progress === FUNNEL_STAGES.length) break
      }
    }

    for (let i = 0; i < progress; i += 1) {
      stageCounts[FUNNEL_STAGES[i]] += 1
    }
  }

  const first = stageCounts[FUNNEL_STAGES[0]] || 0

  return FUNNEL_STAGES.map((stage, i) => {
    const count = stageCounts[stage]
    const prevCount = i === 0 ? count : stageCounts[FUNNEL_STAGES[i - 1]] || 0

    return {
      stage,
      users: count,
      conversionRate: first ? Number(((count / first) * 100).toFixed(1)) : 0,
      dropOffPct: i === 0 || prevCount === 0 ? 0 : Number((((prevCount - count) / prevCount) * 100).toFixed(1)),
    }
  })
}

export function buildUserSegmentation(events = []) {
  const byDevice = {}
  const byRole = {}
  const byPlan = {}

  for (const event of events) {
    const user = getUserKey(event)
    const device = toKey(event?.properties?.device) || 'unknown'
    const plan = toKey(event?.userSegment || event?.plan || event?.properties?.plan) || 'unknown'
    const role =
      toKey(event?.userRole || event?.role || event?.properties?.role || event?.properties?.userRole) ||
      plan

    if (!byDevice[device]) byDevice[device] = new Set()
    if (!byRole[role]) byRole[role] = new Set()
    if (!byPlan[plan]) byPlan[plan] = new Set()

    byDevice[device].add(user)
    byRole[role].add(user)
    byPlan[plan].add(user)
  }

  const toArray = (map) =>
    Object.entries(map)
      .map(([name, set]) => ({ name, value: set.size }))
      .sort((a, b) => b.value - a.value)

  return {
    devices: toArray(byDevice),
    roles: toArray(byRole),
    plans: toArray(byPlan),
  }
}

export function buildSessionDurationDistribution(events = []) {
  const sessions = {}

  for (const event of events) {
    const sessionId = event?.properties?.sessionId
    const ts = new Date(event?.timestamp).getTime()
    if (!sessionId || Number.isNaN(ts)) continue

    if (!sessions[sessionId]) sessions[sessionId] = { min: ts, max: ts }
    sessions[sessionId].min = Math.min(sessions[sessionId].min, ts)
    sessions[sessionId].max = Math.max(sessions[sessionId].max, ts)
  }

  const labels = ['0-1m', '1-5m', '5-15m', '15-30m', '30m+']
  const counts = Object.fromEntries(labels.map((label) => [label, 0]))

  for (const session of Object.values(sessions)) {
    const mins = (session.max - session.min) / 60000
    if (mins <= 1) counts['0-1m'] += 1
    else if (mins <= 5) counts['1-5m'] += 1
    else if (mins <= 15) counts['5-15m'] += 1
    else if (mins <= 30) counts['15-30m'] += 1
    else counts['30m+'] += 1
  }

  return labels.map((bucket) => ({ bucket, sessions: counts[bucket] || 0 }))
}

export function buildLiveFeed(events = [], limit = 25) {
  return [...events]
    .sort((a, b) => new Date(b?.timestamp).getTime() - new Date(a?.timestamp).getTime())
    .slice(0, limit)
}
