import { useEffect, useRef, useState } from 'react'
import { GET_COMMENTS } from '@/graphql/user/query'
import { apolloClient } from '@/lib/apolloClient'
import { CommentGroup, CommentStatus } from '@/lib/client/enums/comment.enum'

export type PropertyRatingSummary = {
  rating: number
  ratingCount: number
}

type BackendComment = {
  commentGroup: CommentGroup
  commentStatus: string
  commentStars?: number | null
  commentRefId: string
}

type GetCommentsResponse = {
  getComments: {
    list: BackendComment[]
    metaCounter?: Array<{
      total?: number | null
    }> | null
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

function normalizeStars(stars?: number | null): number {
  if (typeof stars !== 'number' || !Number.isFinite(stars)) return 0
  return Math.min(5, Math.max(1, Math.round(stars)))
}

async function fetchPropertyRatingsFromDatabase(propertyId: string): Promise<PropertyRatingSummary> {
  const limit = 100
  let page = 1
  let totalPages = 1
  const stars: number[] = []

  while (page <= totalPages) {
    const { data } = await apolloClient.query<GetCommentsResponse, GetCommentsVariables>({
      query: GET_COMMENTS,
      variables: {
        input: {
          page,
          limit,
          sort: 'createdAt',
          direction: 'DESC',
          search: {
            commentRefId: propertyId,
          },
        },
      },
      fetchPolicy: 'network-only',
    })

    const list = data?.getComments?.list ?? []

    list.forEach((comment) => {
      const isPropertyComment = comment.commentGroup === CommentGroup.PROPERTY
      const isSameProperty = comment.commentRefId === propertyId
      const isActive = String(comment.commentStatus).toUpperCase() === CommentStatus.ACTIVE
      if (!isPropertyComment || !isSameProperty || !isActive) return

      const rating = normalizeStars(comment.commentStars)
      if (rating > 0) stars.push(rating)
    })

    const totalRaw = data?.getComments?.metaCounter?.[0]?.total
    const total = typeof totalRaw === 'number' && Number.isFinite(totalRaw) ? totalRaw : list.length
    totalPages = Math.max(1, Math.ceil(total / limit))
    page += 1

    if (list.length === 0) break
  }

  if (stars.length === 0) {
    return { rating: 0, ratingCount: 0 }
  }

  const avg = stars.reduce((sum, value) => sum + value, 0) / stars.length
  return {
    rating: Math.round(avg * 10) / 10,
    ratingCount: stars.length,
  }
}

export function usePropertyRatings(propertyIds: string[]) {
  const [ratingsById, setRatingsById] = useState<Record<string, PropertyRatingSummary>>({})
  const fetchedRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const uniquePropertyIds = Array.from(new Set(propertyIds.filter(Boolean)))
    if (uniquePropertyIds.length === 0) return

    const idsToFetch = uniquePropertyIds.filter((propertyId) => !fetchedRef.current.has(propertyId))
    if (idsToFetch.length === 0) return

    idsToFetch.forEach((propertyId) => fetchedRef.current.add(propertyId))

    let cancelled = false
    const queue = [...idsToFetch]
    const concurrency = Math.min(4, queue.length)

    const worker = async () => {
      while (!cancelled && queue.length > 0) {
        const propertyId = queue.shift()
        if (!propertyId) break

        try {
          const ratingSummary = await fetchPropertyRatingsFromDatabase(propertyId)
          if (cancelled) return

          setRatingsById((prev) => ({
            ...prev,
            [propertyId]: ratingSummary,
          }))
        } catch {
          // Remove from cache to allow retry in subsequent renders.
          fetchedRef.current.delete(propertyId)
        }
      }
    }

    void Promise.all(Array.from({ length: concurrency }, worker))

    return () => {
      cancelled = true
    }
  }, [propertyIds])

  return ratingsById
}
