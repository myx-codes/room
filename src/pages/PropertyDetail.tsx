import { useMemo, useState, type ElementType, type FormEvent } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
  Wifi,
  Waves,
  Sparkles,
  Car,
  UtensilsCrossed,
  Dumbbell,
  Wind,
  Trees,
  MessageSquare,
  Send,
} from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { properties } from '@/data/mockData'
import villaImg from '@/assets/category-villa.jpg'
import hotelImg from '@/assets/category-hotel.jpg'
import sanatoriumImg from '@/assets/category-sanatorium.jpg'
import heroImg from '@/assets/hero-villa.jpg'

type CommentItem = {
  id: string
  propertyId: string
  name: string
  message: string
  rating: number
  createdAt: string
}

const COMMENTS_STORAGE_KEY = 'roomi_property_comments_v1'

const amenityIcons: Record<string, ElementType> = {
  wifi: Wifi,
  pool: Waves,
  spa: Sparkles,
  parking: Car,
  restaurant: UtensilsCrossed,
  gym: Dumbbell,
  ac: Wind,
  garden: Trees,
}

const amenityLabels: Record<string, string> = {
  wifi: 'Wi-Fi',
  pool: 'Pool',
  spa: 'Spa',
  parking: 'Parking',
  restaurant: 'Restaurant',
  gym: 'Gym',
  ac: 'Air Conditioning',
  garden: 'Garden',
}

const readStoredComments = (): CommentItem[] => {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(COMMENTS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const getGalleryImages = (category: 'villa' | 'hotel' | 'sanatorium', fallback: string) => {
  const byCategory = {
    villa: [fallback, heroImg, villaImg, hotelImg, sanatoriumImg],
    hotel: [fallback, hotelImg, heroImg, sanatoriumImg, villaImg],
    sanatorium: [fallback, sanatoriumImg, heroImg, hotelImg, villaImg],
  }

  return byCategory[category]
}

export default function PropertyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const property = properties.find((p) => p.id === id)
  const [currentImage, setCurrentImage] = useState(0)
  const [showGallery, setShowGallery] = useState(false)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [rating, setRating] = useState(5)
  const [comments, setComments] = useState<CommentItem[]>(readStoredComments)

  const propertyComments = useMemo(
    () => comments.filter((item) => item.propertyId === id),
    [comments, id],
  )

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Property not found.</p>
      </div>
    )
  }

  const images = getGalleryImages(property.category, property.image)

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length)
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length)

  const submitComment = (e: FormEvent) => {
    e.preventDefault()

    const cleanName = name.trim()
    const cleanMessage = message.trim()
    if (!cleanName || !cleanMessage) return

    const newItem: CommentItem = {
      id: crypto.randomUUID(),
      propertyId: property.id,
      name: cleanName,
      message: cleanMessage,
      rating,
      createdAt: new Date().toISOString(),
    }

    const next = [newItem, ...comments]
    setComments(next)
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(next))
    setMessage('')
    setRating(5)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-16">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-muted-foreground hover:text-primary gentle-animation mb-6 inline-flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" /> Back to results
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
          <div
            className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group"
            onClick={() => {
              setCurrentImage(0)
              setShowGallery(true)
            }}
          >
            <img
              src={images[0]}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {images.slice(1, 5).map((img, i) => (
              <div
                key={`${img}-${i}`}
                className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => {
                  setCurrentImage(i + 1)
                  setShowGallery(true)
                }}
              >
                <img
                  src={img}
                  alt={`${property.title} ${i + 2}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-secondary text-secondary-foreground capitalize">
                {property.category}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-gold text-gold" />
                <span className="text-sm font-semibold text-foreground">{property.rating}</span>
                <span className="text-xs text-muted-foreground">({property.reviews} reviews)</span>
              </div>
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              {property.title}
            </h1>
            <div className="flex items-center gap-1 text-muted-foreground mb-8">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{property.location}</span>
            </div>

            <div className="mb-10">
              <h2 className="font-display text-xl font-semibold text-foreground mb-3">Description</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{property.description}</p>
            </div>

            <div className="mb-10">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {property.amenities.map((amenity) => {
                  const Icon = amenityIcons[amenity] || Wifi
                  return (
                    <div key={amenity} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
                      <Icon className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-sm text-foreground">{amenityLabels[amenity] || amenity}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mb-10">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">Location</h2>
              <div className="rounded-2xl overflow-hidden border border-border bg-card">
                <iframe
                  title={`${property.title} location map`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(property.location)}&output=embed`}
                  className="w-full h-[320px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-gold" />
                <h2 className="font-display text-xl font-semibold text-foreground">Guest Comments</h2>
              </div>

              <form onSubmit={submitComment} className="bg-card border border-border rounded-2xl p-5 mb-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                  />
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>{`${r} star${r > 1 ? 's' : ''}`}</option>
                    ))}
                  </select>
                </div>

                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your experience"
                  required
                />

                <Button type="submit" className="w-full sm:w-auto">
                  <Send className="w-4 h-4" />
                  Post Comment
                </Button>
              </form>

              <div className="space-y-4">
                {propertyComments.length === 0 && (
                  <div className="bg-card border border-border rounded-2xl p-5 text-sm text-muted-foreground">
                    No comments yet. Be the first to write one.
                  </div>
                )}

                {propertyComments.map((item) => (
                  <article key={item.id} className="bg-card border border-border rounded-2xl p-5">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < item.rating ? 'text-gold fill-gold' : 'text-muted'}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.message}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-card rounded-2xl p-6 elevated-shadow border border-border">
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-bold text-foreground">${property.price}</span>
                <span className="text-sm text-muted-foreground">/ night</span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block uppercase tracking-wider">
                      Check in
                    </label>
                    <input
                      type="date"
                      className="text-sm w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block uppercase tracking-wider">
                      Check out
                    </label>
                    <input
                      type="date"
                      className="text-sm w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-foreground outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block uppercase tracking-wider">
                    Guests
                  </label>
                  <select className="text-sm w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-foreground outline-none focus:ring-2 focus:ring-primary/30">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>{`${n} guest${n > 1 ? 's' : ''}`}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Button className="w-full h-12 text-base">Book Now</Button>
              <Link
                to="/properties"
                className="block text-center text-sm text-muted-foreground hover:text-foreground mt-3 gentle-animation"
              >
                Continue browsing
              </Link>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          >
            <button
              onClick={() => setShowGallery(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={prevImage}
              className="absolute left-4 md:left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <img
              src={images[currentImage]}
              alt={`${property.title} ${currentImage + 1}`}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl"
            />

            <button
              onClick={nextImage}
              className="absolute right-4 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            <div className="absolute bottom-8 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === currentImage ? 'bg-white scale-125' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}