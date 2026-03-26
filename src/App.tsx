import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Categories } from './components/Categories'
import { FeaturedProperties } from './components/FeaturedProperties'
import { HowItWorks } from './components/HowItWorks'
import { CTA } from './components/CTA'
import { Footer } from './components/Footer'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Properties from './pages/Properties'
import PropertyDetail from './pages/PropertyDetail'
import AdminDashboard from './pages/admin/AdminDashboard'
import AgentDashboard from './pages/agent/AgentDashboard'
import MyPage from './pages/mypage/MyPage'
import NotFound from './pages/NotFound'

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Categories />
        <FeaturedProperties />
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
    </BrowserRouter>
  )
}
