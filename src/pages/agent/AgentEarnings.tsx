import { DollarSign, TrendingUp, CalendarCheck } from 'lucide-react'
import { bookings } from '@/data/mockData'
import { useI18n } from '@/i18n'

export default function AgentEarnings() {
  const { t, formatNumber } = useI18n()
  const myBookings = bookings.filter((b) => ['1', '2', '5'].includes(b.propertyId))
  const totalEarnings = myBookings.filter(b => b.status !== 'cancelled').reduce((s, b) => s + b.total, 0)
  const confirmedCount = myBookings.filter(b => b.status === 'confirmed').length
  const completedCount = myBookings.filter(b => b.status === 'completed').length

  const stats = [
    { label: t('agent.totalEarnings'), value: `$${formatNumber(totalEarnings)}`, icon: DollarSign },
    { label: t('agent.confirmed'), value: confirmedCount, icon: TrendingUp },
    { label: t('agent.completed'), value: completedCount, icon: CalendarCheck },
  ]

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-foreground">{t('common.earnings')}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t('agent.revenueOverview')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-6">
            <s.icon className="w-5 h-5 text-gold mb-3" />
            <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">{t('agent.recentTransactions')}</h3>
        <div className="space-y-3">
          {myBookings.filter(b => b.status !== 'cancelled').map((b) => (
            <div key={b.id} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{b.propertyTitle}</p>
                <p className="text-xs text-muted-foreground">{b.guestName} · {b.checkIn}</p>
              </div>
              <span className="font-semibold text-foreground">+${formatNumber(b.total)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
