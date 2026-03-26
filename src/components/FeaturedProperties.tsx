import { motion } from 'framer-motion'
import { Star, Heart, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { properties as mockProperties } from '@/data/mockData'

const featuredProperties = mockProperties.slice(0, 3)

export function FeaturedProperties() {
  return (
    <section id="featured" className="py-24 sm:py-32 px-6 bg-secondary/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="text-gold text-sm tracking-[0.2em] uppercase font-medium mb-4">Curated for You</p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground">
              Featured Stays
            </h2>
          </div>
          <Link to="/properties" className="hidden sm:inline-flex text-sm font-medium text-foreground hover:text-gold gentle-animation">
            View all →
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((prop, i) => (
            <motion.div
              key={prop.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-card rounded-2xl overflow-hidden subtle-shadow hover:elevated-shadow gentle-animation"
            >
              <Link to={`/properties/${prop.id}`} className="block cursor-pointer">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={prop.image}
                    alt={prop.title}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover gentle-animation group-hover:scale-105"
                  />
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
      </div>
    </section>
  )
}
