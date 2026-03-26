import { DollarSign, Users, Home, TrendingUp } from 'lucide-react'
import { bookings, properties, users } from '@/data/mockData'

const stats = [
  { label: 'Total Revenue', value: `$${bookings.reduce((s, b) => s + b.total, 0).toLocaleString()}`, icon: DollarSign, change: '+12%' },
  { label: 'Total Properties', value: properties.length, icon: Home, change: '+3' },
  { label: 'Total Users', value: users.length, icon: Users, change: '+8' },
  { label: 'Bookings', value: bookings.length, icon: TrendingUp, change: '+5' },
]

const monthlyRevenue = [
  { month: 'Jan', revenue: 4200 }, { month: 'Feb', revenue: 5100 },
  { month: 'Mar', revenue: 6300 }, { month: 'Apr', revenue: 7800 },
]

export default function AdminAnalytics() {
  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.revenue))

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-foreground">Analytics</h2>
        <p className="text-sm text-muted-foreground mt-1">Platform overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <s.icon className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs font-medium text-green-600">{s.change}</span>
            </div>
            <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Simple Bar Chart */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-display text-lg font-semibold text-foreground mb-6">Monthly Revenue</h3>
        <div className="flex items-end gap-4 h-48">
          {monthlyRevenue.map((m) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-medium text-foreground">${(m.revenue / 1000).toFixed(1)}k</span>
              <div
                className="w-full bg-gold/80 rounded-t-lg gentle-animation hover:bg-gold"
                style={{ height: `${(m.revenue / maxRevenue) * 100}%` }}
              />
              <span className="text-xs text-muted-foreground">{m.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
