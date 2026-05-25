import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Menu, User, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  clearAccessToken,
  getAccountDashboardPath,
  getAuthChangedEventName,
  isAuthenticated,
} from '@/lib/auth'
import { languageOptions, useI18n } from '@/i18n'

const navLinks = [
  { labelKey: 'navbar.villas', type: 'route' as const, to: '/properties?category=villa' },
  { labelKey: 'navbar.hotels', type: 'route' as const, to: '/properties?category=hotel' },
  { labelKey: 'navbar.sanatoriums', type: 'route' as const, to: '/properties?category=sanatorium' },
  { labelKey: 'navbar.howItWorks', type: 'section' as const, sectionId: 'how-it-works' },
]

interface NavbarProps {
  forceSolid?: boolean
}

export function Navbar({ forceSolid = false }: NavbarProps) {
  const { language, setLanguage, t } = useI18n()
  const location = useLocation()
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const [hasAuthSession, setHasAuthSession] = useState(isAuthenticated())
  const langRef = useRef<HTMLDivElement>(null)
  const isScrolledRef = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      const nextIsScrolled = window.scrollY > 18
      if (nextIsScrolled === isScrolledRef.current) {
        return
      }

      isScrolledRef.current = nextIsScrolled
      setIsScrolled(nextIsScrolled)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const syncAuthState = () => setHasAuthSession(isAuthenticated())
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
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      return
    }

    navigate(`/#${sectionId}`)
  }

  const handleLogout = () => {
    clearAccessToken()
    setIsMobileMenuOpen(false)
    navigate('/')
  }

  const useSolidStyle = forceSolid || isScrolled
  const accountDashboardPath = getAccountDashboardPath()

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8"
    >
      <div
        className={`mx-auto max-w-7xl rounded-[1.75rem] px-4 py-3 transition-all duration-300 sm:px-5 lg:px-6 ${
          useSolidStyle
            ? 'border border-white/70 bg-[rgba(255,249,241,0.85)] shadow-[0_22px_60px_-38px_rgba(21,55,50,0.45)] backdrop-blur-2xl'
            : 'border border-white/12 bg-white/10 backdrop-blur-xl'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div
              className={`rounded-2xl px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] ${
                useSolidStyle ? 'bg-primary/8 text-primary' : 'bg-white/12 text-white/78'
              }`}
            >
              {t('navbar.curatedStays')}
            </div>
            <span
              className={`font-display text-2xl font-bold tracking-tight ${
                useSolidStyle ? 'text-foreground' : 'text-white'
              }`}
            >
              ROOM<span className="text-gold">i</span>
            </span>
          </Link>

          <div
            className={`hidden items-center gap-1 rounded-full px-2 py-2 lg:flex ${
              useSolidStyle ? 'bg-primary/5' : 'bg-white/8'
            }`}
          >
            {navLinks.map((link) =>
              link.type === 'route' ? (
                <Link
                  key={link.labelKey}
                  to={link.to}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    useSolidStyle
                      ? 'text-foreground hover:bg-primary/8'
                      : 'text-white/88 hover:bg-white/10'
                  }`}
                >
                  {t(link.labelKey)}
                </Link>
              ) : (
                <button
                  key={link.labelKey}
                  onClick={() => handleSectionNavigation(link.sectionId)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    useSolidStyle
                      ? 'text-foreground hover:bg-primary/8'
                      : 'text-white/88 hover:bg-white/10'
                  }`}
                >
                  {t(link.labelKey)}
                </button>
              ),
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setIsLangOpen((open) => !open)}
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  useSolidStyle
                    ? 'text-foreground hover:bg-primary/8'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Globe className="h-4 w-4" />
                <span className="hidden uppercase sm:inline">{language}</span>
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.16 }}
                    className="absolute right-0 mt-2 w-44 overflow-hidden rounded-[1.5rem] border border-white/70 bg-[rgba(255,249,241,0.96)] shadow-xl backdrop-blur-2xl"
                  >
                    {languageOptions.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code)
                          setIsLangOpen(false)
                        }}
                        className={`w-full px-4 py-3 text-left text-sm transition-colors hover:bg-primary/6 ${
                          language === lang.code ? 'font-semibold text-gold' : 'text-foreground'
                        }`}
                      >
                        {t(lang.labelKey)}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {hasAuthSession ? (
              <>
                <Link
                  to={accountDashboardPath}
                  className={`hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-medium md:inline-flex ${
                    useSolidStyle
                      ? 'text-foreground hover:bg-primary/8'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <User className="h-4 w-4" />
                  {t('common.myAccount')}
                </Link>
                <button
                  onClick={handleLogout}
                  className={`hidden rounded-full px-5 py-2 text-sm font-semibold md:inline-flex ${
                    useSolidStyle
                      ? 'bg-primary text-primary-foreground hover:bg-[#204640]'
                      : 'bg-white text-foreground hover:bg-[#f4e3cc]'
                  }`}
                >
                  {t('common.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/sign-in"
                  className={`hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-medium md:inline-flex ${
                    useSolidStyle
                      ? 'text-foreground hover:bg-primary/8'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <User className="h-4 w-4" />
                  {t('common.signIn')}
                </Link>
                <Link
                  to="/sign-up"
                  className={`hidden rounded-full px-5 py-2 text-sm font-semibold md:inline-flex ${
                    useSolidStyle
                      ? 'bg-primary text-primary-foreground hover:bg-[#204640]'
                      : 'bg-white text-foreground hover:bg-[#f4e3cc]'
                  }`}
                >
                  {t('common.signUp')}
                </Link>
              </>
            )}

            <button
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className={`inline-flex rounded-full p-2.5 lg:hidden ${
                useSolidStyle
                  ? 'text-foreground hover:bg-primary/8'
                  : 'text-white hover:bg-white/10'
              }`}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-3 max-w-7xl overflow-hidden rounded-[2rem] border border-white/70 bg-[rgba(255,249,241,0.95)] shadow-[0_28px_70px_-38px_rgba(21,55,50,0.5)] backdrop-blur-2xl lg:hidden"
          >
            <div className="space-y-2 p-5">
              {navLinks.map((link) =>
                link.type === 'route' ? (
                  <Link
                    key={link.labelKey}
                    to={link.to}
                    className="block rounded-[1.25rem] px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-primary/6"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t(link.labelKey)}
                  </Link>
                ) : (
                  <button
                    key={link.labelKey}
                    onClick={() => {
                      handleSectionNavigation(link.sectionId)
                      setIsMobileMenuOpen(false)
                    }}
                    className="block w-full rounded-[1.25rem] px-4 py-3 text-left text-base font-medium text-foreground transition-colors hover:bg-primary/6"
                  >
                    {t(link.labelKey)}
                  </button>
                ),
              )}
            </div>

            <div className="border-t border-primary/8 p-5">
              <div className="flex flex-wrap gap-2">
                {languageOptions.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      language === lang.code
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-primary/6 text-foreground'
                    }`}
                  >
                    {t(lang.labelKey)}
                  </button>
                ))}
              </div>

              <div className="mt-4 grid gap-3">
                {hasAuthSession ? (
                  <>
                    <Link
                      to={accountDashboardPath}
                      className="rounded-full border border-primary/10 px-5 py-3 text-center text-sm font-medium text-foreground"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('common.myAccount')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
                    >
                      {t('common.logout')}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/sign-in"
                      className="rounded-full border border-primary/10 px-5 py-3 text-center text-sm font-medium text-foreground"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('common.signIn')}
                    </Link>
                    <Link
                      to="/sign-up"
                      className="rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('common.signUp')}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
