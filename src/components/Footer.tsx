import { Link } from 'react-router-dom'
import { useI18n } from '@/i18n'

export function Footer() {
  const { t } = useI18n()

  const exploreLinks = [
    { label: t('categories.villasTitle'), to: '/properties?category=villa' },
    { label: t('categories.hotelsTitle'), to: '/properties?category=hotel' },
    { label: t('categories.sanatoriumsTitle'), to: '/properties?category=sanatorium' },
    { label: t('footer.allProperties'), to: '/properties' },
  ]

  const companyLinks = [
    { label: t('footer.aboutRoomi'), to: '/' },
    { label: t('hero.createAccount'), to: '/sign-up' },
    { label: t('common.signIn'), to: '/sign-in' },
    { label: t('common.myAccount'), to: '/my-page' },
  ]

  const socialLinks = [
    { label: 'Instagram', href: '#' },
    { label: 'Telegram', href: '#' },
    { label: 'Facebook', href: '#' },
  ]

  return (
    <footer className="px-6 pb-8 pt-4">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-[#0d1f1c] px-6 py-12 text-primary-foreground shadow-[0_28px_80px_-44px_rgba(7,14,12,0.85)] sm:px-10">
        <div className="grid gap-10 border-b border-white/10 pb-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f1d8b3]">
              {t('footer.eyebrow')}
            </div>
            <span className="mt-6 block font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              ROOM<span className="text-gold">i</span>
            </span>
            <p className="mt-4 text-sm leading-7 text-white/62">
              {t('footer.description')}
            </p>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold text-white">{t('footer.explore')}</h4>
            <div className="mt-5 space-y-3 text-sm text-white/60">
              {exploreLinks.map((link) => (
                <Link key={link.label} to={link.to} className="block transition-colors hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold text-white">{t('footer.account')}</h4>
            <div className="mt-5 space-y-3 text-sm text-white/60">
              {companyLinks.map((link) => (
                <Link key={link.label} to={link.to} className="block transition-colors hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/38">
            © {new Date().getFullYear()} ROOMi. {t('footer.crafted')}
          </p>

          <div className="flex flex-wrap gap-2">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-medium text-white/56 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
