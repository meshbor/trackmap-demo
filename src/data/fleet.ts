export type UnitStatus = 'moving' | 'idle' | 'alert'

export type FleetUnit = {
  id: string
  callsign: string
  role: string
  status: UnitStatus
  lat: number
  lng: number
  speedKmh: number
  heading: number
  updatedAt: number
}

/** Центр демо — Москва, Патриаршие */
export const MAP_CENTER: [number, number] = [55.763, 37.592]

const SEEDS: Omit<FleetUnit, 'lat' | 'lng' | 'heading' | 'updatedAt' | 'speedKmh'>[] = [
  { id: 'u1', callsign: 'Альфа-12', role: 'Курьер', status: 'moving' },
  { id: 'u2', callsign: 'Браво-04', role: 'Курьер', status: 'moving' },
  { id: 'u3', callsign: 'Чарли-09', role: 'Бригада', status: 'idle' },
  { id: 'u4', callsign: 'Дельта-21', role: 'Курьер', status: 'moving' },
  { id: 'u5', callsign: 'Эхо-07', role: 'Инкассация', status: 'alert' },
  { id: 'u6', callsign: 'Фокстрот-15', role: 'Курьер', status: 'moving' },
  { id: 'u7', callsign: 'Гольф-03', role: 'Бригада', status: 'idle' },
  { id: 'u8', callsign: 'Хотел-18', role: 'Курьер', status: 'moving' },
]

/** Орбиты вокруг центра — стабильный «живой» паттерн без бэкенда */
const ORBITS = [
  { rLat: 0.012, rLng: 0.018, speed: 0.35, phase: 0.2 },
  { rLat: 0.009, rLng: 0.014, speed: 0.42, phase: 1.1 },
  { rLat: 0.006, rLng: 0.01, speed: 0.08, phase: 2.4 },
  { rLat: 0.015, rLng: 0.011, speed: 0.28, phase: 3.6 },
  { rLat: 0.011, rLng: 0.016, speed: 0.12, phase: 4.2 },
  { rLat: 0.008, rLng: 0.013, speed: 0.5, phase: 5.0 },
  { rLat: 0.005, rLng: 0.008, speed: 0.05, phase: 0.9 },
  { rLat: 0.014, rLng: 0.009, speed: 0.33, phase: 2.0 },
]

export function createInitialFleet(now = Date.now()): FleetUnit[] {
  return SEEDS.map((seed, i) => {
    const o = ORBITS[i]
    const t = now / 1000
    const angle = t * o.speed + o.phase
    const lat = MAP_CENTER[0] + Math.sin(angle) * o.rLat
    const lng = MAP_CENTER[1] + Math.cos(angle) * o.rLng
    const heading = ((angle * 180) / Math.PI + 90) % 360
    const speedKmh =
      seed.status === 'idle' ? 0 : seed.status === 'alert' ? 12 : 18 + (i % 4) * 6
    return {
      ...seed,
      lat,
      lng,
      heading,
      speedKmh,
      updatedAt: now,
    }
  })
}

export function tickFleet(prev: FleetUnit[], now: number): FleetUnit[] {
  return prev.map((unit, i) => {
    if (unit.status === 'idle') {
      return { ...unit, speedKmh: 0, updatedAt: now }
    }
    const o = ORBITS[i]
    const t = now / 1000
    const angle = t * o.speed + o.phase
    const lat = MAP_CENTER[0] + Math.sin(angle) * o.rLat
    const lng = MAP_CENTER[1] + Math.cos(angle) * o.rLng
    const heading = ((angle * 180) / Math.PI + 90) % 360
    // редкий «алерт» на Эхо
    let status = unit.status
    if (unit.id === 'u5') {
      status = Math.sin(t * 0.4) > 0.7 ? 'alert' : 'moving'
    }
    const speedKmh =
      status === 'alert' ? 8 + Math.abs(Math.sin(t)) * 10 : 16 + (i % 5) * 5
    return { ...unit, lat, lng, heading, speedKmh, status, updatedAt: now }
  })
}

export const STATUS_LABEL: Record<UnitStatus, string> = {
  moving: 'В пути',
  idle: 'Стоянка',
  alert: 'Внимание',
}
