import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Home, CalendarCheck, DollarSign } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useQuery } from '@apollo/client/react'
import { useMemo } from 'react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { getMemberProfile } from '@/lib/auth'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { useI18n } from '@/i18n'
import { GET_AGENT_DASHBOARD_OVERVIEW } from '@/graphql/user/query'
import AgentProperties from './AgentProperties'
import AgentBookings from './AgentBookings'
import AgentEarnings from './AgentEarnings'

type AgentDashboardOverview = {
  getAgentDashboardOverview: {
    propertyStats: {
      totalProperties: number
      activeProperties: number
      holdProperties: number
      bookedProperties: number
      dynamicPricingProperties: number
      averagePropertyPrice: number
      totalPropertyViews: number
      totalPropertyLikes: number
    }
    bookingStats: {
      totalBookings: number
      confirmedBookings: number
      waitingBookings: number
      cancelledBookings: number
      finishedBookings: number
      upcomingBookings: number
      totalRevenue: number
      averageBookingValue: number
    }
    recentProperties: Array<{
      _id: string
      propertyTitle: string
      propertyType: string
      propertyStatus: string
      propertyPrice: number
      propertyViews: number
      propertyLikes: number
      dynamicPricingEnabled: boolean
      createdAt: string
    }>
    recentBookings: Array<{
      _id: string
      bookingStatus: string
      bookingStart: string
      bookingEnd: string
      totalPrice: number
      bookingGuests: number
      propertyTitle?: string | null
      memberNick?: string | null
      createdAt: string
    }>
  }
}

