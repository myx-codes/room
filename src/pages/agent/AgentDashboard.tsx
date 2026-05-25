import { Routes, Route, Navigate } from 'react-router-dom'
import { Home, CalendarCheck, DollarSign } from 'lucide-react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { useI18n } from '@/i18n'
import AgentProperties from './AgentProperties'
import AgentBookings from './AgentBookings'
import AgentEarnings from './AgentEarnings'

export default function AgentDashboard() {
  const { t } = useI18n()

  const navItems = [
    { label: t('agent.myProperties'), path: '/agent', icon: <Home className="w-4 h-4" /> },
    { label: t('common.bookings'), path: '/agent/bookings', icon: <CalendarCheck className="w-4 h-4" /> },
    { label: t('common.earnings'), path: '/agent/earnings', icon: <DollarSign className="w-4 h-4" /> },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar forceSolid />
      <div className="pt-20">
        <DashboardLayout title={t('agent.dashboard')} navItems={navItems} basePath="/agent" showTopBar={false}>
          <Routes>
            <Route index element={<AgentProperties />} />
            <Route path="bookings" element={<AgentBookings />} />
            <Route path="earnings" element={<AgentEarnings />} />
            <Route path="*" element={<Navigate to="/agent" replace />} />
          </Routes>
        </DashboardLayout>
      </div>
      <Footer />
    </div>
  )
}
