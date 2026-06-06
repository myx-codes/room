import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'

interface NavItem {
  label: string
  path: string
  icon: ReactNode
}

interface DashboardLayoutProps {
  title: string
  navItems: NavItem[]
  children: ReactNode
  basePath: string
  showTopBar?: boolean
  contextBar?: ReactNode
}

export function DashboardLayout({ title, navItems, children, basePath, showTopBar = true, contextBar }: DashboardLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      {showTopBar && (
        <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-xl border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/')} className="p-2 rounded-lg hover:bg-muted gentle-animation">
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
              <h1 className="font-display text-xl font-bold text-foreground">{title}</h1>
            </div>
            <Link to="/" className="font-display text-lg font-bold text-foreground">
              ROOM<span className="text-gold">i</span>
            </Link>
          </div>
        </header>
      )}

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <aside className={`w-64 shrink-0 border-r border-border p-4 hidden md:block ${showTopBar ? 'min-h-[calc(100vh-65px)]' : 'min-h-screen'}`}>
          <nav className={`flex flex-col gap-1 ${showTopBar ? 'sticky top-[81px]' : 'sticky top-24'}`}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path === basePath && location.pathname === basePath)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium gentle-animation ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Mobile nav */}
        <div className="md:hidden w-full border-b border-border overflow-x-auto">
          <div className="flex gap-1 p-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap gentle-animation ${
                    isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 p-6 md:p-8 min-w-0">
          {contextBar ? <div className="mb-6">{contextBar}</div> : null}
          {children}
        </main>
      </div>
    </div>
  )
}
