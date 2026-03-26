import { bookings } from '@/data/mockData'
import { CheckCircle, Clock, XCircle, CircleDot } from 'lucide-react'

const statusConfig = {
  confirmed: { icon: CheckCircle, color: 'text-green-600 bg-green-100' },
  pending: { icon: Clock, color: 'text-gold bg-gold/20' },
  cancelled: { icon: XCircle, color: 'text-destructive bg-destructive/10' },
  completed: { icon: CircleDot, color: 'text-muted-foreground bg-muted' },
}

export default function MyBookings() {
  // Mock: user's bookings
  const myBookings = bookings.filter((b) => b.guestEmail === 'john@email.com')

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
                    <p className="text-sm text-muted-foreground mt-1">{b.checkIn} → {b.checkOut} · {b.guests} guests</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">${b.total}</p>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mt-1 ${cfg.color}`}>
                      <Icon className="w-3.5 h-3.5" />{b.status}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
