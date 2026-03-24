import { useEffect, useMemo, useState } from 'react'
import EventFrequencyChart from './components/charts/EventFrequencyChart'
import Header from './components/Header'
import FunnelVisualization from './components/charts/FunnelVisualization'
import LiveEventFeedTable from './components/LiveEventFeedTable'
import SessionDurationDistribution from './components/charts/SessionDurationDistribution'
import UserSegmentation from './components/charts/UserSegmentation'
import {
  buildFunnel,
  buildHourlyFrequency,
  buildLiveFeed,
  buildSessionDurationDistribution,
  buildUserSegmentation,
} from './components/analytics'

function App() {
  const [events, setEvents] = useState([])
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState('')

  useEffect(() => {
    const fetchEvents = () => {
      fetch('http://localhost:3000/events')
        .then((res) => {
          if (!res.ok) throw new Error(`Failed to fetch events: ${res.status}`)
          return res.json()
        })
        .then((data) => {
          setEvents(Array.isArray(data) ? data : [])
          setLastUpdated(new Date().toLocaleTimeString())
          setError('')
        })
        .catch((err) => {
          setError(err.message || 'Failed to load events')
        })
    }

    fetchEvents()
    const intervalId = setInterval(fetchEvents, 5000)
    return () => clearInterval(intervalId)
  }, [])

  const { data: hourlyData, eventTypes } = useMemo(() => buildHourlyFrequency(events), [events])
  const funnelData = useMemo(() => buildFunnel(events), [events])
  const segmentation = useMemo(() => buildUserSegmentation(events), [events])
  const sessionDurations = useMemo(() => buildSessionDurationDistribution(events), [events])
  const liveFeed = useMemo(() => buildLiveFeed(events, 30), [events])

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <Header totalEvents={events.length} error={error} lastUpdated={lastUpdated} />

      <div className="mt-6 space-y-6">
        <EventFrequencyChart data={hourlyData} eventTypes={eventTypes} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <FunnelVisualization data={funnelData} />
          <SessionDurationDistribution data={sessionDurations} />
        </div>

        <UserSegmentation data={segmentation} />
        <LiveEventFeedTable rows={liveFeed} />
      </div>
    </div>
  )
}

export default App
