import { getAccessToken } from '@/lib/auth'

const GRAPHQL_URL =
  import.meta.env.VITE_GRAPHQL_URL ||
  (typeof window !== 'undefined'
    ? `${window.location.protocol}//${window.location.hostname}:3008/graphql`
    : 'http://localhost:3008/graphql')

function getWsBaseUrl(): string {
  const explicitWsUrl = (import.meta.env.VITE_WS_URL as string | undefined)?.trim()
  if (explicitWsUrl) return explicitWsUrl

  const graphqlBase = GRAPHQL_URL.replace(/\/graphql\/?$/, '')

  try {
    const url = new URL(graphqlBase)
    url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:'
    return url.toString().replace(/\/$/, '')
  } catch {
    const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:'
    const protocol = isHttps ? 'wss' : 'ws'
    const host = typeof window !== 'undefined' ? window.location.host : 'localhost:3008'
    return `${protocol}://${host}`
  }
}

export function buildSocketUrl(): string {
  const base = getWsBaseUrl()
  const token = getAccessToken()

  if (!token) return base
  const separator = base.includes('?') ? '&' : '?'
  return `${base}${separator}token=${encodeURIComponent(token)}`
}

