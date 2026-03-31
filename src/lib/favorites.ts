import { getMemberProfile } from './auth'

const LIKED_PROPERTIES_NAMESPACE = 'roomi_liked_properties'
const LEGACY_LIKED_PROPERTIES_KEY = LIKED_PROPERTIES_NAMESPACE
const GUEST_SCOPE = 'guest'

function normalizeIds(ids: unknown[]): string[] {
  return Array.from(
    new Set(
      ids.filter((item): item is string => typeof item === 'string' && item.trim().length > 0),
    ),
  )
}

function parseLikedPropertyIds(raw: string | null): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? normalizeIds(parsed) : []
  } catch {
    return []
  }
}

export function getLikedPropertiesStorageKey(): string {
  const memberId = getMemberProfile()?._id?.trim()
  const scope = memberId || GUEST_SCOPE
  return `${LIKED_PROPERTIES_NAMESPACE}_${scope}`
}

export function readLikedPropertyIds(): string[] {
  if (typeof window === 'undefined') return []

  const scopedKey = getLikedPropertiesStorageKey()
  const scopedRaw = localStorage.getItem(scopedKey)
  if (scopedRaw !== null) {
    return parseLikedPropertyIds(scopedRaw)
  }

  // One-time migration from legacy global key to user-scoped key.
  const legacyIds = parseLikedPropertyIds(localStorage.getItem(LEGACY_LIKED_PROPERTIES_KEY))
  if (legacyIds.length > 0) {
    localStorage.setItem(scopedKey, JSON.stringify(legacyIds))
  }
  return legacyIds
}

export function writeLikedPropertyIds(ids: string[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(getLikedPropertiesStorageKey(), JSON.stringify(normalizeIds(ids)))
}