export default function AgentDashboard() {
  const { t, memberTypeLabel, memberStatusLabel, formatDate, formatNumber } = useI18n()
  const profile = getMemberProfile()
  const location = useLocation()
  const { data: overviewData } = useQuery<AgentDashboardOverview>(GET_AGENT_DASHBOARD_OVERVIEW, {
    skip: !profile || profile.memberType !== 'AGENT',
    fetchPolicy: 'network-only',
  })

  const overview = overviewData?.getAgentDashboardOverview
  const propertyStats = overview?.propertyStats
  const bookingStats = overview?.bookingStats
  const recentProperties = overview?.recentProperties || []
  const recentBookings = overview?.recentBookings || []

  const navItems = [
    { label: t('agent.myProperties'), path: '/agent/properties', icon: <Home className="w-4 h-4" /> },
    { label: t('common.bookings'), path: '/agent/bookings', icon: <CalendarCheck className="w-4 h-4" /> },
    { label: t('common.earnings'), path: '/agent/earnings', icon: <DollarSign className="w-4 h-4" /> },
  ]

  const pageTitle = useMemo(() => {
    if (location.pathname.startsWith('/agent/bookings')) return t('common.bookings')
    if (location.pathname.startsWith('/agent/earnings')) return t('common.earnings')
    return t('agent.myProperties')
  }, [location.pathname, t])

  const contextBar = profile ? (() => {
    const accountHeader = (
      <div className="rounded-3xl border border-border bg-card/80 px-5 py-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{t('agent.dashboard')}</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-foreground">
              {profile.memberNick || profile.memberFullName || t('agent.dashboard')}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{t('myPage.manageAccountDetails')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-full px-3 py-1 text-sm">
              {memberTypeLabel(profile.memberType)}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {profile.memberStatus ? `${t('common.status')}: ${memberStatusLabel(profile.memberStatus)}` : ''}
            </span>
          </div>
        </div>
      </div>
    )

    if (location.pathname.startsWith('/agent/bookings')) {
      return (
        <div className="space-y-4">
          {accountHeader}
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card/70 p-4">
              <p className="text-xs text-muted-foreground">{t('common.bookings')}</p>
              <p className="mt-2 font-display text-2xl font-bold text-foreground">
                {formatNumber(bookingStats?.totalBookings ?? 0)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatNumber(bookingStats?.confirmedBookings ?? 0)} confirmed · {formatNumber(bookingStats?.upcomingBookings ?? 0)} upcoming
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card/70 p-4">
              <p className="text-xs text-muted-foreground">{t('agent.confirmed')}</p>
              <p className="mt-2 font-display text-2xl font-bold text-foreground">
                {formatNumber(bookingStats?.confirmedBookings ?? 0)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Ready and active reservations</p>
            </div>
            <div className="rounded-2xl border border-border bg-card/70 p-4">
              <p className="text-xs text-muted-foreground">{t('agent.pending')}</p>
              <p className="mt-2 font-display text-2xl font-bold text-foreground">
                {formatNumber(bookingStats?.waitingBookings ?? 0)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Needs action or review</p>
            </div>
            <div className="rounded-2xl border border-border bg-card/70 p-4">
              <p className="text-xs text-muted-foreground">{t('agent.completed')}</p>
              <p className="mt-2 font-display text-2xl font-bold text-foreground">
                {formatNumber(bookingStats?.finishedBookings ?? 0)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Finished stays</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/80 p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-foreground">{t('common.bookings')}</h3>
              <span className="text-xs text-muted-foreground">Recent 6</span>
            </div>
            <div className="space-y-3">
              {recentBookings.length === 0 ? (
                <p className="text-sm text-muted-foreground">No bookings yet.</p>
              ) : (
                recentBookings.map((item) => (
                  <div key={item._id} className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{item.propertyTitle || t('common.property')}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.memberNick || t('common.guest')} · {formatDate(item.bookingStart)} → {formatDate(item.bookingEnd)}
                      </p>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <p>{formatNumber(item.bookingGuests)} guests</p>
                      <p>{item.bookingStatus}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )
    }

    if (location.pathname.startsWith('/agent/earnings')) {
      return (
        <div className="space-y-4">
          {accountHeader}
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card/70 p-4">
              <p className="text-xs text-muted-foreground">{t('common.earnings')}</p>
              <p className="mt-2 font-display text-2xl font-bold text-foreground">
                ${formatNumber(bookingStats?.totalRevenue ?? 0)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">All time revenue</p>
            </div>
            <div className="rounded-2xl border border-border bg-card/70 p-4">
              <p className="text-xs text-muted-foreground">Avg booking</p>
              <p className="mt-2 font-display text-2xl font-bold text-foreground">
                ${formatNumber(bookingStats?.averageBookingValue ?? 0)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Average value per booking</p>
            </div>
            <div className="rounded-2xl border border-border bg-card/70 p-4">
              <p className="text-xs text-muted-foreground">Confirmed bookings</p>
              <p className="mt-2 font-display text-2xl font-bold text-foreground">
                {formatNumber(bookingStats?.confirmedBookings ?? 0)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Revenue-generating stays</p>
            </div>
            <div className="rounded-2xl border border-border bg-card/70 p-4">
              <p className="text-xs text-muted-foreground">Waiting bookings</p>
              <p className="mt-2 font-display text-2xl font-bold text-foreground">
                {formatNumber(bookingStats?.waitingBookings ?? 0)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Awaiting confirmation</p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {accountHeader}
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card/70 p-4">
            <p className="text-xs text-muted-foreground">{t('common.properties')}</p>
            <p className="mt-2 font-display text-2xl font-bold text-foreground">
              {formatNumber(propertyStats?.totalProperties ?? 0)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatNumber(propertyStats?.activeProperties ?? 0)} active · {formatNumber(propertyStats?.holdProperties ?? 0)} hold
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card/70 p-4">
            <p className="text-xs text-muted-foreground">Dynamic pricing</p>
            <p className="mt-2 font-display text-2xl font-bold text-foreground">
              {formatNumber(propertyStats?.dynamicPricingProperties ?? 0)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatNumber(propertyStats?.totalPropertyViews ?? 0)} views · {formatNumber(propertyStats?.totalPropertyLikes ?? 0)} likes
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card/70 p-4">
            <p className="text-xs text-muted-foreground">Average price</p>
            <p className="mt-2 font-display text-2xl font-bold text-foreground">
              ${formatNumber(propertyStats?.averagePropertyPrice ?? 0)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Across active listings</p>
          </div>
          <div className="rounded-2xl border border-border bg-card/70 p-4">
            <p className="text-xs text-muted-foreground">Booked</p>
            <p className="mt-2 font-display text-2xl font-bold text-foreground">
              {formatNumber(propertyStats?.bookedProperties ?? 0)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Listings with active reservations</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/80 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{t('common.properties')}</h3>
            <span className="text-xs text-muted-foreground">Recent 6</span>
          </div>
          <div className="space-y-3">
            {recentProperties.length === 0 ? (
              <p className="text-sm text-muted-foreground">No properties yet.</p>
            ) : (
              recentProperties.map((item) => (
                <div key={item._id} className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{item.propertyTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.propertyType} · {item.propertyStatus} · {item.dynamicPricingEnabled ? 'Dynamic on' : 'Static'}
                    </p>
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>${formatNumber(item.propertyPrice)}</p>
                    <p>{formatDate(item.createdAt, { month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )
  })() : null

  return (
    <div className="min-h-screen bg-background">
      <Navbar forceSolid />
      <div className="pt-28 md:pt-32">
        <DashboardLayout
          title={pageTitle}
          navItems={navItems}
          basePath="/agent"
          showTopBar={false}
          contextBar={contextBar}
        >
          <Routes>
            <Route index element={<Navigate to="/agent/properties" replace />} />
            <Route path="properties" element={<AgentProperties />} />
            <Route path="bookings" element={<AgentBookings />} />
            <Route path="earnings" element={<AgentEarnings />} />
            <Route path="*" element={<Navigate to="/agent/properties" replace />} />
          </Routes>
        </DashboardLayout>
      </div>
      <Footer />
    </div>
  )
}
