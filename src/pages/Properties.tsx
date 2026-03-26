import { useState, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Heart, MapPin, SlidersHorizontal, X, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { properties, amenityLabels, type PropertyCategory } from '@/data/mockData'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarUI } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import type { DateRange } from 'react-day-picker'

const categories: { label: string; value: PropertyCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Villas', value: 'villa' },
  { label: 'Hotels', value: 'hotel' },
  { label: 'Sanatoriums', value: 'sanatorium' },
]

const amenityOptions = Object.entries(amenityLabels)

export default function Properties() {
  const [searchParams] = useSearchParams()
  const initialCategory = (searchParams.get('category') as PropertyCategory | null) || 'all'
  const initialLocation = searchParams.get('location') || ''

  const [category, setCategory] = useState<PropertyCategory | 'all'>(initialCategory)
  const [location, setLocation] = useState(initialLocation)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [minRating, setMinRating] = useState(0)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating' | 'reviews'>('rating')

  const filtered = useMemo(() => {
    let result = properties.filter((p) => {
      if (category !== 'all' && p.category !== category) return false
      if (location && !p.location.toLowerCase().includes(location.toLowerCase())) return false
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false
      if (p.rating < minRating) return false
      if (selectedAmenities.length > 0 && !selectedAmenities.every((a) => p.amenities.includes(a))) return false
      return true
    })

    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price
        case 'price-desc': return b.price - a.price
        case 'rating': return b.rating - a.rating
        case 'reviews': return b.reviews - a.reviews
        default: return 0
      }
    })

    return result
  }, [category, location, priceRange, minRating, selectedAmenities, sortBy])

  const toggleAmenity = (a: string) => {
    setSelectedAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a])
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl font-bold text-foreground">
            ROOM<span className="text-gold">i</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/sign-in" className="text-sm font-medium text-foreground hover:text-gold gentle-animation">Sign In</Link>
            <Link to="/sign-up" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-full hover:opacity-90 gentle-animation">Sign Up</Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-8">
          <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3">
            <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent text-foreground placeholder:text-muted-foreground text-sm w-full outline-none"
            />
          </div>

          {/* Date Range */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className={dateRange?.from ? 'text-foreground' : 'text-muted-foreground'}>
                  {dateRange?.from ? (
                    dateRange.to ? `${format(dateRange.from, 'MMM d')} — ${format(dateRange.to, 'MMM d')}` : format(dateRange.from, 'MMM d')
                  ) : 'Check in — Check out'}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
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
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-muted gentle-animation"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {(selectedAmenities.length > 0 || minRating > 0) && (
              <span className="bg-gold text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {selectedAmenities.length + (minRating > 0 ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap gentle-animation ${
                category === cat.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-foreground hover:bg-muted'
              }`}
            >
              {cat.label}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-card border border-border rounded-lg px-3 py-1.5 text-sm text-foreground outline-none"
            >
              <option value="rating">Top Rated</option>
              <option value="reviews">Most Reviewed</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-card border border-border rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-foreground">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="p-1 hover:bg-muted rounded-lg">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Price Range */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Price Range: ${priceRange[0]} — ${priceRange[1]}
                </label>
                <div className="flex gap-3">
                  <input type="range" min={0} max={500} value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="flex-1 accent-gold" />
                  <input type="range" min={0} max={500} value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="flex-1 accent-gold" />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Minimum Rating: {minRating > 0 ? `${minRating}+` : 'Any'}
                </label>
                <div className="flex gap-2">
                  {[0, 3, 4, 4.5].map((r) => (
                    <button key={r} onClick={() => setMinRating(r)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium gentle-animation ${
                        minRating === r ? 'bg-gold text-primary-foreground' : 'bg-muted text-foreground hover:bg-border'
                      }`}>
                      {r === 0 ? 'Any' : `${r}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {amenityOptions.map(([key, label]) => (
                    <button key={key} onClick={() => toggleAmenity(key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium gentle-animation ${
                        selectedAmenities.includes(key)
                          ? 'bg-gold text-primary-foreground'
                          : 'bg-muted text-foreground hover:bg-border'
                      }`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results */}
        <p className="text-sm text-muted-foreground mb-6">{filtered.length} properties found</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((prop, i) => (
            <motion.div
              key={prop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-card rounded-2xl overflow-hidden subtle-shadow hover:elevated-shadow gentle-animation"
            >
              <Link to={`/properties/${prop.id}`} className="block cursor-pointer">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={prop.image} alt={prop.title} loading="lazy"
                    className="w-full h-full object-cover gentle-animation group-hover:scale-105" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-card/90 backdrop-blur-sm text-foreground text-xs font-medium px-3 py-1.5 rounded-full capitalize">
                      {prop.category}
                    </span>
                  </div>
                  <button className="absolute top-4 right-4 p-2 bg-card/90 backdrop-blur-sm rounded-full hover:bg-card gentle-animation">
                    <Heart className="w-4 h-4 text-foreground" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-1 text-muted-foreground text-xs mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    {prop.location}
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">{prop.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-gold fill-gold" />
                      <span className="text-sm font-medium text-foreground">{prop.rating}</span>
                      <span className="text-xs text-muted-foreground">({prop.reviews})</span>
                    </div>
                    <div>
                      <span className="text-lg font-semibold text-foreground">${prop.price}</span>
                      <span className="text-sm text-muted-foreground"> / night</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No properties match your filters.</p>
            <button onClick={() => { setCategory('all'); setMinRating(0); setSelectedAmenities([]); setPriceRange([0, 500]) }}
              className="mt-4 text-gold font-medium hover:underline">Clear all filters</button>
          </div>
        )}
      </div>
    </div>
  )
}
