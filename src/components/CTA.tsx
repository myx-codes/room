import { motion } from 'framer-motion'
import heroImage from '@/assets/hero-villa.jpg'

export function CTA() {
  return (
    <section className="relative py-32 sm:py-40 px-6 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Luxury getaway"
          loading="lazy"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        <p className="text-gold text-sm tracking-[0.2em] uppercase font-medium mb-6">Start Your Journey</p>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Ready for an <span className="italic">Unforgettable</span> Experience?
        </h2>
        <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
          Join thousands of travelers who trust ROOMi to find their perfect stay. Sign up and start exploring today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#"
            className="px-8 py-4 bg-white text-foreground rounded-full text-sm font-semibold hover:bg-white/90 gentle-animation"
          >
            Create Free Account
          </a>
          <a
            href="#categories"
            className="px-8 py-4 border border-white/30 text-white rounded-full text-sm font-medium hover:bg-white/10 gentle-animation"
          >
            Browse Properties
          </a>
        </div>
      </motion.div>
    </section>
  )
}
