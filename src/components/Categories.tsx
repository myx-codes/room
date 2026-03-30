import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useQuery } from '@apollo/client/react'
import villaImg from '@/assets/category-villa.jpg'
import hotelImg from '@/assets/category-hotel.jpg'
import sanatoriumImg from '@/assets/category-sanatorium.jpg'
import { GET_PROPERTIES } from '@/graphql/user/query'

const categories = [
  {
    title: 'Villas & Dachas',
    subtitle: 'Private retreats',
    description: 'Secluded countryside estates with pools, gardens, and breathtaking views for an unforgettable escape.',
    image: villaImg,
    count: '240+ properties',
  },
  {
    title: 'Hotels',
    subtitle: 'Boutique luxury',
    description: 'Curated selection of premium hotels blending modern comfort with local charm and hospitality.',
    image: hotelImg,
    count: '180+ properties',
  },
  {
    title: 'Health Sanatoriums',
    subtitle: 'Wellness & healing',
    description: 'Rejuvenating health resorts with thermal springs, medical programs, and holistic wellness treatments.',
    image: sanatoriumImg,
    count: '90+ properties',
  },
]

type GetPropertiesResponse = {
  getProperties: {
    list: Array<{
      propertyType: string
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

export function Categories() {
  const { data } = useQuery<GetPropertiesResponse, GetPropertiesVariables>(GET_PROPERTIES, {
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

  const typeCount = (data?.getProperties?.list || []).reduce<Record<string, number>>((acc, item) => {
    const key = item.propertyType.toUpperCase()
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  const countByCard: Record<string, number> = {
    'Villas & Dachas': typeCount.VILLA || 0,
    Hotels: typeCount.HOTEL || 0,
    'Health Sanatoriums': typeCount.SANATORIUM || 0,
  }

  return (
    <section id="categories" className="py-24 sm:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-gold text-sm tracking-[0.2em] uppercase font-medium mb-4">Explore by Category</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground">
            Find Your <span className="italic">Ideal</span> Stay
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-[3/4]"
            >
              <img
                src={cat.image}
                alt={cat.title}
                loading="lazy"
                width={800}
                height={1000}
                className="absolute inset-0 w-full h-full object-cover gentle-animation group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <p className="text-white/60 text-xs tracking-[0.2em] uppercase mb-2">{cat.subtitle}</p>
                <h3 className="font-display text-3xl font-bold text-white mb-3">{cat.title}</h3>
                <p className="text-white/70 text-sm mb-4 max-w-xs">{cat.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-xs">{countByCard[cat.title]} properties</span>
                  <div className="flex items-center gap-2 text-gold text-sm font-medium group-hover:gap-3 gentle-animation">
                    Browse <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
