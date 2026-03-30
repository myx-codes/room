import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { CheckCircle, Clock, XCircle, CircleDot, MapPin } from 'lucide-react'
import { GET_MY_BOOKINGS, GET_PROPERTIES } from '@/graphql/user/query'

type BookingStatus = 'CONFIRMED' | 'WAITING' | 'CANCELLED' | 'FINISHED'

type ApiBooking = {
  _id: string
  bookingStatus: BookingStatus
  bookingStart?: string | null
  bookingEnd?: string | null
  bookingCheckIn?: string | null
  bookingCheckOut?: string | null
  bookingGuests: number
  totalPrice?: number | null
  bookingPrice?: number | null
  propertyId: string
  createdAt: string
  propertyData?: {
    _id: string
    propertyType?: string | null
    propertyTitle: string
    propertyLocation?: string | null
    propertyAddress?: string | null
  } | null
}

type GetMyBookingsResponse = {
  getMyBookings: {
    list: ApiBooking[]
  }
}

type GetMyBookingsVariables = {
  input: {
    page: number
    limit: number
    bookingStatus?: BookingStatus
  }
}

type ApiProperty = {
  _id: string
  propertyType?: string | null
  propertyTitle?: string | null
  propertyLocation?: string | null
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

const statusConfig = {
  CONFIRMED: { icon: CheckCircle, color: 'text-green-600 bg-green-100', label: 'confirmed' },
  WAITING: { icon: Clock, color: 'text-gold bg-gold/20', label: 'waiting' },
  CANCELLED: { icon: XCircle, color: 'text-destructive bg-destructive/10', label: 'cancelled' },
  FINISHED: { icon: CircleDot, color: 'text-muted-foreground bg-muted', label: 'finished' },
}

function formatDate(value?: string | null): string {
  if (!value) return '-'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString()
}

function formatLocation(value?: string | null): string {
  if (!value) return ''
  return value
    .toLowerCase()
    .split('_')
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(' ')
}

function formatPropertyType(value?: string | null): string {
  const normalized = (value || '').toUpperCase()
  if (normalized === 'HOTEL') return 'Hotel'
  if (normalized === 'SANATORIUM') return 'Sanatorium'
  if (normalized === 'VILLA') return 'Villa'
  if (normalized === 'APARTMENT') return 'Apartment'
  if (normalized === 'RESORT') return 'Resort'
  return 'Property'
}

export default function MyBookings() {
  const [triedPageZero, setTriedPageZero] = useState(false)

  const { data, loading, error, refetch } = useQuery<GetMyBookingsResponse, GetMyBookingsVariables>(GET_MY_BOOKINGS, {
    variables: {
      input: {
        page: 1,
        limit: 10,
      },
    },
    fetchPolicy: 'network-only',
  })

  const { data: propertiesData } = useQuery<GetPropertiesResponse, GetPropertiesVariables>(GET_PROPERTIES, {
    variables: {
      input: {
        page: 1,
        limit: 200,
        sort: 'createdAt',
        direction: 'DESC',
        search: {},
      },
    },
    fetchPolicy: 'cache-first',
  })

  useEffect(() => {
    const isEmpty = !loading && !error && (data?.getMyBookings?.list || []).length === 0
    if (isEmpty && !triedPageZero) {
      setTriedPageZero(true)
      void refetch({ input: { page: 1, limit: 10 } })
    }
  }, [data, error, loading, refetch, triedPageZero])

  const myBookings = useMemo(
    () => {
      const propertyById = new Map((propertiesData?.getProperties?.list || []).map((item) => [item._id, item]))

      return (data?.getMyBookings?.list || []).map((booking) => {
        const propertyFromList = propertyById.get(booking.propertyId)
        const propertyType = booking.propertyData?.propertyType || propertyFromList?.propertyType
        const propertyTitle = booking.propertyData?.propertyTitle || propertyFromList?.propertyTitle
        const propertyLocation = booking.propertyData?.propertyLocation || propertyFromList?.propertyLocation

        return {
          id: booking._id,
          propertyTypeLabel: formatPropertyType(propertyType),
          propertyTitle: propertyTitle || formatPropertyType(propertyType),
          propertyLocation: formatLocation(propertyLocation),
          checkIn: booking.bookingCheckIn || booking.bookingStart || '-',
          checkOut: booking.bookingCheckOut || booking.bookingEnd || '-',
          bookedAt: booking.createdAt,
          guests: booking.bookingGuests,
          total: booking.totalPrice ?? booking.bookingPrice ?? 0,
          status: booking.bookingStatus,
        }
      })
    },
    [data, propertiesData],
  )

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-foreground">My Bookings</h2>
        <p className="text-sm text-muted-foreground mt-1">{myBookings.length} bookings</p>
      </div>

      {myBookings.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-2xl">
          <p className="text-muted-foreground">No bookings yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myBookings.map((b) => {
            const cfg = statusConfig[b.status]
            const Icon = cfg.icon
            return (
              <div key={b.id} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <h4 className="font-display text-lg font-semibold text-foreground">{b.propertyTitle}</h4>
                    <p className="text-xs text-muted-foreground mt-1">Type: {b.propertyTypeLabel}</p>
                    {b.propertyLocation && (
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {b.propertyLocation}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">Stay: {formatDate(b.checkIn)} → {formatDate(b.checkOut)} · {b.guests} guests</p>
                    <p className="text-xs text-muted-foreground mt-1">Booked on: {formatDate(b.bookedAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">${b.total}</p>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mt-1 ${cfg.color}`}>
                      <Icon className="w-3.5 h-3.5" />{cfg.label}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {loading && <p className="text-sm text-muted-foreground mt-4">Loading bookings...</p>}
      {error && <p className="text-sm text-destructive mt-4">Failed to load bookings: {error.message}</p>}
    </div>
  )
}
