import { useMemo, useState } from 'react'
import { MapStage } from './components/MapStage'
import { UnitList } from './components/UnitList'
import { DetailRail } from './components/DetailRail'
import { useSimulatedFeed } from './hooks/useSimulatedFeed'
import { useTabPresence } from './hooks/useTabPresence'
import type { UnitStatus } from './data/fleet'
import './App.css'

type Filter = 'all' | UnitStatus

export default function App() {
  const [paused, setPaused] = useState(false)
  const [filter, setFilter] = useState<Filter>('all')
  const [selectedId, setSelectedId] = useState<string | null>('u1')
  const units = useSimulatedFeed(paused)
  const tabCount = useTabPresence()

  const selected = useMemo(
    () => units.find((u) => u.id === selectedId) ?? null,
    [units, selectedId],
  )

  const alerts = units.filter((u) => u.status === 'alert').length

  return (
    <div className="app">
      <header className="banner">
        <div className="banner-brand">
          <span className="logo" aria-hidden />
          <div>
            <p className="product-name">TrackMap</p>
            <p className="tagline">
              Демо итогового продукта · курс React Advanced
            </p>
          </div>
        </div>
        <p className="banner-note">
          Студенты соберут полную версию: Workers, Shared Worker + WebSocket,
          perf, тесты.
        </p>
      </header>

      <div className="topbar">
        <div className="stats">
          <div className="stat">
            <span className="stat-label">Объекты</span>
            <span className="stat-value mono">{units.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Алерты</span>
            <span className={`stat-value mono ${alerts ? 'warn' : ''}`}>
              {alerts}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Вкладки</span>
            <span className="stat-value mono">{tabCount}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Канал</span>
            <span className="stat-value live">
              <i className="pulse" />
              {paused ? 'paused' : 'live sim'}
            </span>
          </div>
        </div>
        <p className="hint">
          Откройте эту страницу во второй вкладке — счётчик «Вкладки»
          обновится (лёгкий multi-tab sync).
        </p>
      </div>

      <main className="workspace">
        <UnitList
          units={units}
          filter={filter}
          onFilter={setFilter}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <MapStage
          units={units}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <DetailRail
          unit={selected}
          paused={paused}
          onTogglePause={() => setPaused((p) => !p)}
        />
      </main>
    </div>
  )
}
