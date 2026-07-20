import { useEffect, useState } from 'react'

const CHANNEL = 'trackmap-demo-tabs'

/**
 * Лёгкая иллюстрация multi-tab sync для заказчика.
 * В полном курсе здесь будет Shared Worker + один WebSocket.
 */
export function useTabPresence() {
  const [tabCount, setTabCount] = useState(1)

  useEffect(() => {
    const bc = new BroadcastChannel(CHANNEL)
    const tabId = crypto.randomUUID()
    const alive = new Map<string, number>()

    const publish = () => {
      bc.postMessage({ type: 'ping', tabId, at: Date.now() })
    }

    const recompute = () => {
      const now = Date.now()
      for (const [id, at] of alive) {
        if (now - at > 4000) alive.delete(id)
      }
      alive.set(tabId, now)
      setTabCount(alive.size)
    }

    bc.onmessage = (ev: MessageEvent<{ type: string; tabId: string; at: number }>) => {
      if (ev.data?.type === 'ping' && ev.data.tabId) {
        alive.set(ev.data.tabId, ev.data.at)
        recompute()
      }
    }

    publish()
    recompute()
    const ping = window.setInterval(publish, 1500)
    const sweep = window.setInterval(recompute, 1000)

    return () => {
      window.clearInterval(ping)
      window.clearInterval(sweep)
      bc.close()
    }
  }, [])

  return tabCount
}
