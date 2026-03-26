import { Routes, Route, Navigate } from 'react-router-dom'
import { Home, Users, CalendarCheck, BarChart3 } from 'lucide-react'
import { DashboardLayout } from '@/components/DashboardLayout'
import AdminProperties from './AdminProperties'
import AdminUsers from './AdminUsers'
import AdminBookings from './AdminBookings'
import AdminAnalytics from './AdminAnalytics'

const navItems = [
  { label: 'Properties', path: '/admin', icon: <Home className="w-4 h-4" /> },
  { label: 'Users', path: '/admin/users', icon: <Users className="w-4 h-4" /> },
  { label: 'Bookings', path: '/admin/bookings', icon: <CalendarCheck className="w-4 h-4" /> },
  { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 className="w-4 h-4" /> },
]

export default function AdminDashboard() {
  return (
    <DashboardLayout title="Admin Dashboard" navItems={navItems} basePath="/admin">
      <Routes>
        <Route index element={<AdminProperties />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </DashboardLayout>
  )
}
