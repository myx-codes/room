import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@apollo/client/react'
import { Star, Heart, MapPin, SlidersHorizontal, X, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { amenityLabels } from '@/data/mockData'
import { GET_PROPERTIES } from '@/graphql/user/query'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarUI } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { clearAccessToken, getAuthChangedEventName, isAuthenticated } from '@/lib/auth'
import type { DateRange } from 'react-day-picker'

type PropertyCategory = 'villa' | 'hotel' | 'sanatorium'

type ApiProperty = {
  _id: string
  propertyType: string
  propertyLocation: string
  propertyTitle: string
  propertyPrice: number
  propertyRank?: number
  propertyComments: number
  propertyImages: string[]
  propertyDesc?: string | null
}

type DisplayProperty = {
  id: string
  title: string
  location: string
  price: number
  rating: number
  reviews: number
  image: string
  category: PropertyCategory
  amenities: string[]
}

type GetPropertiesResponse = {
  getProperties: {
    list: ApiProperty[]
  }
}

type GetPropertiesVariables = {
  input: {
    page: number
    limit: number
    sort?: string
    direction?: 'ASC' | 'DESC'
    search: Record<string, never>
  }
}

const LIKED_PROPERTIES_KEY = 'roomi_liked_properties'

const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:3008/graphql'

function getBackendOrigin(): string {
  try {
    return new URL(GRAPHQL_URL).origin
  } catch {
    return 'http://localhost:3008'
  }
}

function resolveImageUrl(imagePath?: string): string {
  if (!imagePath) return '/assets/hero-villa.jpg'
  if (/^https?:\/\//i.test(imagePath) || imagePath.startsWith('data:') || imagePath.startsWith('blob:')) {
    return imagePath
  }

  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  return `${getBackendOrigin()}${cleanPath}`
}

function mapPropertyType(type: string): PropertyCategory {
  const normalized = type.toUpperCase()
  if (normalized === 'HOTEL') return 'hotel'
  if (normalized === 'SANATORIUM') return 'sanatorium'
  return 'villa'
}

function formatLocation(value: string): string {
  return value
    .toLowerCase()
    .split('_')
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(' ')
}

function parseAmenitiesFromDescription(description?: string | null): string[] {
  if (!description) return []
  const match = description.match(/(?:^|\n)Amenities:\s*([^\n]+)/i)
  if (!match) return []

  return match[1]
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((label) => {
      const found = Object.entries(amenityLabels).find(([, value]) => value.toLowerCase() === label.toLowerCase())
      return found?.[0] || label.toLowerCase().replace(/\s+/g, '-')
    })
}

function mapApiProperty(item: ApiProperty): DisplayProperty {
  return {
    id: item._id,
    title: item.propertyTitle,
    location: formatLocation(item.propertyLocation),
    price: item.propertyPrice,
    rating: item.propertyRank || 0,
    reviews: item.propertyComments || 0,
    image: resolveImageUrl(item.propertyImages?.[0]),
    category: mapPropertyType(item.propertyType),
    amenities: parseAmenitiesFromDescription(item.propertyDesc),
  }
}

function readLikedPropertyIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(LIKED_PROPERTIES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

const categories: { label: string; value: PropertyCategory | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Villas', value: 'villa' },
  { label: 'Hotels', value: 'hotel' },
  { label: 'Sanatoriums', value: 'sanatorium' },
]

const amenityOptions = Object.entries(amenityLabels)

export default function Properties() {
  const [searchParams] = useSearchParams()
  const categoryParam = searchParams.get('category') || searchParams.get('type')
  const initialCategory = (categoryParam as PropertyCategory | null) || 'all'
  const initialLocation = searchParams.get('location') || ''

  const [category, setCategory] = useState<PropertyCategory | 'all'>(initialCategory)
  const [location, setLocation] = useState(initialLocation)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [minRating, setMinRating] = useState(0)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating' | 'reviews'>('rating')
  const [likedIds, setLikedIds] = useState<string[]>(readLikedPropertyIds)
  const [hasAuthSession, setHasAuthSession] = useState(isAuthenticated())

  const authEventName = getAuthChangedEventName()

  const { data, loading, error } = useQuery<GetPropertiesResponse, GetPropertiesVariables>(GET_PROPERTIES, {
    variables: {
      input: {
        page: 1,
        limit: 200,
        sort: 'createdAt',
        direction: 'DESC',
        search: {},
      },
    },
    fetchPolicy: 'network-only',
  })

  const allProperties = useMemo(() => (data?.getProperties?.list || []).map(mapApiProperty), [data])

  useEffect(() => {
    const syncAuthState = () => setHasAuthSession(isAuthenticated())
    window.addEventListener('storage', syncAuthState)
    window.addEventListener(authEventName, syncAuthState)
    return () => {
      window.removeEventListener('storage', syncAuthState)
      window.removeEventListener(authEventName, syncAuthState)
    }
  }, [authEventName])

  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem(LIKED_PROPERTIES_KEY, JSON.stringify(likedIds))
  }, [likedIds])

  const filtered = useMemo(() => {
    let result = allProperties.filter((p) => {
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
  }, [allProperties, category, location, priceRange, minRating, selectedAmenities, sortBy])

  const toggleAmenity = (a: string) => {
    setSelectedAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a])
  }

  const toggleLike = (id: string) => {
    setLikedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
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
            {hasAuthSession ? (
              <>
                <Link to="/my-page" className="text-sm font-medium text-foreground hover:text-gold gentle-animation">My Account</Link>
                <button
                  onClick={() => {
                    clearAccessToken()
                  }}
                  className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-full hover:opacity-90 gentle-animation"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/sign-in" className="text-sm font-medium text-foreground hover:text-gold gentle-animation">Sign In</Link>
                <Link to="/sign-up" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-full hover:opacity-90 gentle-animation">Sign Up</Link>
              </>
            )}
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
        {loading && <p className="text-sm text-muted-foreground mb-4">Loading properties...</p>}
        {error && <p className="text-sm text-destructive mb-4">Failed to load properties: {error.message}</p>}
        <p className="text-sm text-muted-foreground mb-6">{filtered.length} properties found</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((prop, i) => (
            <motion.div
              key={prop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group relative bg-white rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl gentle-animation"
            >
              <Link to={`/properties/${prop.id}`} className="block cursor-pointer">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={prop.image} alt={prop.title} loading="lazy"
                    className="w-full h-full object-cover gentle-animation group-hover:scale-105" />
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-800">{prop.category}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      toggleLike(prop.id)
                    }}
                    className="absolute top-4 right-4 z-30 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm"
                  >
                    <Heart className={`w-4 h-4 transition-colors ${likedIds.includes(prop.id) ? 'fill-red-500 text-red-500' : 'text-slate-900'}`} />
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] mb-2 font-bold uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5" />
                    {prop.location}
                  </div>
                  <h3 className="font-display text-xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-blue-600 gentle-animation">{prop.title}</h3>
                  <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-sm font-bold text-slate-900">{prop.rating}</span>
                      <span className="text-[10px] text-slate-400 font-medium">({prop.reviews})</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-slate-900">${prop.price}</span>
                      <span className="text-[10px] text-slate-400 block font-bold">/ night</span>
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
