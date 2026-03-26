export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <span className="font-display text-2xl font-bold tracking-tight">
              ROOM<span style={{ color: 'var(--gold)' }}>i</span>
            </span>
            <p className="text-primary-foreground/60 text-sm mt-4 leading-relaxed">
              Premium travel booking for villas, hotels, and health sanatoriums across Central Asia and beyond.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold mb-4 tracking-wide">Explore</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/60">
              <li><a href="#" className="hover:text-primary-foreground gentle-animation">Villas & Dachas</a></li>
              <li><a href="#" className="hover:text-primary-foreground gentle-animation">Hotels</a></li>
              <li><a href="#" className="hover:text-primary-foreground gentle-animation">Sanatoriums</a></li>
              <li><a href="#" className="hover:text-primary-foreground gentle-animation">All Destinations</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold mb-4 tracking-wide">Company</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/60">
              <li><a href="#" className="hover:text-primary-foreground gentle-animation">About Us</a></li>
              <li><a href="#" className="hover:text-primary-foreground gentle-animation">Careers</a></li>
              <li><a href="#" className="hover:text-primary-foreground gentle-animation">Blog</a></li>
              <li><a href="#" className="hover:text-primary-foreground gentle-animation">Press</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold mb-4 tracking-wide">Support</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/60">
              <li><a href="#" className="hover:text-primary-foreground gentle-animation">Help Center</a></li>
              <li><a href="#" className="hover:text-primary-foreground gentle-animation">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-foreground gentle-animation">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary-foreground gentle-animation">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/40 text-xs">
            © {new Date().getFullYear()} ROOMi. All rights reserved.
          </p>
          <div className="flex gap-6 text-primary-foreground/40 text-xs">
            <a href="#" className="hover:text-primary-foreground gentle-animation">Instagram</a>
            <a href="#" className="hover:text-primary-foreground gentle-animation">Telegram</a>
            <a href="#" className="hover:text-primary-foreground gentle-animation">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
