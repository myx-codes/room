import { Routes, Route, Navigate } from 'react-router-dom'
import { Home, Users, Newspaper, BarChart3 } from 'lucide-react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { getMemberProfile } from '@/lib/auth'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import AdminProperties from './AdminProperties'
import AdminUsers from './AdminUsers'
import AdminBookings from './AdminBookings'
import AdminAnalytics from './AdminAnalytics'

const navItems = [
  { label: 'Properties', path: '/admin', icon: <Home className="w-4 h-4" /> },
  { label: 'Users', path: '/admin/users', icon: <Users className="w-4 h-4" /> },
  { label: 'Articles', path: '/admin/articles', icon: <Newspaper className="w-4 h-4" /> },
  { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 className="w-4 h-4" /> },
]

export default function AdminDashboard() {
  const profile = getMemberProfile()

  if (!profile) {
    return <Navigate to="/sign-in" replace />
  }

  if (profile.memberType !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar forceSolid />
      <div className="pt-20">
        <DashboardLayout title="Admin Dashboard" navItems={navItems} basePath="/admin" showTopBar={false}>
          <Routes>
            <Route index element={<AdminProperties />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="articles" element={<AdminBookings />} />
            <Route path="bookings" element={<Navigate to="/admin/articles" replace />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </DashboardLayout>
      </div>
      <Footer />
    </div>
  )
}
