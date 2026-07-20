import { STATUS_LABEL, type FleetUnit, type UnitStatus } from '../data/fleet'

type Filter = 'all' | UnitStatus

type Props = {
  units: FleetUnit[]
  filter: Filter
  onFilter: (f: Filter) => void
  selectedId: string | null
  onSelect: (id: string) => void
}

export function UnitList({ units, filter, onFilter, selectedId, onSelect }: Props) {
  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: 'Все' },
    { id: 'moving', label: 'В пути' },
    { id: 'idle', label: 'Стоянка' },
    { id: 'alert', label: 'Алерт' },
  ]

  const visible =
    filter === 'all' ? units : units.filter((u) => u.status === filter)

  return (
    <aside className="panel">
      <div className="panel-head">
        <h2>Объекты</h2>
        <span className="muted mono">{visible.length}</span>
      </div>

      <div className="filters" role="tablist" aria-label="Фильтр статуса">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            className={filter === f.id ? 'chip active' : 'chip'}
            onClick={() => onFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="unit-list">
        {visible.map((unit) => (
          <li key={unit.id}>
            <button
              type="button"
              className={
                unit.id === selectedId ? 'unit-row selected' : 'unit-row'
              }
              onClick={() => onSelect(unit.id)}
            >
              <span className={`status-dot ${unit.status}`} />
              <span className="unit-meta">
                <span className="callsign">{unit.callsign}</span>
                <span className="muted">
                  {unit.role} · {STATUS_LABEL[unit.status]}
                </span>
              </span>
              <span className="mono speed">{unit.speedKmh.toFixed(0)}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
