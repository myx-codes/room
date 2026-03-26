import { motion } from 'framer-motion'
import { Search, CalendarCheck, KeyRound } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'Discover',
    description: 'Browse our curated collection of villas, hotels, and sanatoriums across stunning destinations.',
  },
  {
    icon: CalendarCheck,
    title: 'Book',
    description: 'Choose your dates, select your room, and secure your reservation in just a few clicks.',
  },
  {
    icon: KeyRound,
    title: 'Enjoy',
    description: 'Arrive and experience world-class hospitality. Your perfect getaway is ready and waiting.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 sm:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-gold text-sm tracking-[0.2em] uppercase font-medium mb-4">Simple & Seamless</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground">
            How It Works
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-secondary flex items-center justify-center">
                <step.icon className="w-7 h-7 text-gold" />
              </div>
              <div className="text-xs text-muted-foreground font-medium mb-3 tracking-widest">STEP {i + 1}</div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
