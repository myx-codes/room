import { properties } from '@/data/mockData'
import { Star, MapPin, Pencil, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AgentProperties() {
  // Filter by agent — mock showing agent a1's properties
  const myProperties = properties.filter((p) => p.agentId === 'a1')

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">My Properties</h2>
          <p className="text-sm text-muted-foreground mt-1">{myProperties.length} listings</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 gentle-animation">
          <Plus className="w-4 h-4" />
          Add Listing
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myProperties.map((p) => (
          <div key={p.id} className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="relative aspect-[16/9] overflow-hidden">
              <Link to={`/properties/${p.id}`} className="block h-full">
                <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
              </Link>
              <span className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium capitalize text-foreground">{p.category}</span>
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
                  <span className="text-xs text-muted-foreground">({p.reviews})</span>
                </div>
                <span className="font-semibold text-foreground">${p.price}/night</span>
              </div>
              <button className="mt-4 w-full flex items-center justify-center gap-2 border border-border text-foreground px-4 py-2 rounded-xl text-sm font-medium hover:bg-muted gentle-animation">
                <Pencil className="w-4 h-4" />
                Edit Listing
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
