import { useEffect, useMemo, useState, type ElementType, type FormEvent } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useMutation, useQuery } from '@apollo/client/react'
import {
  Star,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
  Wifi,
  Waves,
  Sparkles,
  Car,
  UtensilsCrossed,
  Dumbbell,
  Wind,
  Trees,
  MessageSquare,
  Send,
  CreditCard,
} from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RatingInput } from '@/components/RatingInput'
import { RatingPreview } from '@/components/RatingPreview'
import { CREATE_BOOKINGS, CREATE_COMMENT } from '@/graphql/user/mutation'
import { GET_COMMENTS, GET_PROPERTIES } from '@/graphql/user/query'
import { usePropertyRatings } from '@/hooks/usePropertyRatings'
import { isAuthenticated } from '@/lib/auth'
import { CommentGroup } from '@/lib/client/enums/comment.enum'

type CommentItem = {
  id: string
  name: string
  message: string
  rating: number
  createdAt: string
}

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:3008/graphql'

type PropertyCategory = 'villa' | 'hotel' | 'sanatorium'

type ApiProperty = {
  _id: string
  propertyType: string
  propertyLocation: string
  propertyTitle: string
  propertyPrice: number
  propertyRank?: number
  propertyRatingCount?: number
  propertyComments: number
  propertyImages: string[]
  propertyDesc?: string | null
}

