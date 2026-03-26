import { bookings } from '@/data/mockData'
import { CheckCircle, Clock, XCircle, CircleDot } from 'lucide-react'

const statusConfig = {
  confirmed: { icon: CheckCircle, color: 'text-green-600 bg-green-100' },
  pending: { icon: Clock, color: 'text-gold bg-gold/20' },
  cancelled: { icon: XCircle, color: 'text-destructive bg-destructive/10' },
  completed: { icon: CircleDot, color: 'text-muted-foreground bg-muted' },
}

export default function AgentBookings() {
  // Mock: show bookings for agent a1's properties (ids 1, 2, 5)
  const myBookings = bookings.filter((b) => ['1', '2', '5'].includes(b.propertyId))

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-foreground">My Bookings</h2>
        <p className="text-sm text-muted-foreground mt-1">{myBookings.length} bookings for your properties</p>
      </div>

      <div className="space-y-4">
        {myBookings.map((b) => {
          const cfg = statusConfig[b.status]
          const Icon = cfg.icon
          return (
            <div key={b.id} className="bg-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <h4 className="font-medium text-foreground">{b.propertyTitle}</h4>
                <p className="text-sm text-muted-foreground">{b.guestName} · {b.guestEmail}</p>
              </div>
              <div className="text-sm text-muted-foreground">{b.checkIn} → {b.checkOut}</div>
              <div className="text-sm font-semibold text-foreground">${b.total}</div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                <Icon className="w-3.5 h-3.5" />{b.status}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
