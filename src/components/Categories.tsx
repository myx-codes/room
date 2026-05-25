import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useQuery } from '@apollo/client/react'
import { Link } from 'react-router-dom'
import villaImg from '@/assets/category-villa.jpg'
import hotelImg from '@/assets/category-hotel.jpg'
import sanatoriumImg from '@/assets/category-sanatorium.jpg'
import { GET_PROPERTY_TYPES } from '@/graphql/user/query'
import { useI18n } from '@/i18n'

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

function CategoryCard({
  title,
  subtitle,
  description,
  image,
  route,
  count,
  large = false,
  delay = 0,
}: {
  title: string
  subtitle: string
  description: string
  image: string
  route: string
  count: number
  large?: boolean
  delay?: number
}) {
  const { t } = useI18n()

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay }}
      className={large ? 'min-h-[620px]' : 'min-h-[300px]'}
    >
      <Link
        to={route}
        className="group relative flex h-full overflow-hidden rounded-[2.25rem] border border-white/70 shadow-[0_28px_80px_-48px_rgba(21,55,50,0.42)]"
      >
        <img
          src={image}
          alt={title}
          loading="lazy"
          width={1200}
          height={large ? 1400 : 800}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,14,12,0.08)_0%,rgba(7,14,12,0.28)_36%,rgba(7,14,12,0.86)_100%)]" />

        <div className="relative flex h-full w-full flex-col justify-between p-6 text-white sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="rounded-full border border-white/16 bg-black/18 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] backdrop-blur-md">
              {subtitle}
            </div>
            <div className="rounded-full border border-white/16 bg-white/12 px-4 py-2 text-xs font-medium backdrop-blur-md">
              {t('categories.placesCount', { count })}
            </div>
          </div>

          <div className={large ? 'max-w-md' : 'max-w-sm'}>
            <h3 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              {title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-white/72 sm:text-base">{description}</p>

            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#f1d8b3]">
              {t('categories.browseCollection')}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function Categories() {
  const { t } = useI18n()
  const { data } = useQuery<GetPropertiesResponse, GetPropertiesVariables>(GET_PROPERTY_TYPES, {
    variables: {
      input: {
        page: 1,
        limit: 100,
        sort: 'createdAt',
        direction: 'DESC',
        search: {},
      },
    },
    fetchPolicy: 'cache-first',
  })

  const typeCount = (data?.getProperties?.list || []).reduce<Record<string, number>>((acc, item) => {
    const key = item.propertyType.toUpperCase()
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  const countByCard: Record<string, number> = {
    villa: typeCount.VILLA || 0,
    hotel: typeCount.HOTEL || 0,
    sanatorium: typeCount.SANATORIUM || 0,
  }

  const categories = [
    {
      key: 'villa',
      title: t('categories.villasTitle'),
      subtitle: t('categories.villasSubtitle'),
      description: t('categories.villasDescription'),
      image: villaImg,
      route: '/properties?category=villa',
    },
    {
      key: 'hotel',
      title: t('categories.hotelsTitle'),
      subtitle: t('categories.hotelsSubtitle'),
      description: t('categories.hotelsDescription'),
      image: hotelImg,
      route: '/properties?category=hotel',
    },
    {
      key: 'sanatorium',
      title: t('categories.sanatoriumsTitle'),
      subtitle: t('categories.sanatoriumsSubtitle'),
      description: t('categories.sanatoriumsDescription'),
      image: sanatoriumImg,
      route: '/properties?category=sanatorium',
    },
  ] as const

  return (
    <section id="categories" className="px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold">{t('categories.eyebrow')}</p>
          <h2 className="mt-4 text-4xl font-bold text-foreground sm:text-5xl">
            {t('categories.title')}
            <span className="ml-3 italic text-gold">{t('categories.titleAccent')}</span>
          </h2>
          <p className="mt-5 text-base text-muted-foreground sm:text-lg">
            {t('categories.description')}
          </p>
        </motion.div>

        <div className="premium-panel mt-12 rounded-[2.5rem] p-4 sm:p-5 lg:p-6">
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <CategoryCard
              {...categories[0]}
              count={countByCard[categories[0].key]}
              large
              delay={0}
            />

            <div className="grid gap-5">
              {categories.slice(1).map((category, index) => (
                <CategoryCard
                  key={category.key}
                  {...category}
                  count={countByCard[category.key]}
                  delay={0.12 + index * 0.1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
