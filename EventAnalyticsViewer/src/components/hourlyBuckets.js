const HOURS = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)

export function buildHourlyBuckets(events = []) {
  const eventTypes = Array.from(
    new Set(
      events
        .map((event) => event?.eventType)
        .filter((type) => typeof type === 'string' && type.trim()),
    ),
  ).sort()

  const baseCounts = Object.fromEntries(eventTypes.map((type) => [type, 0]))
  const hourMap = Object.fromEntries(HOURS.map((hour) => [hour, { hour, ...baseCounts }]))

  for (const event of events) {
    const timestamp = new Date(event?.timestamp)
    const type = event?.eventType

    if (Number.isNaN(timestamp.getTime()) || !eventTypes.includes(type)) continue

    const hour = `${String(timestamp.getHours()).padStart(2, '0')}:00`
    hourMap[hour][type] += 1
  }

  return { eventTypes, data: HOURS.map((hour) => hourMap[hour]) }
}
