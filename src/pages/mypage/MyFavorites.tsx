import { properties } from '@/data/mockData'
import { Star, MapPin, Heart } from 'lucide-react'

export default function MyFavorites() {
  // Mock: user has favorited properties 1 and 3
  const favorites = properties.filter((p) => ['1', '3'].includes(p.id))

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-foreground">Favorites</h2>
        <p className="text-sm text-muted-foreground mt-1">{favorites.length} saved properties</p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-2xl">
          <p className="text-muted-foreground">No favorites yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favorites.map((p) => (
            <div key={p.id} className="bg-card border border-border rounded-2xl overflow-hidden group">
              <div className="relative aspect-[16/9] overflow-hidden">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover gentle-animation group-hover:scale-105" />
                <button className="absolute top-3 right-3 p-2 bg-card/90 backdrop-blur-sm rounded-full">
                  <Heart className="w-4 h-4 text-gold fill-gold" />
                </button>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
                  <MapPin className="w-3.5 h-3.5" />{p.location}
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{p.title}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-gold fill-gold" />
                    <span className="text-sm font-medium text-foreground">{p.rating}</span>
                  </div>
                  <span className="font-semibold text-foreground">${p.price}/night</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
