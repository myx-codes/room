import { useMemo } from 'react'
import { useQuery } from '@apollo/client/react'
import { CheckCircle, Clock, XCircle, CircleDot } from 'lucide-react'
import { GET_BOOKINGS_FOR_MY_PROPERTIES } from '@/graphql/user/query'
import { useI18n } from '@/i18n'

type BookingStatus = 'CONFIRMED' | 'WAITING' | 'CANCELLED' | 'FINISHED'

type ApiBooking = {
  _id: string
  bookingStatus: BookingStatus
  bookingCheckIn?: string | null
  bookingCheckOut?: string | null
  bookingGuests: number
  totalPrice?: number | null
  propertyData?: {
    _id: string
    propertyTitle?: string | null
  } | null
  memberData?: {
    _id: string
    memberNick?: string | null
  } | null
}

type TotalCounter = {
  total?: number | null
}

type GetBookingsForMyPropertiesResponse = {
  getBookingsForMyProperties: {
    list: ApiBooking[]
    metaCounter?: TotalCounter[] | TotalCounter | null
  }
}

type GetBookingsForMyPropertiesVariables = {
  input: {
    page: number
    limit: number
  }
}

type StatusView = {
  icon: typeof CheckCircle
  color: string
}

const statusConfig: Record<BookingStatus, StatusView> = {
  CONFIRMED: { icon: CheckCircle, color: 'text-green-600 bg-green-100' },
  WAITING: { icon: Clock, color: 'text-gold bg-gold/20' },
  CANCELLED: { icon: XCircle, color: 'text-destructive bg-destructive/10' },
  FINISHED: { icon: CircleDot, color: 'text-muted-foreground bg-muted' },
}

function resolveTotal(metaCounter?: TotalCounter[] | TotalCounter | null): number | null {
  if (!metaCounter) return null
  if (Array.isArray(metaCounter)) {
    return typeof metaCounter[0]?.total === 'number' ? metaCounter[0].total : null
  }
  return typeof metaCounter.total === 'number' ? metaCounter.total : null
}

export default function AgentBookings() {
  const { t, formatDate, formatNumber, bookingStatusShortLabel } = useI18n()
  const { data, loading, error } = useQuery<
    GetBookingsForMyPropertiesResponse,
    GetBookingsForMyPropertiesVariables
  >(GET_BOOKINGS_FOR_MY_PROPERTIES, {
    variables: {
      input: {
        page: 1,
        limit: 10,
      },
    },
    fetchPolicy: 'network-only',
  })

  const myBookings = useMemo(() => {
    return (data?.getBookingsForMyProperties?.list || []).map((booking) => ({
      id: booking._id,
      propertyTitle: booking.propertyData?.propertyTitle || t('common.property'),
      memberNick: booking.memberData?.memberNick || t('common.guest'),
      checkIn: formatDate(booking.bookingCheckIn),
      checkOut: formatDate(booking.bookingCheckOut),
      guests: booking.bookingGuests,
      total: booking.totalPrice ?? 0,
      status: booking.bookingStatus,
    }))
  }, [data, formatDate, t])

  const totalCount = resolveTotal(data?.getBookingsForMyProperties?.metaCounter)
  const bookingsCountLabel = typeof totalCount === 'number' ? totalCount : myBookings.length

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-foreground">{t('common.bookings')}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t('agent.bookingsCount', { count: bookingsCountLabel })}</p>
      </div>

      {loading && myBookings.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('common.loadingBookings')}</p>
      ) : error ? (
        <p className="text-sm text-destructive">{t('common.failedToLoadBookings', { message: error.message })}</p>
      ) : myBookings.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-2xl">
          <p className="text-muted-foreground">{t('agent.noBookings')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myBookings.map((b) => {
            const cfg = statusConfig[b.status] || statusConfig.CONFIRMED
            const Icon = cfg.icon

            return (
              <div key={b.id} className="bg-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{b.propertyTitle}</h4>
                  <p className="text-sm text-muted-foreground">
                    {b.memberNick} · {b.guests} {b.guests > 1 ? t('common.guests') : t('common.guest')}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">{b.checkIn} → {b.checkOut}</div>
                <div className="text-sm font-semibold text-foreground">${formatNumber(b.total)}</div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                  <Icon className="w-3.5 h-3.5" />{bookingStatusShortLabel(b.status)}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
