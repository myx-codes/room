import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, MapPin, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import heroImage from '@/assets/hero-villa.jpg'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarUI } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import type { DateRange } from 'react-day-picker'

export function Hero() {
  const navigate = useNavigate()
  const [location, setLocation] = useState('')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (location) params.set('location', location)
    navigate(`/properties?${params.toString()}`)
  }

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Luxury villa with infinity pool at sunset"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/80 text-sm tracking-[0.3em] uppercase mb-6 font-medium"
        >
          Villas · Hotels · Sanatoriums
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.05] mb-6"
        >
          Your Perfect
          <br />
          <span className="italic">Getaway</span> Awaits
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-white/70 text-lg sm:text-xl max-w-2xl mx-auto mb-12 font-light"
        >
          Discover handpicked villas, premium hotels, and world-class health retreats across Central Asia and beyond
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white/95 backdrop-blur-md rounded-2xl p-2 max-w-3xl mx-auto shadow-2xl"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex items-center gap-3 px-4 py-3 flex-1 border-b sm:border-b-0 sm:border-r border-border/30">
              <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Where to?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent text-foreground placeholder:text-muted-foreground text-sm w-full outline-none"
              />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-3 px-4 py-3 flex-1 border-b sm:border-b-0 sm:border-r border-border/30 text-left">
                  <Calendar className="w-5 h-5 text-muted-foreground shrink-0" />
                  <span className={cn("text-sm", dateRange?.from ? "text-foreground" : "text-muted-foreground")}>
                    {dateRange?.from ? (
                      dateRange.to
                        ? `${format(dateRange.from, 'MMM d')} — ${format(dateRange.to, 'MMM d')}`
                        : format(dateRange.from, 'MMM d')
                    ) : 'Check in — Check out'}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <CalendarUI
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>

            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-medium hover:opacity-90 gentle-animation"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-1.5">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-white/60 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  )
}
