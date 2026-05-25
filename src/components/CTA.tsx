import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import heroImage from '@/assets/hero-villa.jpg'
import { useI18n } from '@/i18n'

export function CTA() {
  const { t } = useI18n()

  const benefits = [
    t('cta.benefit1'),
    t('cta.benefit2'),
    t('cta.benefit3'),
  ]

  return (
    <section className="px-6 py-24 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        className="mx-auto grid max-w-7xl overflow-hidden rounded-[2.75rem] border border-white/70 bg-white shadow-[0_32px_90px_-52px_rgba(21,55,50,0.48)] lg:grid-cols-[1fr_0.9fr]"
      >
        <div className="relative overflow-hidden bg-[linear-gradient(145deg,#153732_0%,#1d4d47_100%)] px-6 py-12 text-white sm:px-10 lg:px-12">
          <div className="absolute -left-16 top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,_rgba(241,216,179,0.28),_transparent_70%)] blur-2xl" />
          <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.12),_transparent_68%)] blur-2xl" />

          <div className="relative z-10 max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f1d8b3]">{t('cta.eyebrow')}</p>
            <h2 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl">
              {t('cta.title')}
            </h2>
            <p className="mt-5 text-base text-white/70 sm:text-lg">
              {t('cta.description')}
            </p>

            <div className="mt-8 space-y-3">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3 rounded-[1.25rem] bg-white/8 px-4 py-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f1d8b3] text-slate-900">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <p className="text-sm text-white/72">{benefit}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/sign-up"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f4e3cc]"
              >
                {t('common.createFreeAccount')}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/properties"
                className="inline-flex items-center justify-center rounded-full border border-white/18 bg-white/10 px-6 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-white/16"
              >
                {t('common.browseProperties')}
              </Link>
            </div>
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden">
          <img
            src={heroImage}
            alt="Luxury getaway"
            loading="lazy"
            className="h-full w-full object-cover"
            width={1600}
            height={1200}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,14,12,0.06)_0%,rgba(7,14,12,0.22)_50%,rgba(7,14,12,0.58)_100%)]" />

          <div className="absolute left-6 top-6 rounded-[1.5rem] border border-white/35 bg-white/78 px-5 py-4 backdrop-blur-xl sm:left-8 sm:top-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
              {t('cta.memberAdvantage')}
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{t('cta.fastRebooking')}</p>
            <p className="mt-1 text-sm text-slate-500">{t('cta.savedDates')}</p>
          </div>

          <div className="absolute bottom-6 left-6 right-6 rounded-[1.75rem] border border-white/18 bg-black/28 p-5 text-white backdrop-blur-xl sm:bottom-8 sm:left-8 sm:right-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f1d8b3]">
              {t('cta.premiumRhythm')}
            </p>
            <p className="mt-3 max-w-md text-base text-white/72">
              {t('cta.premiumRhythmDesc')}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