type DisplayProperty = {
  id: string
  title: string
  location: string
  price: number
  rating: number
  ratingCount: number
  images: string[]
  category: PropertyCategory
  amenities: string[]
  description: string
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

type CreateBookingResponse = {
  createBooking: {
    _id: string
  }
}

type CreateBookingVariables = {
  input: {
    propertyId: string
    bookingStart: string
    bookingEnd: string
    bookingGuests: number
    totalPrice: number
  }
}

type CreateCommentResponse = {
  createComment: {
    _id: string
    commentStatus: string
    commentGroup: CommentGroup
    commentContent: string
    commentStars?: number | null
    commentRefId: string
    memberId: string
    createdAt: string
    updatedAt: string
    memberData?: {
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
      memberLikes: number
      memberViews: number
      memberComments: number
      memberRank?: number
      memberWarnings: number
      memberBlocks: number
      deletedAt: string | null
      createdAt: string
      updatedAt: string
      accessToken?: string
    } | null
  }
}

type CreateCommentVariables = {
  input: {
    commentContent: string
    commentRefId: string
    commentGroup: CommentGroup
    commentStars?: number
  }
}

type BackendComment = {
  _id: string
  commentStatus: string
  commentGroup: CommentGroup
  commentContent: string
  commentStars?: number | null
  commentRefId: string
  createdAt: string
  updatedAt: string
  memberData?: {
    _id: string
    memberNick: string
    memberFullName: string | null
    memberImage?: string
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

type SavedCard = {
  id: string
  brand: string
  last4: string
  expiry: string
}

const amenityIcons: Record<string, ElementType> = {
  wifi: Wifi,
  pool: Waves,
  spa: Sparkles,
  parking: Car,
  restaurant: UtensilsCrossed,
  gym: Dumbbell,
  ac: Wind,
  garden: Trees,
}

const CARD_STORAGE_KEY = 'roomi_saved_cards'

const amenityLabels: Record<string, string> = {
  wifi: 'Wi-Fi',
  pool: 'Pool',
  spa: 'Spa',
  parking: 'Parking',
  restaurant: 'Restaurant',
  gym: 'Gym',
  ac: 'Air Conditioning',
  garden: 'Garden',
}

const readSavedCards = (): SavedCard[] => {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(CARD_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

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

function mapPropertyType(type: string): PropertyCategory {
  const normalized = type.toUpperCase()
  if (normalized === 'HOTEL') return 'hotel'
  if (normalized === 'SANATORIUM') return 'sanatorium'
  return 'villa'
}

function formatLocation(value: string): string {
  return value
    .toLowerCase()
    .split('_')
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(' ')
}

function formatDate(value: string): string {
  if (!value) return 'Not selected'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Invalid date'
  return date.toLocaleDateString()
}

function normalizeStars(stars?: number | null): number {
  if (typeof stars !== 'number' || !Number.isFinite(stars)) return 0
  return Math.min(5, Math.max(1, Math.round(stars)))
}

function cleanCommentMessage(content: string): string {
  if (!content) return ''
  return content.replace(/^(?:ROOMi_RATING|rating):\d{1,2}\s*\r?\n/, '').trim()
}

function parseDescriptionAndAmenities(description?: string | null): { description: string; amenities: string[] } {
  if (!description) return { description: '', amenities: [] }

  const descriptionWithoutMeta = description.replace(/(?:\n|^)ROOMI_SANATORIUM_META:[^\n]+/g, '').trim()
  const match = descriptionWithoutMeta.match(/(?:^|\n)Amenities:\s*([^\n]+)/i)
  if (!match) return { description: descriptionWithoutMeta.trim(), amenities: [] }

  const cleanDescription = descriptionWithoutMeta.replace(/(?:\n|^)Amenities:\s*[^\n]+/i, '').trim()
  const amenities = match[1]
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((label) => {
      const found = Object.entries(amenityLabels).find(([, value]) => value.toLowerCase() === label.toLowerCase())
      return found?.[0] || label.toLowerCase().replace(/\s+/g, '-')
    })

  return { description: cleanDescription, amenities }
}

function mapApiProperty(item: ApiProperty): DisplayProperty {
  const parsed = parseDescriptionAndAmenities(item.propertyDesc)

  return {
    id: item._id,
    title: item.propertyTitle,
    location: formatLocation(item.propertyLocation),
    price: item.propertyPrice,
    rating: item.propertyRank || 0,
    ratingCount: item.propertyRatingCount ?? item.propertyComments ?? 0,
    images: (item.propertyImages || []).map((image) => resolveImageUrl(image)),
    category: mapPropertyType(item.propertyType),
    amenities: parsed.amenities,
    description: parsed.description,
  }
}

export default function PropertyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data, loading, error, refetch: refetchProperties } = useQuery<GetPropertiesResponse, GetPropertiesVariables>(GET_PROPERTIES, {
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

  const property = useMemo(
    () => (data?.getProperties?.list || []).map(mapApiProperty).find((p) => p.id === id),
    [data, id],
  )
  const propertyIds = useMemo(() => (property ? [property.id] : []), [property])
  const ratingsById = usePropertyRatings(propertyIds)
  const computedPropertyRating = property ? ratingsById[property.id] : undefined
  const displayedRating = computedPropertyRating?.rating ?? property?.rating ?? 0
  const displayedReviews = computedPropertyRating?.ratingCount ?? property?.ratingCount ?? 0

  const {
    data: commentsData,
    loading: commentsLoading,
    error: commentsError,
    refetch: refetchComments,
  } = useQuery<GetCommentsResponse, GetCommentsVariables>(GET_COMMENTS, {
    variables: {
      input: {
        page: 1,
        limit: 50,
        sort: 'commentStars',
        direction: 'DESC',
        search: {
          commentRefId: id || '',
        },
      },
    },
    skip: !id,
    fetchPolicy: 'network-only',
  })
  const [currentImage, setCurrentImage] = useState(0)
  const [showGallery, setShowGallery] = useState(false)
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(5)
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')
  const [guestCount, setGuestCount] = useState(1)
  const [bookingError, setBookingError] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState('')
  const [showBookingReview, setShowBookingReview] = useState(false)
  const [savedCards, setSavedCards] = useState<SavedCard[]>([])
  const [selectedCardId, setSelectedCardId] = useState('')
  const [commentError, setCommentError] = useState('')

  const [createBooking, { loading: bookingLoading }] = useMutation<CreateBookingResponse, CreateBookingVariables>(CREATE_BOOKINGS)
  const [createComment, { loading: commentLoading }] = useMutation<CreateCommentResponse, CreateCommentVariables>(CREATE_COMMENT)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowGallery(false)
        setShowBookingReview(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const propertyComments = useMemo(() => {
    const list = commentsData?.getComments?.list ?? []
    return list
      .filter((c) => c.commentGroup === CommentGroup.PROPERTY && c.commentRefId === id)
      .map((c) => ({
        id: c._id,
        name: c.memberData?.memberFullName || c.memberData?.memberNick || 'Guest',
        message: cleanCommentMessage(c.commentContent),
        rating: normalizeStars(c.commentStars),
        createdAt: c.createdAt,
      }))
  }, [commentsData, id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading property...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-destructive">Failed to load property: {error.message}</p>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Property not found.</p>
      </div>
    )
  }

  const images = property.images.length > 0 ? property.images : ['/assets/hero-villa.jpg']

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length)
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length)

  const submitComment = async (e: FormEvent) => {
    e.preventDefault()

    setCommentError('')

    const cleanMessage = message.trim()
    if (!cleanMessage) return

    if (!isAuthenticated()) {
      setCommentError('Please sign in to post a comment.')
      return
    }

    const commentGroup = CommentGroup.PROPERTY
    if (commentGroup === CommentGroup.PROPERTY && (rating < 1 || rating > 5)) {
      setCommentError('Property comment uchun baho 1 dan 5 gacha bo\'lishi shart.')
      return
    }

    try {
      const input: CreateCommentVariables['input'] = {
        commentContent: cleanMessage,
        commentRefId: property.id,
        commentGroup,
      }

      if (commentGroup === CommentGroup.PROPERTY) {
        input.commentStars = rating
      }

      const { data: commentData } = await createComment({
        variables: {
          input,
        },
      })

      const created = commentData?.createComment
      if (!created?._id) throw new Error('Comment was not created. Please try again.')

      setMessage('')
      setRating(5)

      await Promise.all([refetchComments(), refetchProperties()])
    } catch (error) {
      const messageText = error instanceof Error ? error.message : 'Failed to post comment.'
      setCommentError(messageText)
    }
  }

  const getBookingSummary = () => {
    if (!checkInDate || !checkOutDate) return null
    const start = new Date(checkInDate)
    const end = new Date(checkOutDate)
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) return null

    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    const totalPrice = Math.max(1, Math.round(nights * property.price))
    return { nights, totalPrice }
  }

  const handleReviewBooking = () => {
    setBookingError('')
    setBookingSuccess('')

    const cards = readSavedCards()
    setSavedCards(cards)

    if (cards.length === 1) {
      setSelectedCardId(cards[0].id)
    } else if (!cards.some((card) => card.id === selectedCardId)) {
      setSelectedCardId('')
    }

    // Always open review first, then show validation feedback inside the modal.
    setShowBookingReview(true)

    if (!isAuthenticated()) {
      setBookingError('Please sign in to create a booking.')
      return
    }

    if (!checkInDate || !checkOutDate) {
      setBookingError('Please select check-in and check-out dates.')
      return
    }

    if (!getBookingSummary()) {
      setBookingError('Check-out date must be after check-in date.')
      return
    }
  }

  const handleCreateBooking = async () => {
    setBookingError('')
    setBookingSuccess('')

    if (!isAuthenticated()) {
      setBookingError('Please sign in to create a booking.')
      return
    }

    const summary = getBookingSummary()
    if (!summary) {
      setBookingError('Check-out date must be after check-in date.')
      return
    }

    if (savedCards.length === 0) {
      setBookingError('No saved card found. Please add a card in My Payments first.')
      return
    }

    if (!selectedCardId) {
      setBookingError('Please select a card to continue.')
      return
    }

    try {
      const { data: bookingData } = await createBooking({
        variables: {
          input: {
            propertyId: property.id,
            bookingStart: checkInDate,
            bookingEnd: checkOutDate,
            bookingGuests: guestCount,
            totalPrice: summary.totalPrice,
          },
        },
      })

      if (!bookingData?.createBooking?._id) {
        setBookingError('Booking was not created. Please try again.')
        return
      }

      setBookingSuccess('Booking created successfully! You can view it in My Bookings.')
      setShowBookingReview(false)
    } catch (error) {
      const messageText = error instanceof Error ? error.message : 'Failed to create booking.'
      setBookingError(messageText)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar forceSolid />

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-16">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-muted-foreground hover:text-primary gentle-animation mb-6 inline-flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" /> Back to results
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
          <div
            className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group"
            onClick={() => {
              setCurrentImage(0)
              setShowGallery(true)
            }}
          >
            <img
              src={images[0]}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {images.slice(1, 5).map((img, i) => (
              <div
                key={`${img}-${i}`}
                className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => {
                  setCurrentImage(i + 1)
                  setShowGallery(true)
                }}
              >
                <img
                  src={img}
                  alt={`${property.title} ${i + 2}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-secondary text-secondary-foreground capitalize">
                {property.category}
              </span>
              <RatingPreview value={displayedRating} count={displayedReviews} />
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              {property.title}
            </h1>
            <div className="flex items-center gap-1 text-muted-foreground mb-8">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{property.location}</span>
            </div>

            <div className="mb-10">
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">Description</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{property.description || 'No description yet.'}</p>
            </div>

            <div className="mb-10">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {(property.amenities.length > 0 ? property.amenities : ['wifi']).map((amenity) => {
                  const Icon = amenityIcons[amenity] || Wifi
                  return (
                    <div key={amenity} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
                      <Icon className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-sm text-foreground">{amenityLabels[amenity] || amenity}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mb-10">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">Location</h2>
              <div className="rounded-2xl overflow-hidden border border-border bg-card">
                <iframe
                  title={`${property.title} location map`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(property.location)}&output=embed`}
                  className="w-full h-[320px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-gold" />
                  <h2 className="font-display text-xl font-semibold text-foreground">Comments</h2>
              </div>

              <form onSubmit={submitComment} className="bg-card border border-border rounded-2xl p-5 mb-6 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                      Rating
                    </label>
                    <RatingInput value={rating} onChange={setRating} />
                    <RatingPreview value={rating} className="mt-2" />
                  </div>

                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your experience"
                  required
                />

                <Button type="submit" className="w-full sm:w-auto" disabled={commentLoading}>
                  <Send className="w-4 h-4" />
                  {commentLoading ? 'Posting...' : 'Post Comment'}
                </Button>
              </form>

              {commentError && (
                <div className="mb-4 bg-card border border-border rounded-2xl p-4 text-sm text-destructive">
                  {commentError}
                </div>
              )}

              <div className="space-y-4">
                {commentsLoading && (
                  <div className="bg-card border border-border rounded-2xl p-5 text-sm text-muted-foreground">
                    Loading comments...
                  </div>
                )}

                {commentsError && (
                  <div className="bg-card border border-border rounded-2xl p-5 text-sm text-destructive">
                    Failed to load comments: {commentsError.message}
                  </div>
                )}

                {!commentsLoading && !commentsError && propertyComments.length === 0 && (
                  <div className="bg-card border border-border rounded-2xl p-5 text-sm text-muted-foreground">
                    No comments yet. Be the first to write one.
                  </div>
                )}

                {propertyComments.map((item) => (
                  <article key={item.id} className="bg-card border border-border rounded-2xl p-5">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < item.rating ? 'text-gold fill-gold' : 'text-muted'}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.message}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-card rounded-2xl p-6 elevated-shadow border border-border">
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-bold text-foreground">${property.price}</span>
                <span className="text-sm text-muted-foreground">/ night</span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block uppercase tracking-wider">
                      Check in
                    </label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="text-sm w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block uppercase tracking-wider">
                      Check out
                    </label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="text-sm w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block uppercase tracking-wider">
                    Guests
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="text-sm w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>{`${n} guest${n > 1 ? 's' : ''}`}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Button type="button" onClick={handleReviewBooking} className="w-full h-12 text-base">
                Review Booking
              </Button>
              {bookingError && <p className="text-sm text-destructive mt-3">{bookingError}</p>}
              {bookingSuccess && <p className="text-sm text-green-600 mt-3">{bookingSuccess}</p>}
              <Link
                to="/properties"
                className="block text-center text-sm text-muted-foreground hover:text-foreground mt-3 gentle-animation"
              >
                Continue browsing
              </Link>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          >
            <button
              onClick={() => setShowGallery(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={prevImage}
              className="absolute left-4 md:left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <img
              src={images[currentImage]}
              alt={`${property.title} ${currentImage + 1}`}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
            />

            <button
              onClick={nextImage}
              className="absolute right-4 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            <div className="absolute bottom-8 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === currentImage ? 'bg-white scale-125' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBookingReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center p-4"
            onClick={() => setShowBookingReview(false)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="w-full max-w-lg bg-card border border-border rounded-2xl p-5"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-xl font-semibold text-foreground">Review Booking</h3>
                <button
                  type="button"
                  onClick={() => setShowBookingReview(false)}
                  className="p-1.5 rounded-lg hover:bg-muted gentle-animation"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              <div className="rounded-xl border border-border bg-muted/30 p-3 text-sm mb-3">
                <p className="font-medium text-foreground">Booking Summary</p>
                <p className="text-muted-foreground mt-1">{property.title}</p>
                <p className="text-muted-foreground">{formatDate(checkInDate)} → {formatDate(checkOutDate)} · {guestCount} guests</p>
                {getBookingSummary() ? (
                  <p className="text-foreground font-medium mt-1">Total: ${getBookingSummary()?.totalPrice}</p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">Select valid dates to calculate total.</p>
                )}
              </div>

              <div className="rounded-xl border border-border bg-muted/30 p-3 text-sm mb-4">
                <p className="font-medium text-foreground mb-2">Select Card</p>
                {savedCards.length === 0 ? (
                  <p className="text-destructive">No saved cards. Go to My Payments and add a card.</p>
                ) : (
                  <div className="space-y-2">
                    {savedCards.map((card) => (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => setSelectedCardId(card.id)}
                        className={`w-full text-left p-2.5 rounded-lg border gentle-animation flex items-center justify-between ${
                          selectedCardId === card.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-background hover:bg-muted'
                        }`}
                      >
                        <span className="flex items-center gap-2 text-foreground">
                          <CreditCard className="w-4 h-4" />
                          {card.brand} •••• {card.last4}
                        </span>
                        <span className="text-xs text-muted-foreground">{card.expiry}</span>
                      </button>
                    ))}
                    {savedCards.length === 1 && (
                      <p className="text-xs text-muted-foreground">Your only saved card is selected automatically.</p>
                    )}
                  </div>
                )}
              </div>

              {bookingError && <p className="text-sm text-destructive mb-3">{bookingError}</p>}

              <div className="grid grid-cols-2 gap-2">
                <Button type="button" variant="outline" onClick={() => setShowBookingReview(false)} className="h-11">
                  Back
                </Button>
                <Button type="button" onClick={handleCreateBooking} disabled={bookingLoading} className="h-11">
                  {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}