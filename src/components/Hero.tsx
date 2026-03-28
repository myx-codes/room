import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, MapPin, Calendar } from 'lucide-react'
import { format } from 'date-fns'
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
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-black">
      {/* --- BACKGROUND VIDEO --- */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-80" // Video rasmga qaraganda yorqinroq bo'lsa opacity bilan o'ynash mumkin
        >
          {/* Public papkangizdagi video yo'li */}
          <source src="/videos/211152.mp4" type="video/mp4" />
          {/* Brauzer videoni o'qiy olmasa, zaxira rasm (fallback) */}
          Your browser does not support the video tag.
        </video>
        {/* Overlay: Matnlar yaxshi o'qilishi uchun qatlam */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/80 text-[10px] tracking-[0.4em] uppercase mb-6 font-bold"
        >
          Villas · Hotels · Sanatoriums
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.05] mb-6 tracking-tight"
        >
          Your Perfect
          <br />
          <span className="italic font-light">Getaway</span> Awaits
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-white/80 text-lg sm:text-xl max-w-2xl mx-auto mb-12 font-light italic"
        >
          Discover handpicked villas, premium hotels, and world-class health retreats.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-2.5 max-w-3xl mx-auto shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)] border border-white/20"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex items-center gap-3 px-6 py-4 flex-1 border-b sm:border-b-0 sm:border-r border-slate-200/50">
              <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Where to go?"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent text-slate-900 placeholder:text-slate-400 text-sm w-full outline-none font-medium"
              />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-3 px-6 py-4 flex-1 border-b sm:border-b-0 sm:border-r border-slate-200/50 text-left">
                  <Calendar className="w-5 h-5 text-slate-400 shrink-0" />
                  <span className={cn("text-sm font-medium", dateRange?.from ? "text-slate-900" : "text-slate-400")}>
                    {dateRange?.from ? (
                      dateRange.to
                        ? `${format(dateRange.from, 'MMM d')} — ${format(dateRange.to, 'MMM d')}`
                        : format(dateRange.from, 'MMM d')
                    ) : 'Dates'}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden border-none shadow-2xl" align="center">
                <CalendarUI
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  className="p-4 bg-white"
                />
              </PopoverContent>
            </Popover>

            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 bg-slate-900 text-white px-10 py-4 rounded-2xl text-sm font-bold hover:bg-amber-600 transition-all duration-300 shadow-lg active:scale-95"
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
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-1.5 backdrop-blur-sm">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 bg-white rounded-full"
          />
        </div>
      </motion.div>
    </section>
  )
}