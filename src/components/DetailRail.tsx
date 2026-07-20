import { STATUS_LABEL, type FleetUnit } from '../data/fleet'

type Props = {
  unit: FleetUnit | null
  paused: boolean
  onTogglePause: () => void
}

export function DetailRail({ unit, paused, onTogglePause }: Props) {
  return (
    <aside className="detail">
      <div className="panel-head">
        <h2>Карточка</h2>
        <button type="button" className="chip" onClick={onTogglePause}>
          {paused ? '▶ Поток' : '❚❚ Пауза'}
        </button>
      </div>

      {!unit ? (
        <p className="empty-hint">
          Выберите объект в списке или на карте — откроется live-карточка.
        </p>
      ) : (
        <div className="detail-card">
          <p className="eyebrow">{unit.role}</p>
          <h3>{unit.callsign}</h3>
          <dl className="kv">
            <div>
              <dt>Статус</dt>
              <dd>
                <span className={`pill ${unit.status}`}>
                  {STATUS_LABEL[unit.status]}
                </span>
              </dd>
            </div>
            <div>
              <dt>Скорость</dt>
              <dd className="mono">{unit.speedKmh.toFixed(1)} км/ч</dd>
            </div>
            <div>
              <dt>Курс</dt>
              <dd className="mono">{unit.heading.toFixed(0)}°</dd>
            </div>
            <div>
              <dt>Координаты</dt>
              <dd className="mono">
                {unit.lat.toFixed(5)}, {unit.lng.toFixed(5)}
              </dd>
            </div>
            <div>
              <dt>Обновлено</dt>
              <dd className="mono">
                {new Date(unit.updatedAt).toLocaleTimeString('ru-RU')}
              </dd>
            </div>
          </dl>
        </div>
      )}

      <div className="course-note">
        <p className="eyebrow">В полном курсе здесь</p>
        <ul>
          <li>WebSocket + Shared Worker (один канал на вкладки)</li>
          <li>Кластеризация в Web Worker</li>
          <li>Perf-проход анимации маркеров</li>
          <li>ADR, тесты, bundle budget</li>
        </ul>
      </div>
    </aside>
  )
}
