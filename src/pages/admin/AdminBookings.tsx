import { bookings } from '@/data/mockData'
import { CheckCircle, Clock, XCircle, CircleDot } from 'lucide-react'

const statusConfig = {
  confirmed: { icon: CheckCircle, color: 'text-green-600 bg-green-100' },
  pending: { icon: Clock, color: 'text-gold bg-gold/20' },
  cancelled: { icon: XCircle, color: 'text-destructive bg-destructive/10' },
  completed: { icon: CircleDot, color: 'text-muted-foreground bg-muted' },
}

export default function AdminBookings() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-foreground">Bookings</h2>
        <p className="text-sm text-muted-foreground mt-1">{bookings.length} total bookings</p>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-6 py-4 font-medium text-muted-foreground">Property</th>
              <th className="px-6 py-4 font-medium text-muted-foreground hidden sm:table-cell">Guest</th>
              <th className="px-6 py-4 font-medium text-muted-foreground hidden md:table-cell">Dates</th>
              <th className="px-6 py-4 font-medium text-muted-foreground hidden lg:table-cell">Total</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => {
              const cfg = statusConfig[b.status]
              const Icon = cfg.icon
              return (
                <tr key={b.id} className="border-b border-border/50 hover:bg-muted/30 gentle-animation">
                  <td className="px-6 py-4 font-medium text-foreground">{b.propertyTitle}</td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <p className="text-foreground">{b.guestName}</p>
                    <p className="text-xs text-muted-foreground">{b.guestEmail}</p>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-muted-foreground">
                    {b.checkIn} → {b.checkOut}
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell font-medium text-foreground">${b.total}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                      {b.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
