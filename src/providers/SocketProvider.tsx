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
import { io, type Socket } from 'socket.io-client'
import { getAccessToken, getAuthChangedEventName } from '@/lib/auth'
import { buildSocketConnectionConfig } from '@/lib/socket'

type SocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

type SocketContextValue = {
  socket: Socket | null
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
  const socketRef = useRef<Socket | null>(null)
  const manuallyClosedRef = useRef(false)

  const [status, setStatus] = useState<SocketStatus>('disconnected')
  const [lastError, setLastError] = useState('')

  const disconnectCurrentSocket = useCallback(() => {
    if (!socketRef.current) return

    socketRef.current.removeAllListeners()
    socketRef.current.disconnect()
    socketRef.current = null
  }, [])

  const connect = useCallback(() => {
    const activeSocket = socketRef.current
    if (activeSocket?.connected || activeSocket?.active) return

    manuallyClosedRef.current = false
    setStatus('connecting')
    setLastError('')

    const { origin, path } = buildSocketConnectionConfig()
    const token = getAccessToken()
    const socket = io(origin, {
      path,
      transports: ['websocket'],
      auth: token ? { token } : undefined,
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
    })

    socketRef.current = socket

    socket.on('connect', () => {
      setStatus('connected')
      setLastError('')
      console.info('[socket] connect', { id: socket.id, origin, path })
    })

    socket.on('connect_error', (error) => {
      setStatus('error')
      setLastError('Realtime connection failed. Some live updates may be delayed.')
      console.error('[socket] connect_error', { message: error.message, origin, path })
    })

    socket.on('disconnect', (reason) => {
      const wasManual = manuallyClosedRef.current
      setStatus('disconnected')
      console.warn('[socket] disconnect', { reason, wasManual })
    })

    socket.io.on('reconnect_attempt', (attempt) => {
      setStatus('connecting')
      console.info('[socket] reconnect_attempt', { attempt })
    })

    socket.io.on('reconnect_failed', () => {
      setStatus('error')
      setLastError('Realtime connection failed. Some live updates may be delayed.')
      console.error('[socket] reconnect_failed', { origin, path })
    })
  }, [])

  useEffect(() => {
    connect()

    const authEvent = getAuthChangedEventName()
    const handleAuthChanged = () => {
      manuallyClosedRef.current = true
      disconnectCurrentSocket()
      connect()
    }

    window.addEventListener(authEvent, handleAuthChanged)
    return () => {
      window.removeEventListener(authEvent, handleAuthChanged)
      manuallyClosedRef.current = true
      disconnectCurrentSocket()
    }
  }, [connect, disconnectCurrentSocket])

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
