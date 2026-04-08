import { motion, type Variants } from 'framer-motion'
import { Star, Heart, MapPin, ArrowRight, ShieldCheck, Volume2, VolumeX, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { Link } from 'react-router-dom'
import { GET_PROPERTIES } from '@/graphql/user/query'
import { usePropertyRatings } from '@/hooks/usePropertyRatings'

const categories = [
  { title: "Exclusive Villas", type: "villa", sub: "Private Retreats", color: "text-amber-600", bg: "bg-amber-600" },
  { title: "Premium Hotels", type: "hotel", sub: "Luxury Stays", color: "text-blue-600", bg: "bg-blue-600" },
  { title: "Wellness Resorts", type: "sanatorium", sub: "Health & Healing", color: "text-emerald-600", bg: "bg-emerald-600" }
]

type PropertyCategory = 'villa' | 'hotel' | 'sanatorium'

type FeaturedProperty = {
  id: string
  title: string
  location: string
  price: number
  rating: number
  ratingCount: number
  image: string
  category: PropertyCategory
  sanatoriumMeta?: SanatoriumMeta
}

type SanatoriumMeta = {
  badge: string
  quote: string
  highlights: Array<{
    label: string
    desc: string
  }>
}

type GetPropertiesResponse = {
  getProperties: {
    list: Array<{
      _id: string
      propertyType: string
      propertyLocation: string
      propertyTitle: string
      propertyPrice: number
      propertyRank?: number
      propertyRatingCount?: number
      propertyComments: number
      propertyImages: string[]
      propertyDesc?: string | null
    }>
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

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1]
const SANATORIUM_META_MARKER = 'ROOMI_SANATORIUM_META:'
const DEFAULT_SANATORIUM_META: SanatoriumMeta = {
  badge: 'Wellness & Spa',
  quote: 'Experience the perfect harmony of nature and modern medicine in our exclusive retreats.',
  highlights: [
    { label: 'Mineral Source', desc: 'Healing Waters' },
    { label: 'Detox Menu', desc: 'Organic Nutrition' },
    { label: 'Yoga Zen', desc: 'Mental Health' },
    { label: 'Expert Care', desc: '24/7 Support' },
  ],
}

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

function parseSanatoriumMeta(description?: string | null): SanatoriumMeta | undefined {
  if (!description) return undefined

  const match = description.match(new RegExp(`${SANATORIUM_META_MARKER}([^\\n]+)`))
  if (!match) return undefined

  try {
    const raw = String(match[1] || '').trim()

    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(raw) as Record<string, unknown>
    } catch {
      parsed = JSON.parse(decodeURIComponent(raw)) as Record<string, unknown>
    }

    const badgeCandidate = typeof parsed.badge === 'string' ? parsed.badge : typeof parsed.b === 'string' ? parsed.b : ''
    const quoteCandidate = typeof parsed.quote === 'string' ? parsed.quote : typeof parsed.q === 'string' ? parsed.q : ''

    const rawHighlights = Array.isArray(parsed.highlights)
      ? parsed.highlights
      : Array.isArray(parsed.h)
        ? parsed.h.map((item) =>
            Array.isArray(item)
              ? { label: String(item[0] ?? ''), desc: String(item[1] ?? '') }
              : item,
          )
        : []

    const highlights = rawHighlights
      .map((item) => {
        if (item && typeof item === 'object') {
          const record = item as Record<string, unknown>
          return {
            label: String(record.label || '').trim(),
            desc: String(record.desc || '').trim(),
          }
        }

        return { label: '', desc: '' }
      })
      .filter((item) => item.label && item.desc)

    if (!badgeCandidate.trim() || !quoteCandidate.trim() || highlights.length === 0) {
      return undefined
    }

    return {
      badge: badgeCandidate.trim(),
      quote: quoteCandidate.trim(),
      highlights,
    }
  } catch {
    return undefined
  }
}

function formatLocation(value: string): string {
  return value
    .toLowerCase()
    .split('_')
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(' ')
}

function mapToFeaturedProperty(item: GetPropertiesResponse['getProperties']['list'][number]): FeaturedProperty {
  return {
    id: item._id,
    title: item.propertyTitle,
    location: formatLocation(item.propertyLocation),
    price: item.propertyPrice,
    rating: item.propertyRank || 0,
    ratingCount: item.propertyRatingCount ?? item.propertyComments ?? 0,
    image: resolveImageUrl(item.propertyImages?.[0]),
    category: mapPropertyType(item.propertyType),
    sanatoriumMeta: parseSanatoriumMeta(item.propertyDesc),
  }
}

// Reusable animation variant for cascading elements
const cascadeVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeOutExpo, delay: i }
  })
}

