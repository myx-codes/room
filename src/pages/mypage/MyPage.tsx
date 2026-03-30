import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { User, CalendarCheck, Heart, CreditCard } from 'lucide-react'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { getAuthChangedEventName, getMemberProfile } from '@/lib/auth'
import MyProfile from './MyProfile'
import MyBookings from './MyBookings'
import MyFavorites from './MyFavorites'
import MyPayments from './MyPayments'
import AgentProperties from '../agent/AgentProperties'
import AgentBookings from '../agent/AgentBookings'
import AgentEarnings from '../agent/AgentEarnings'

const navItems = [
  { label: 'Profile', path: '/my-page', icon: <User className="w-4 h-4" /> },
  { label: 'Bookings', path: '/my-page/bookings', icon: <CalendarCheck className="w-4 h-4" /> },
  { label: 'Favorites', path: '/my-page/favorites', icon: <Heart className="w-4 h-4" /> },
  { label: 'Payments', path: '/my-page/payments', icon: <CreditCard className="w-4 h-4" /> },
]

const agentNavItems = [
  { label: 'My Properties', path: '/my-page', icon: <User className="w-4 h-4" /> },
  { label: 'Bookings', path: '/my-page/bookings', icon: <CalendarCheck className="w-4 h-4" /> },
  { label: 'Earnings', path: '/my-page/earnings', icon: <CreditCard className="w-4 h-4" /> },
]

export default function MyPage() {
  const [memberType, setMemberType] = useState(getMemberProfile()?.memberType)

  useEffect(() => {
    const syncMemberType = () => {
      setMemberType(getMemberProfile()?.memberType)
    }

    const authEvent = getAuthChangedEventName()
    window.addEventListener('storage', syncMemberType)
    window.addEventListener(authEvent, syncMemberType)

    return () => {
      window.removeEventListener('storage', syncMemberType)
      window.removeEventListener(authEvent, syncMemberType)
    }
  }, [])

  const isAgent = memberType === 'AGENT'

  return (
    <div className="min-h-screen bg-background">
      <Navbar forceSolid />
      <div className="pt-20">
        <DashboardLayout title="My Account" navItems={isAgent ? agentNavItems : navItems} basePath="/my-page" showTopBar={false}>
          <Routes>
            {isAgent ? (
              <>
                <Route index element={<AgentProperties />} />
                <Route path="bookings" element={<AgentBookings />} />
                <Route path="earnings" element={<AgentEarnings />} />
              </>
            ) : (
              <>
                <Route index element={<MyProfile />} />
                <Route path="bookings" element={<MyBookings />} />
                <Route path="favorites" element={<MyFavorites />} />
                <Route path="payments" element={<MyPayments />} />
              </>
            )}
            <Route path="*" element={<Navigate to="/my-page" replace />} />
          </Routes>
        </DashboardLayout>
      </div>
      <Footer />
    </div>
  )
}
