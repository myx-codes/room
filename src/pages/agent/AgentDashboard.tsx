import { Routes, Route, Navigate } from 'react-router-dom'
import { Home, CalendarCheck, DollarSign } from 'lucide-react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import AgentProperties from './AgentProperties'
import AgentBookings from './AgentBookings'
import AgentEarnings from './AgentEarnings'

const navItems = [
  { label: 'My Properties', path: '/agent', icon: <Home className="w-4 h-4" /> },
  { label: 'Bookings', path: '/agent/bookings', icon: <CalendarCheck className="w-4 h-4" /> },
  { label: 'Earnings', path: '/agent/earnings', icon: <DollarSign className="w-4 h-4" /> },
]

export default function AgentDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar forceSolid />
      <div className="pt-20">
        <DashboardLayout title="Agent Dashboard" navItems={navItems} basePath="/agent" showTopBar={false}>
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
