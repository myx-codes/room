import { motion } from 'framer-motion'
import { CalendarCheck, KeyRound, Search } from 'lucide-react'
import { useI18n } from '@/i18n'

export function HowItWorks() {
  const { t } = useI18n()

  const steps = [
    {
      icon: Search,
      title: t('howItWorks.discover'),
      description: t('howItWorks.discoverDesc'),
      accent: 'from-[#f3d8b0] to-[#be8a51]',
    },
    {
      icon: CalendarCheck,
      title: t('howItWorks.reserve'),
      description: t('howItWorks.reserveDesc'),
      accent: 'from-[#d6eadf] to-[#4e8c77]',
    },
    {
      icon: KeyRound,
      title: t('howItWorks.arrive'),
      description: t('howItWorks.arriveDesc'),
      accent: 'from-[#d8dde9] to-[#6c7ba1]',
    },
  ]

  const metrics = [
    { value: '320+', label: t('howItWorks.curatedProperties') },
    { value: '24/7', label: t('howItWorks.bookingSupport') },
    { value: '4.9/5', label: t('howItWorks.averageGuestScore') },
  ]

  return (
    <section id="how-it-works" className="px-6 py-24 sm:py-28">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.75rem] bg-primary px-6 py-14 text-primary-foreground shadow-[0_28px_80px_-42px_rgba(7,14,12,0.72)] sm:px-10 lg:px-12">
        <div className="pointer-events-none absolute -left-12 top-8 h-40 w-40 rounded-full bg-[radial-gradient(circle,_rgba(241,216,179,0.22),_transparent_70%)] blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-52 w-52 rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.12),_transparent_70%)] blur-2xl" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f1d8b3]">{t('howItWorks.eyebrow')}</p>
          <h2 className="mt-4 text-4xl font-bold text-white sm:text-5xl">{t('howItWorks.title')}</h2>
          <p className="mt-5 text-base text-white/68 sm:text-lg">
            {t('howItWorks.description')}
          </p>
        </motion.div>

        <div className="relative mt-14">
          <div className="absolute left-1/2 top-8 hidden h-px w-[72%] -translate-x-1/2 bg-white/12 lg:block" />

          <div className="grid gap-6 lg:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                className="relative rounded-[2rem] border border-white/10 bg-white/7 p-7 backdrop-blur-md"
              >
                <div className="mb-8 flex items-center justify-between">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-gradient-to-br ${step.accent} text-slate-900 shadow-lg`}
                  >
                    <step.icon className="h-7 w-7" />
                  </div>
                  <span className="text-sm font-semibold tracking-[0.2em] text-white/42">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="text-2xl font-semibold text-white">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/64">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mt-10 grid gap-4 rounded-[2rem] border border-white/10 bg-black/14 p-5 sm:grid-cols-3"
        >
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-[1.5rem] border border-white/6 bg-white/6 px-5 py-4">
              <p className="text-3xl font-semibold text-[#f1d8b3]">{metric.value}</p>
              <p className="mt-1 text-sm text-white/60">{metric.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