export function FeaturedProperties() {
  const { data, loading, error } = useQuery<GetPropertiesResponse, GetPropertiesVariables>(GET_PROPERTIES, {
    variables: {
      input: {
        page: 1,
        limit: 100,
        sort: 'createdAt',
        direction: 'DESC',
        search: {},
      },
    },
    fetchPolicy: 'network-only',
  })

  const allProperties = (data?.getProperties?.list || []).map(mapToFeaturedProperty)
  const propertyIds = useMemo(() => allProperties.map((property) => property.id), [allProperties])
  const ratingsById = usePropertyRatings(propertyIds)
  const allPropertiesWithDbRatings = useMemo(
    () =>
      allProperties.map((property) => {
        const dbRating = ratingsById[property.id]
        if (!dbRating) return property

        return {
          ...property,
          rating: dbRating.rating,
          ratingCount: dbRating.ratingCount,
        }
      }),
    [allProperties, ratingsById],
  )

  return (
    <section id="featured" className="py-24 px-6 bg-[#fcfcfd] overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-40">
        {loading && <p className="text-sm text-slate-500">Loading featured properties...</p>}
        {error && <p className="text-sm text-red-600">Failed to load properties: {error.message}</p>}

        {categories.map((cat) => {
          const filteredProps = allPropertiesWithDbRatings
            .filter((p) => p.category === cat.type)
            .slice(0, 4)

          if (filteredProps.length === 0) return null;

          return (
            <div key={cat.type} className="space-y-16">
              {/* HEADER SECTION */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '40px' }}
                    transition={{ duration: 0.8 }}
                    className={`h-1 ${cat.bg} mb-4 rounded-full`}
                  />
                  <span className={`${cat.color} text-[10px] tracking-[0.3em] uppercase font-bold block mb-2`}>
                    {cat.sub}
                  </span>
                  <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 tracking-tight italic">
                    {cat.title}
                  </h2>
                </div>
                <Link to={`/properties?type=${cat.type}`} className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors text-sm font-semibold">
                  View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* DYNAMIC LAYOUTS */}
              {cat.type === 'villa' ? (
                <VillaVideoHeroLayout properties={filteredProps} />
              ) : cat.type === 'sanatorium' ? (
                <div className="space-y-32">
                  {filteredProps.slice(0, 2).map((prop, i) => (
                    <SanatoriumWideCard key={prop.id} prop={prop} index={i} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProps.slice(0, 3).map((prop, i) => (
                    <PropertyCard key={prop.id} prop={prop} index={i} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  )
}

// --- 1. VILLA LAYOUT: FULL WIDTH VIDEO + 3 CARDS BELOW ---
function VillaVideoHeroLayout({ properties }: { properties: FeaturedProperty[] }) {
  const mainVilla = properties[0];
  const sideVillas = properties.slice(1, 4);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="space-y-10">
      <motion.div 
        className="relative w-full h-[550px] lg:h-[650px] rounded-[3rem] overflow-hidden shadow-2xl"
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <video autoPlay muted={isMuted} loop playsInline className="w-full h-full object-cover">
          <source src="/videos/villa.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <button onClick={() => setIsMuted(!isMuted)} className="absolute top-8 right-8 z-30 p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all">
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        <div className="absolute bottom-10 left-10 right-10 flex items-end justify-between">
          <div className="text-white space-y-2">
            <h3 className="text-4xl font-bold">{mainVilla.title}</h3>
            <p className="flex items-center gap-2 opacity-80 text-sm"><MapPin className="w-4 h-4" /> {mainVilla.location}</p>
          </div>
          <Link to={`/properties/${mainVilla.id}`} className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-amber-500 hover:text-white transition-all shadow-xl">
            Book Now
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sideVillas.map((prop, i) => (
          <PropertyCard key={prop.id} prop={prop} index={i} compact />
        ))}
      </div>
    </div>
  );
}

// --- 2. SANATORIUM WIDE CARD: FULLY ANIMATED ---
function SanatoriumWideCard({ prop, index }: { prop: FeaturedProperty; index: number }) {
  const isEven = index % 2 === 0;
  const sanatoriumMeta = prop.sanatoriumMeta || DEFAULT_SANATORIUM_META;

  return (
    <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16 lg:gap-24`}>
      {/* Visual Side */}
      <motion.div 
        className="w-full lg:w-3/5 relative group"
        initial={{ opacity: 0, x: isEven ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease: easeOutExpo }}
      >
        <div className="absolute -inset-4 bg-emerald-50 rounded-[4rem] -z-10 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-700" />
        <div className="relative h-[480px] rounded-[3.5rem] overflow-hidden shadow-2xl border-[6px] border-white">
          <motion.img src={prop.image} className="w-full h-full object-cover" whileHover={{ scale: 1.05 }} transition={{ duration: 1.5 }} />
        </div>
        
        {/* Floating Verified Badge (Animated) */}
        <motion.div 
          custom={0.6} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={cascadeVariants}
          className={`absolute -bottom-8 ${isEven ? 'right-10' : 'left-10'} bg-white p-6 rounded-[2rem] shadow-xl hidden md:block border border-emerald-50 z-20`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest leading-none mb-1">Verified</p>
              <p className="text-slate-900 font-bold text-sm">Health Sanctuary</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Content Side (Cascading Animations) */}
      <div className="w-full lg:w-2/5 space-y-8">
        <motion.div custom={0.2} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={cascadeVariants}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-100 mb-4">
            <Sparkles className="w-3.5 h-3.5" /> {sanatoriumMeta.badge}
          </div>
          <h3 className="text-4xl font-display font-bold text-slate-900 leading-tight">{prop.title}</h3>
        </motion.div>
        
        <motion.p custom={0.4} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={cascadeVariants}
          className="text-slate-500 text-lg leading-relaxed font-light italic"
        >
          "{sanatoriumMeta.quote}"
        </motion.p>
        
        <div className="grid grid-cols-2 gap-4">
          {sanatoriumMeta.highlights.slice(0, 4).map((item, i) => (
            <motion.div key={i} custom={0.5 + i * 0.1} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={cascadeVariants}
              className="p-4 bg-white rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all shadow-sm"
            >
              <span className="block font-bold text-slate-900 text-base">{item.label}</span>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">{item.desc}</span>
            </motion.div>
          ))}
        </div>

        <motion.div custom={0.9} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={cascadeVariants} className="pt-4">
          <Link to={`/properties/${prop.id}`} className="group flex items-center justify-center lg:justify-start gap-4 text-emerald-600 font-bold text-lg">
            View Sanctuary Details <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

// --- 3. STANDARD PROPERTY CARD (Hotel/Villa secondary) ---
function PropertyCard({ prop, index, compact = false }: { prop: FeaturedProperty; index: number; compact?: boolean }) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`group bg-white overflow-hidden border border-slate-100 transition-all ${compact ? 'rounded-3xl' : 'rounded-[2rem] shadow-sm hover:shadow-xl'}`}
    >
      <div className={`relative ${compact ? 'aspect-[16/10]' : 'aspect-[16/11]'} overflow-hidden`}>
        <img src={prop.image} alt={prop.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <button onClick={() => setIsLiked(!isLiked)} className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center">
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-slate-900'}`} />
        </button>
        <div className="absolute top-4 left-4 bg-white/95 px-3 py-1.5 rounded-xl border border-slate-100/50">
          <span className="text-[12px] font-black uppercase tracking-widest text-slate-900">{prop.category}</span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-1 text-slate-400 text-[10px] mb-2 font-bold uppercase tracking-widest"><MapPin className="w-3 h-3" /> {prop.location}</div>
        <h3 className="text-xl font-bold text-slate-900 mb-5 truncate group-hover:text-blue-600 transition-colors">{prop.title}</h3>
        <div className="flex items-center justify-between pt-5 border-t border-slate-50">
          <div className="flex items-center gap-1">
            {prop.ratingCount > 0 ? (
              <>
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span className="text-sm font-bold">{prop.rating.toFixed(1)}</span>
                <span className="text-[10px] text-slate-400 font-medium">({prop.ratingCount} ta baho)</span>
              </>
            ) : (
              <span className="text-[10px] text-slate-400 font-medium"></span>
            )}
          </div>
          <div className="text-right leading-none"><span className="text-xl font-bold">${prop.price}</span><span className="text-[10px] text-slate-400 ml-1 font-bold">/ NIGHT</span></div>
        </div>
      </div>
    </motion.div>
  );
}