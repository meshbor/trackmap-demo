import { DivIcon } from 'leaflet'
import { Marker, Popup, useMap } from 'react-leaflet'
import { useEffect } from 'react'
import type { FleetUnit } from '../data/fleet'
import { STATUS_LABEL } from '../data/fleet'

const COLORS: Record<FleetUnit['status'], string> = {
  moving: '#1F7A5C',
  idle: '#6B7280',
  alert: '#C45C26',
}

function markerIcon(status: FleetUnit['status'], selected: boolean) {
  const color = COLORS[status]
  const ring = selected ? '3px solid #0B3D2E' : '2px solid #fff'
  return new DivIcon({
    className: 'tm-marker',
    html: `<span style="
      display:block;width:14px;height:14px;border-radius:50%;
      background:${color};box-shadow:0 0 0 4px ${color}33;
      border:${ring};transform:translate(-50%,-50%);
    "></span>`,
    iconSize: [14, 14],
    iconAnchor: [0, 0],
  })
}

function FlyToSelected({ unit }: { unit: FleetUnit | null }) {
  const map = useMap()
  useEffect(() => {
    if (!unit) return
    map.flyTo([unit.lat, unit.lng], Math.max(map.getZoom(), 14), { duration: 0.6 })
  }, [unit?.id]) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}

type Props = {
  units: FleetUnit[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function MapMarkers({ units, selectedId, onSelect }: Props) {
  const selected = units.find((u) => u.id === selectedId) ?? null

  return (
    <>
      <FlyToSelected unit={selected} />
      {units.map((unit) => (
        <Marker
          key={unit.id}
          position={[unit.lat, unit.lng]}
          icon={markerIcon(unit.status, unit.id === selectedId)}
          eventHandlers={{ click: () => onSelect(unit.id) }}
        >
          <Popup>
            <strong>{unit.callsign}</strong>
            <br />
            {unit.role} · {STATUS_LABEL[unit.status]}
            <br />
            {unit.speedKmh.toFixed(0)} км/ч
          </Popup>
        </Marker>
      ))}
    </>
  )
}
