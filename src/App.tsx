import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Categories } from './components/Categories'
import { HowItWorks } from './components/HowItWorks'
import { CTA } from './components/CTA'
import { Footer } from './components/Footer'

const FeaturedProperties = lazy(() => import('./components/FeaturedProperties'))
const SignIn = lazy(() => import('./pages/SignIn'))
const SignUp = lazy(() => import('./pages/SignUp'))
const Properties = lazy(() => import('./pages/Properties'))
const PropertyDetail = lazy(() => import('./pages/PropertyDetail'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AgentDashboard = lazy(() => import('./pages/agent/AgentDashboard'))
const MyPage = lazy(() => import('./pages/mypage/MyPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

function RouteFallback() {
  return <div className="min-h-screen bg-background" />
}

function LazyOnView({
  children,
  minHeight = 960,
}: {
  children: ReactNode
  minHeight?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isVisible) {
      return
    }

    const element = ref.current
    if (!element || !('IntersectionObserver' in window)) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '180px 0px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [isVisible])

  return (
    <div ref={ref} style={isVisible ? undefined : { minHeight }}>
      {isVisible ? children : null}
    </div>
  )
}

function LandingPage() {
  useEffect(() => {
    if (!window.location.hash) {
      return
    }

    const id = window.location.hash.replace('#', '')
    const element = document.getElementById(id)

    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
    }
  }, [])

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-[18rem] h-[28rem] bg-[radial-gradient(circle_at_center,_rgba(190,138,81,0.18),_transparent_60%)]" />
      <div className="pointer-events-none absolute right-[-12rem] top-[52rem] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,_rgba(21,55,50,0.14),_transparent_72%)] blur-3xl" />
      <div className="pointer-events-none absolute left-[-10rem] top-[98rem] h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,_rgba(190,138,81,0.16),_transparent_72%)] blur-3xl" />
      <Navbar />
      <main className="relative">
        <Hero />
        <Categories />
        <LazyOnView minHeight={1200}>
          <Suspense fallback={<div className="px-6 py-24" aria-hidden="true" />}>
            <FeaturedProperties />
          </Suspense>
        </LazyOnView>
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/agent/*" element={<AgentDashboard />} />
          <Route path="/my-page/*" element={<MyPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
