import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Globe, User } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { clearAccessToken, getAccessToken, getAuthChangedEventName } from '@/lib/auth'

const navLinks = [
  { label: 'Villas', type: 'route' as const, to: '/properties?category=villa' },
  { label: 'Hotels', type: 'route' as const, to: '/properties?category=hotel' },
  { label: 'Sanatoriums', type: 'route' as const, to: '/properties?category=sanatorium' },
  { label: 'How It Works', type: 'section' as const, sectionId: 'how-it-works' },
]

const languages = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'uz', label: "O'zbek" },
]

interface NavbarProps {
  forceSolid?: boolean
}

export function Navbar({ forceSolid = false }: NavbarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('en')
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getAccessToken()))
  const langRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const syncAuthState = () => setIsAuthenticated(Boolean(getAccessToken()))
    const authEvent = getAuthChangedEventName()

    window.addEventListener('storage', syncAuthState)
    window.addEventListener(authEvent, syncAuthState)

    return () => {
      window.removeEventListener('storage', syncAuthState)
      window.removeEventListener(authEvent, syncAuthState)
    }
  }, [])

  const handleSectionNavigation = (sectionId: string) => {
    if (location.pathname === '/') {
      const section = document.getElementById(sectionId)
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }

    navigate(`/#${sectionId}`)
  }

  const useSolidStyle = forceSolid || isScrolled

  const handleLogout = () => {
    clearAccessToken()
    setIsMobileMenuOpen(false)
    navigate('/')
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className={`w-full px-6 sm:px-8 lg:px-12 py-4 gentle-animation ${
        useSolidStyle
          ? 'bg-card/90 backdrop-blur-xl border-b border-border shadow-sm'
          : 'bg-transparent'
      }`}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1">
            <span className={`font-display text-2xl font-bold tracking-tight gentle-animation ${
              useSolidStyle ? 'text-foreground' : 'text-white'
            }`}>
              ROOM<span className="text-gold">i</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.type === 'route' ? (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`text-sm font-medium tracking-wide gentle-animation hover:opacity-70 ${
                    useSolidStyle ? 'text-foreground' : 'text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.label}
                  onClick={() => handleSectionNavigation(link.sectionId)}
                  className={`text-sm font-medium tracking-wide gentle-animation hover:opacity-70 ${
                    useSolidStyle ? 'text-foreground' : 'text-white'
                  }`}
                >
                  {link.label}
                </button>
              )
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-full gentle-animation ${
                  useSolidStyle
                    ? 'text-foreground hover:bg-muted'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline uppercase">{currentLang}</span>
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-40 rounded-xl bg-card border border-border shadow-lg overflow-hidden"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => { setCurrentLang(lang.code); setIsLangOpen(false) }}
                        className={`w-full text-left px-4 py-2.5 text-sm gentle-animation hover:bg-muted ${
                          currentLang === lang.code ? 'text-gold font-semibold' : 'text-foreground'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isAuthenticated ? (
              <>
                <Link
                  to="/my-page"
                  className={`hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full gentle-animation ${
                    useSolidStyle
                      ? 'text-foreground hover:bg-muted'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <User className="w-4 h-4" />
                  My Account
                </Link>
                <button
                  onClick={handleLogout}
                  className={`hidden sm:inline-flex items-center px-5 py-2 text-sm font-medium rounded-full gentle-animation ${
                    useSolidStyle
                      ? 'bg-primary text-primary-foreground hover:opacity-90'
                      : 'bg-white text-foreground hover:bg-white/90'
                  }`}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Sign In */}
                <Link
                  to="/sign-in"
                  className={`hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full gentle-animation ${
                    useSolidStyle
                      ? 'text-foreground hover:bg-muted'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Sign In
                </Link>

                {/* Sign Up */}
                <Link
                  to="/sign-up"
                  className={`hidden sm:inline-flex items-center px-5 py-2 text-sm font-medium rounded-full gentle-animation ${
                    useSolidStyle
                      ? 'bg-primary text-primary-foreground hover:opacity-90'
                      : 'bg-white text-foreground hover:bg-white/90'
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-full gentle-animation ${
                useSolidStyle ? 'text-foreground hover:bg-muted' : 'text-white hover:bg-white/10'
              }`}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="md:hidden fixed inset-0 top-0 bg-card z-40 pt-20"
        >
          <div className="flex flex-col items-center gap-6 p-8">
            {navLinks.map((link) => (
              link.type === 'route' ? (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-lg font-medium text-foreground hover:text-gold gentle-animation"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  key={link.label}
                  onClick={() => {
                    handleSectionNavigation(link.sectionId)
                    setIsMobileMenuOpen(false)
                  }}
                  className="text-lg font-medium text-foreground hover:text-gold gentle-animation"
                >
                  {link.label}
                </button>
              )
            ))}
            <div className="flex gap-2 mt-4">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setCurrentLang(lang.code)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium gentle-animation ${
                    currentLang === lang.code
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
            {isAuthenticated ? (
              <>
                <Link
                  to="/my-page"
                  className="mt-2 px-8 py-3 border border-border text-foreground rounded-full text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-full text-sm font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/sign-in"
                  className="mt-2 px-8 py-3 border border-border text-foreground rounded-full text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-full text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
