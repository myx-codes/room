import { Routes, Route, Navigate } from 'react-router-dom'
import { Home, Users, Newspaper, BarChart3 } from 'lucide-react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { getMemberProfile } from '@/lib/auth'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { useI18n } from '@/i18n'
import AdminProperties from './AdminProperties'
import AdminUsers from './AdminUsers'
import AdminBookings from './AdminBookings'
import AdminAnalytics from './AdminAnalytics'

export default function AdminDashboard() {
  const { t } = useI18n()
  const profile = getMemberProfile()

  const navItems = [
    { label: t('common.properties'), path: '/admin', icon: <Home className="w-4 h-4" /> },
    { label: t('common.users'), path: '/admin/users', icon: <Users className="w-4 h-4" /> },
    { label: t('common.articles'), path: '/admin/articles', icon: <Newspaper className="w-4 h-4" /> },
    { label: t('common.analytics'), path: '/admin/analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ]

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
        <DashboardLayout title={t('admin.dashboard')} navItems={navItems} basePath="/admin" showTopBar={false}>
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
