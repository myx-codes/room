import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react'
import { getAuthChangedEventName } from '@/lib/auth'
import { buildSocketUrl } from '@/lib/socket'

type SocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

type SocketContextValue = {
  socket: WebSocket | null
  status: SocketStatus
  lastError: string
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  status: 'disconnected',
  lastError: '',
})

const MAX_RECONNECT_ATTEMPTS = 10

export function SocketProvider({ children }: PropsWithChildren) {
  const socketRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<number | null>(null)
  const reconnectAttemptRef = useRef(0)
  const manuallyClosedRef = useRef(false)

  const [status, setStatus] = useState<SocketStatus>('disconnected')
  const [lastError, setLastError] = useState('')

  const clearReconnectTimeout = () => {
    if (reconnectTimeoutRef.current !== null) {
      window.clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
  }

  const connect = useCallback(() => {
    clearReconnectTimeout()

    if (socketRef.current?.readyState === WebSocket.OPEN || socketRef.current?.readyState === WebSocket.CONNECTING) {
      return
    }

    manuallyClosedRef.current = false
    setStatus('connecting')
    setLastError('')

    const socketUrl = buildSocketUrl()
    const ws = new WebSocket(socketUrl)
    socketRef.current = ws

    ws.onopen = () => {
      reconnectAttemptRef.current = 0
      setStatus('connected')
      setLastError('')
      console.info('[socket] connect', { url: socketUrl })
    }

    ws.onerror = () => {
      setStatus('error')
      setLastError('Realtime connection failed. Some live updates may be delayed.')
      console.error('[socket] connect_error', { url: socketUrl })
    }

    ws.onclose = (event) => {
      const wasManual = manuallyClosedRef.current
      setStatus('disconnected')
      console.warn('[socket] disconnect', { code: event.code, reason: event.reason, wasManual })

      if (wasManual) return
      if (reconnectAttemptRef.current >= MAX_RECONNECT_ATTEMPTS) return

      reconnectAttemptRef.current += 1
      const timeoutMs = Math.min(1000 * reconnectAttemptRef.current, 10000)
      console.info('[socket] reconnect_attempt', {
        attempt: reconnectAttemptRef.current,
        timeoutMs,
      })

      reconnectTimeoutRef.current = window.setTimeout(() => {
        connect()
      }, timeoutMs)
    }
  }, [])

  useEffect(() => {
    connect()

    const authEvent = getAuthChangedEventName()
    const handleAuthChanged = () => {
      manuallyClosedRef.current = true
      clearReconnectTimeout()
      socketRef.current?.close()
      socketRef.current = null
      reconnectAttemptRef.current = 0
      connect()
    }

    window.addEventListener(authEvent, handleAuthChanged)
    return () => {
      window.removeEventListener(authEvent, handleAuthChanged)
      manuallyClosedRef.current = true
      clearReconnectTimeout()
      socketRef.current?.close()
      socketRef.current = null
    }
  }, [connect])

  const value = useMemo(
    () => ({
      socket: socketRef.current,
      status,
      lastError,
    }),
    [status, lastError],
  )

  return (
    <SocketContext.Provider value={value}>
      {children}
      {lastError ? (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-md bg-slate-900/90 px-3 py-2 text-xs text-white shadow-lg">
          {lastError}
        </div>
      ) : null}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  return useContext(SocketContext)
}

