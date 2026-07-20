import { useEffect, useState } from 'react'
import { createInitialFleet, tickFleet, type FleetUnit } from '../data/fleet'

const TICK_MS = 800

export function useSimulatedFeed(paused: boolean) {
  const [units, setUnits] = useState<FleetUnit[]>(() => createInitialFleet())

  useEffect(() => {
    if (paused) return
    const id = window.setInterval(() => {
      setUnits((prev) => tickFleet(prev, Date.now()))
    }, TICK_MS)
    return () => window.clearInterval(id)
  }, [paused])

  return units
}
