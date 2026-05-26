import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Calendar,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { format } from 'date-fns'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarUI } from '@/components/ui/calendar'
import { ScrollSafeVideo } from '@/components/ScrollSafeVideo'
import { useIsMobile } from '@/hooks/use-mobile'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/utils'
import heroPoster from '@/assets/hero-villa.jpg'
import type { DateRange } from 'react-day-picker'

export function Hero() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const { t, dateFnsLocale } = useI18n()
  const [location, setLocation] = useState('')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const promisePills = [
    t('hero.promise1'),
    t('hero.promise2'),
    t('hero.promise3'),
  ]

  const experienceHighlights = [
    {
      title: t('hero.highlight1Title'),
      description: t('hero.highlight1Desc'),
    },
    {
      title: t('hero.highlight2Title'),
      description: t('hero.highlight2Desc'),
    },
  ]

  const handleSearch = () => {
    const params = new URLSearchParams()
    
    if (location) params.set('location', location)
    navigate(`/properties?${params.toString()}`)
  }

  return (
    <section className="relative flex min-h-screen items-end overflow-hidden bg-[#081311] pb-12 pt-28 sm:pb-16 lg:pb-20">
      <div className="absolute inset-0 z-0">
        <ScrollSafeVideo
          src="/videos/211152.webm"
          poster={heroPoster}
          className="opacity-60"
        />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(8,19,17,0.94)_0%,rgba(8,19,17,0.76)_44%,rgba(8,19,17,0.42)_72%,rgba(8,19,17,0.78)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(190,138,81,0.22),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_24%)]" />
      </div>

      <div className="pointer-events-none absolute left-[-7rem] top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(190,138,81,0.26),_transparent_70%)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-[-10rem] h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(24,72,66,0.42),_transparent_70%)] blur-3xl" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-6 lg:grid-cols-[minmax(0,1.05fr)_380px] lg:px-8">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/82 backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            {t('hero.eyebrow')}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="max-w-4xl text-5xl font-bold leading-[0.98] text-white sm:text-6xl lg:text-7xl xl:text-[5.5rem]"
          >
            {t('hero.titleMain')}
            <span className="ml-3 italic text-[#f1d8b3]">{t('hero.titleAccent')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
          className="mt-6 max-w-2xl text-base text-white/76 sm:text-lg"
        >
          {t('hero.description')}
        </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.26 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              to="/properties"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f4e3cc]"
            >
              {t('hero.explore')}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/sign-up"
              className="inline-flex items-center justify-center rounded-full border border-white/18 bg-white/10 px-6 py-3.5 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:bg-white/16"
            >
              {t('hero.createAccount')}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.34 }}
            className="premium-panel mt-10 rounded-[2rem] p-3"
          >
            <div className="grid gap-3 lg:grid-cols-[1.15fr_0.95fr_auto]">
              <label className="rounded-[1.5rem] border border-slate-200/70 bg-white/80 px-5 py-4">
                <span className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                  <MapPin className="h-3.5 w-3.5 text-gold" />
                  {t('common.destination')}
                </span>
                <input
                  type="text"
                  placeholder={t('hero.destinationPlaceholder')}
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
                />
              </label>

              <Popover>
                <PopoverTrigger asChild>
                  <button className="rounded-[1.5rem] border border-slate-200/70 bg-white/80 px-5 py-4 text-left transition-colors hover:bg-white">
                    <span className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                      <Calendar className="h-3.5 w-3.5 text-gold" />
                      {t('common.dates')}
                    </span>
                    <span
                      className={cn(
                        'block text-sm font-semibold',
                        dateRange?.from ? 'text-slate-900' : 'text-slate-400',
                      )}
                    >
                      {dateRange?.from ? (
                        dateRange.to
                          ? `${format(dateRange.from, 'MMM d', { locale: dateFnsLocale })} - ${format(dateRange.to, 'MMM d', { locale: dateFnsLocale })}`
                          : format(dateRange.from, 'MMM d', { locale: dateFnsLocale })
                      ) : (
                        t('hero.chooseTripWindow')
                      )}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto max-w-[calc(100vw-2rem)] overflow-hidden rounded-[2rem] border-none p-0 shadow-2xl"
                  align="center"
                >
                  <CalendarUI
                    mode="range"
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={isMobile ? 1 : 2}
                    className="bg-white p-4"
                  />
                </PopoverContent>
              </Popover>

              <button
                onClick={handleSearch}
                className="inline-flex items-center justify-center gap-2 rounded-[1.5rem] bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#204640]"
              >
                <Search className="h-4 w-4" />
                {t('common.search')}
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 px-1">
              {promisePills.map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-slate-200/80 bg-white/78 px-3 py-1.5 text-xs font-medium text-slate-600"
                >
                  {pill}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 26 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, delay: 0.22 }}
          className="hidden lg:flex lg:flex-col lg:justify-end"
        >
          <div className="space-y-4">
            <div className="rounded-[2rem] border border-white/12 bg-white/10 p-6 text-white backdrop-blur-xl shadow-[0_24px_70px_-30px_rgba(0,0,0,0.75)]">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/58">
                    {t('hero.curatedLuxury')}
                  </p>
                  <p className="mt-2 text-2xl font-semibold">{t('hero.verifiedPlaces')}</p>
                </div>
                <div className="rounded-2xl bg-white/12 p-3">
                  <ShieldCheck className="h-6 w-6 text-[#f1d8b3]" />
                </div>
              </div>

              <div className="space-y-3">
                {experienceHighlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[1.5rem] border border-white/10 bg-black/14 p-4"
                  >
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm text-white/62">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-[1.75rem] border border-white/12 bg-white/9 p-5 text-white backdrop-blur-xl">
                <p className="text-3xl font-semibold">4.9</p>
                <p className="mt-1 text-sm text-white/62">{t('hero.avgGuestSatisfaction')}</p>
              </div>
              <div className="rounded-[1.75rem] border border-white/12 bg-white/9 p-5 text-white backdrop-blur-xl">
                <p className="text-3xl font-semibold">24/7</p>
                <p className="mt-1 text-sm text-white/62">{t('hero.supportText')}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
