import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@apollo/client/react'
import Swal from 'sweetalert2'
import { CheckCircle, Clock, XCircle, CircleDot, MapPin } from 'lucide-react'
import { GET_MY_BOOKINGS, GET_PROPERTIES } from '@/graphql/user/query'
import { getMemberProfile } from '@/lib/auth'

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

const CANCELLED_BOOKINGS_NAMESPACE = 'roomi_cancelled_bookings'
const DELETED_BOOKINGS_NAMESPACE = 'roomi_deleted_bookings'

function getCancelledBookingsStorageKey(): string {
  const memberId = getMemberProfile()?._id?.trim() || 'guest'
  return `${CANCELLED_BOOKINGS_NAMESPACE}_${memberId}`
}

function getDeletedBookingsStorageKey(): string {
  const memberId = getMemberProfile()?._id?.trim() || 'guest'
  return `${DELETED_BOOKINGS_NAMESPACE}_${memberId}`
}

function readLocallyCancelledBookingIds(): string[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = localStorage.getItem(getCancelledBookingsStorageKey())
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      : []
  } catch {
    return []
  }
}

function writeLocallyCancelledBookingIds(ids: string[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(getCancelledBookingsStorageKey(), JSON.stringify(Array.from(new Set(ids))))
}

function readLocallyDeletedBookingIds(): string[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = localStorage.getItem(getDeletedBookingsStorageKey())
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      : []
  } catch {
    return []
  }
}

