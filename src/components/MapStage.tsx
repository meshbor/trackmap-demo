import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { MAP_CENTER, type FleetUnit } from '../data/fleet'
import { MapMarkers } from './MapMarkers'

type Props = {
  units: FleetUnit[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function MapStage({ units, selectedId, onSelect }: Props) {
  return (
    <div className="map-stage">
      <MapContainer
        center={MAP_CENTER}
        zoom={13}
        className="map-canvas"
        zoomControl={false}
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <MapMarkers units={units} selectedId={selectedId} onSelect={onSelect} />
      </MapContainer>
      <div className="map-legend" aria-hidden>
        <span>
          <i className="dot moving" /> В пути
        </span>
        <span>
          <i className="dot idle" /> Стоянка
        </span>
        <span>
          <i className="dot alert" /> Внимание
        </span>
      </div>
    </div>
  )
}
