const MEMBER_PROFILE_KEY = 'roomi_member_profile'
const ACCESS_TOKEN_KEY = 'roomi_access_token'
const AUTH_CHANGED_EVENT = 'roomi-auth-changed'

export interface StoredMemberProfile {
  _id: string
  memberType: string
  memberStatus: string
  memberAuthType: string
  memberPhone: string
  memberNick: string
  memberFullName: string | null
  memberImage?: string
  memberProperties: number
  memberArticles: number
  memberPoints: number
  memberLikes?: number
  memberViews: number
  memberComments: number
  memberRank?: number
  memberWarnings: number
  memberBlocks: number
  deletedAt: string | null
  createdAt: string
  updatedAt: string
}

export function getAccessToken(): string {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem(ACCESS_TOKEN_KEY) || ''
}

export function setAccessToken(token: string) {
  if (typeof window === 'undefined') return
  if (!token) {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
  } else {
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
  }
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT))
}

export function clearAccessToken() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(MEMBER_PROFILE_KEY)
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT))
}

export function setMemberProfile(profile: StoredMemberProfile) {
  if (typeof window === 'undefined') return
  localStorage.setItem(MEMBER_PROFILE_KEY, JSON.stringify(profile))
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT))
}

export function getMemberProfile(): StoredMemberProfile | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(MEMBER_PROFILE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as StoredMemberProfile
  } catch {
    return null
  }
}

export function getAuthChangedEventName() {
  return AUTH_CHANGED_EVENT
}

export function isAuthenticated(): boolean {
  return Boolean(getMemberProfile())
}

export function getAccountDashboardPath(): string {
  const memberType = String(getMemberProfile()?.memberType || '').toUpperCase()

  if (memberType === 'ADMIN') return '/admin'
  if (memberType === 'AGENT') return '/agent'
  return '/my-page'
}