function writeLocallyDeletedBookingIds(ids: string[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(getDeletedBookingsStorageKey(), JSON.stringify(Array.from(new Set(ids))))
}

function canCancelByDate(checkInRaw?: string | null): boolean {
  if (!checkInRaw) return false

  const checkInDate = new Date(checkInRaw)
  if (Number.isNaN(checkInDate.getTime())) return false

  const endOfCheckInDay = new Date(checkInDate)
  endOfCheckInDay.setHours(23, 59, 59, 999)

  return Date.now() <= endOfCheckInDay.getTime()
}

function hasCheckInPassed(checkInRaw?: string | null): boolean {
  if (!checkInRaw) return false

  const checkInDate = new Date(checkInRaw)
  if (Number.isNaN(checkInDate.getTime())) return false

  const endOfCheckInDay = new Date(checkInDate)
  endOfCheckInDay.setHours(23, 59, 59, 999)

  return Date.now() > endOfCheckInDay.getTime()
}

function canCancelBooking(status: BookingStatus, checkInRaw?: string | null): boolean {
  if (status !== 'CONFIRMED' && status !== 'WAITING') return false
  return canCancelByDate(checkInRaw)
}

function canDeleteBooking(status: BookingStatus, checkInRaw?: string | null): boolean {
  return status === 'CANCELLED' || hasCheckInPassed(checkInRaw)
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
  const [locallyCancelledBookingIds, setLocallyCancelledBookingIds] = useState<string[]>(
    readLocallyCancelledBookingIds,
  )
  const [locallyDeletedBookingIds, setLocallyDeletedBookingIds] = useState<string[]>(
    readLocallyDeletedBookingIds,
  )

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

  useEffect(() => {
    writeLocallyCancelledBookingIds(locallyCancelledBookingIds)
  }, [locallyCancelledBookingIds])

  useEffect(() => {
    writeLocallyDeletedBookingIds(locallyDeletedBookingIds)
  }, [locallyDeletedBookingIds])

  const cancelBooking = (bookingId: string, bookingStatus: BookingStatus, checkInRaw?: string | null) => {
    if (!canCancelBooking(bookingStatus, checkInRaw)) {
      const message = 'Booking can only be cancelled until the end of check-in day.'
      void Swal.fire({
        icon: 'error',
        title: 'Cannot cancel booking',
        text: message,
        confirmButtonText: 'OK',
      })
      return
    }

    setLocallyCancelledBookingIds((prev) => (prev.includes(bookingId) ? prev : [...prev, bookingId]))
    void Swal.fire({
      icon: 'success',
      title: 'Cancelled successfully',
      text: 'Your booking has been cancelled.',
      confirmButtonText: 'OK',
    })
  }

  const deleteBooking = async (bookingId: string, bookingStatus: BookingStatus, checkInRaw?: string | null) => {
    if (!canDeleteBooking(bookingStatus, checkInRaw)) {
      const message = 'Only cancelled bookings or bookings with passed check-in date can be deleted.'
      await Swal.fire({
        icon: 'error',
        title: 'Cannot delete booking',
        text: message,
        confirmButtonText: 'OK',
      })
      return
    }

    const confirmation = await Swal.fire({
      icon: 'warning',
      title: 'Delete booking?',
      text: 'This booking will be removed from your list.',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Keep',
      confirmButtonColor: '#dc2626',
    })

    if (!confirmation.isConfirmed) return

    setLocallyDeletedBookingIds((prev) => (prev.includes(bookingId) ? prev : [...prev, bookingId]))
    setLocallyCancelledBookingIds((prev) => prev.filter((id) => id !== bookingId))

    await Swal.fire({
      icon: 'success',
      title: 'Deleted successfully',
      text: 'Booking removed from your list.',
      confirmButtonText: 'OK',
    })
  }

  const myBookings = useMemo(
    () => {
      const propertyById = new Map((propertiesData?.getProperties?.list || []).map((item) => [item._id, item]))

      return (data?.getMyBookings?.list || [])
        .filter((booking) => !locallyDeletedBookingIds.includes(booking._id))
        .map((booking) => {
        const propertyFromList = propertyById.get(booking.propertyId)
        const propertyType = booking.propertyData?.propertyType || propertyFromList?.propertyType
        const propertyTitle = booking.propertyData?.propertyTitle || propertyFromList?.propertyTitle
        const propertyLocation = booking.propertyData?.propertyLocation || propertyFromList?.propertyLocation

        const checkInRaw = booking.bookingCheckIn || booking.bookingStart || null
        const checkOutRaw = booking.bookingCheckOut || booking.bookingEnd || null
        const isLocallyCancelled = locallyCancelledBookingIds.includes(booking._id)

        return {
          id: booking._id,
          propertyTypeLabel: formatPropertyType(propertyType),
          propertyTitle: propertyTitle || formatPropertyType(propertyType),
          propertyLocation: formatLocation(propertyLocation),
          checkInRaw,
          checkOutRaw,
          bookedAt: booking.createdAt,
          guests: booking.bookingGuests,
          total: booking.totalPrice ?? booking.bookingPrice ?? 0,
          status: isLocallyCancelled ? 'CANCELLED' as BookingStatus : booking.bookingStatus,
        }
      })
    },
    [data, locallyCancelledBookingIds, locallyDeletedBookingIds, propertiesData],
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
            const isCancelled = b.status === 'CANCELLED'
            const canCancel = canCancelBooking(b.status, b.checkInRaw)
            const canDelete = canDeleteBooking(b.status, b.checkInRaw)

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
                    <p className="text-sm text-muted-foreground mt-1">Stay: {formatDate(b.checkInRaw)} → {formatDate(b.checkOutRaw)} · {b.guests} guests</p>
                    <p className="text-xs text-muted-foreground mt-1">Booked on: {formatDate(b.bookedAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">${b.total}</p>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mt-1 ${cfg.color}`}>
                      <Icon className="w-3.5 h-3.5" />{cfg.label}
                    </span>
                    <div className="mt-2 flex flex-col items-end gap-2">
                      {!isCancelled && (
                        <button
                          type="button"
                          onClick={() => cancelBooking(b.id, b.status, b.checkInRaw)}
                          className={`inline-flex items-center justify-center rounded-lg border px-3 py-1.5 text-xs font-semibold gentle-animation ${
                            canCancel
                              ? 'border-destructive/40 text-destructive hover:bg-destructive/10'
                              : 'border-border bg-muted/40 text-muted-foreground'
                          }`}
                        >
                          Cancel booking
                        </button>
                      )}
                      {canDelete && (
                        <button
                          type="button"
                          onClick={() => void deleteBooking(b.id, b.status, b.checkInRaw)}
                          className="inline-flex items-center justify-center rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground gentle-animation hover:bg-muted hover:text-destructive"
                        >
                          Delete booking
                        </button>
                      )}
                    </div>
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
