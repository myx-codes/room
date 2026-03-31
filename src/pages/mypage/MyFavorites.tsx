import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { Star, MapPin, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GET_COMMENTS, GET_PROPERTIES } from '@/graphql/user/query'
import { apolloClient } from '@/lib/apolloClient'
import { CommentGroup } from '@/lib/client/enums/comment.enum'

type ApiProperty = {
  _id: string
  propertyType: string
  propertyLocation: string
  propertyTitle: string
  propertyPrice: number
  propertyRank?: number
  propertyComments: number
  propertyImages: string[]
}

type FavoriteProperty = {
  id: string
  title: string
  location: string
  price: number
  rating: number
  reviews: number
  image: string
}

type GetPropertiesResponse = {
  getProperties: {
    list: ApiProperty[]
  }
}

type GetPropertiesVariables = {
  input: {
    page: number
    limit: number
    sort?: string
    direction?: 'ASC' | 'DESC'
    search: Record<string, never>
  }
}

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:3008/graphql'
const LIKED_PROPERTIES_KEY = 'roomi_liked_properties'

function getBackendOrigin(): string {
  try {
    return new URL(GRAPHQL_URL).origin
  } catch {
    return 'http://localhost:3008'
  }
}

function resolveImageUrl(imagePath?: string): string {
  if (!imagePath) return '/assets/hero-villa.jpg'
  if (/^https?:\/\//i.test(imagePath) || imagePath.startsWith('data:') || imagePath.startsWith('blob:')) {
    return imagePath
  }

  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  return `${getBackendOrigin()}${cleanPath}`
}

function formatLocation(value: string): string {
  return value
    .toLowerCase()
    .split('_')
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(' ')
}

function readLikedPropertyIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(LIKED_PROPERTIES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

function parseRoomiRatingFromCommentContent(content: string): number | null {
  const match = content?.match(/^ROOMi_RATING:(\d{1,2})\s*\r?\n/)
  if (!match) return null
  const parsed = Number(match[1])
  if (!Number.isFinite(parsed)) return null
  return Math.min(5, Math.max(1, parsed))
}

type BackendComment = {
  _id: string
  commentGroup: CommentGroup
  commentContent: string
  commentRefId: string
  createdAt: string
  memberData?: {
    memberNick: string
    memberFullName: string | null
  } | null
}

type GetCommentsResponse = {
  getComments: {
    list: BackendComment[]
  }
}

type GetCommentsVariables = {
  input: {
    page: number
    limit: number
    sort?: string
    direction?: 'ASC' | 'DESC'
    search: {
      commentRefId: string
    }
  }
}

export default function MyFavorites() {
  const { data, loading, error } = useQuery<GetPropertiesResponse, GetPropertiesVariables>(GET_PROPERTIES, {
    variables: {
      input: {
        page: 1,
        limit: 200,
        sort: 'createdAt',
        direction: 'DESC',
        search: {},
      },
    },
    fetchPolicy: 'network-only',
  })

  const likedIds = readLikedPropertyIds()
  const favorites: FavoriteProperty[] = (data?.getProperties?.list || [])
    .filter((item) => likedIds.includes(item._id))
    .map((item) => ({
      id: item._id,
      title: item.propertyTitle,
      location: formatLocation(item.propertyLocation),
      price: item.propertyPrice,
      rating: item.propertyRank || 0,
      reviews: item.propertyComments || 0,
      image: resolveImageUrl(item.propertyImages?.[0]),
    }))

  const [ratingsById, setRatingsById] = useState<Record<string, { rating: number; reviews: number }>>({})
  const fetchedRatingsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (favorites.length === 0) return

    const idsToFetch = favorites
      .map((p) => p.id)
      .filter((id) => !fetchedRatingsRef.current.has(id))

    if (idsToFetch.length === 0) return
    idsToFetch.forEach((id) => fetchedRatingsRef.current.add(id))

    let cancelled = false

    const fetchRatings = async () => {
      const CONCURRENCY = 5
      const queue = [...idsToFetch]

      const worker = async () => {
        while (queue.length > 0 && !cancelled) {
          const propertyId = queue.shift()
          if (!propertyId) break

          try {
            const { data: commentsData } = await apolloClient.query<GetCommentsResponse, GetCommentsVariables>({
              query: GET_COMMENTS,
              variables: {
                input: {
                  page: 1,
                  limit: 50,
                  sort: 'createdAt',
                  direction: 'DESC',
                  search: { commentRefId: propertyId },
                },
              },
              fetchPolicy: 'network-only',
            })

            const list = commentsData?.getComments?.list ?? []
            const ratings = list
              .filter((c) => c.commentGroup === CommentGroup.PROPERTY && c.commentRefId === propertyId)
              .map((c) => parseRoomiRatingFromCommentContent(c.commentContent))
              .filter((r): r is number => r !== null)

            if (ratings.length === 0) continue

            const avg = ratings.reduce((sum, r) => sum + r, 0) / ratings.length
            const ratingAvg = Math.round(avg * 10) / 10

            setRatingsById((prev) => ({
              ...prev,
              [propertyId]: { rating: ratingAvg, reviews: ratings.length },
            }))
          } catch {
            // ignore per-property errors
          }
        }
      }

      await Promise.all(Array.from({ length: CONCURRENCY }, worker))
    }

    fetchRatings()

    return () => {
      cancelled = true
    }
  }, [favorites])

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-foreground">Favorites</h2>
        <p className="text-sm text-muted-foreground mt-1">{favorites.length} saved properties</p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-2xl">
          <p className="text-muted-foreground">No favorites yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favorites.map((p) => (
            <div key={p.id} className="bg-card border border-border rounded-2xl overflow-hidden group">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Link to={`/properties/${p.id}`} className="block h-full">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover gentle-animation group-hover:scale-105" />
                </Link>
                <button className="absolute top-3 right-3 p-2 bg-card/90 backdrop-blur-sm rounded-full">
                  <Heart className="w-4 h-4 text-gold fill-gold" />
                </button>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
                  <MapPin className="w-3.5 h-3.5" />{p.location}
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{p.title}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-gold fill-gold" />
                    <span className="text-sm font-medium text-foreground">
                      {ratingsById[p.id]?.rating ?? p.rating}
                    </span>
                    <span className="text-xs text-muted-foreground">({ratingsById[p.id]?.reviews ?? p.reviews})</span>
                  </div>
                  <span className="font-semibold text-foreground">${p.price}/night</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && <p className="text-sm text-muted-foreground mt-4">Loading favorites...</p>}
      {error && <p className="text-sm text-destructive mt-4">Failed to load favorites: {error.message}</p>}
    </div>
  )
}
