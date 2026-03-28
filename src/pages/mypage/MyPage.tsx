import { Routes, Route, Navigate } from 'react-router-dom'
import { User, CalendarCheck, Heart, CreditCard } from 'lucide-react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import MyProfile from './MyProfile'
import MyBookings from './MyBookings'
import MyFavorites from './MyFavorites'
import MyPayments from './MyPayments'

const navItems = [
  { label: 'Profile', path: '/my-page', icon: <User className="w-4 h-4" /> },
  { label: 'Bookings', path: '/my-page/bookings', icon: <CalendarCheck className="w-4 h-4" /> },
  { label: 'Favorites', path: '/my-page/favorites', icon: <Heart className="w-4 h-4" /> },
  { label: 'Payments', path: '/my-page/payments', icon: <CreditCard className="w-4 h-4" /> },
]

export default function MyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar forceSolid />
      <div className="pt-20">
        <DashboardLayout title="My Account" navItems={navItems} basePath="/my-page" showTopBar={false}>
          <Routes>
            <Route index element={<MyProfile />} />
            <Route path="bookings" element={<MyBookings />} />
            <Route path="favorites" element={<MyFavorites />} />
            <Route path="payments" element={<MyPayments />} />
            <Route path="*" element={<Navigate to="/my-page" replace />} />
          </Routes>
        </DashboardLayout>
      </div>
      <Footer />
    </div>
  )
}
