import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  PenTool,
  Sliders,
  Sparkles,
  LifeBuoy,
  FileText,
  Menu,
  X,
  MessageCircle,
  ArrowUpRight,
} from 'lucide-react'

/**
 * Fixed top navigation (adapted from React Bits "navigation-2" / Flowbase).
 * Centered at the top with a whitish glass treatment: white borders, black
 * text, black CTA. Hidden through the opening-experience zoom; always visible
 * once the hero locks in; past the hero it slides up on scroll down and comes
 * back down on scroll up.
 */
export default function Navigation() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  // Hidden while the opening-experience zoom plays (scroll < 1.8x viewport),
  // visible once the hero locks in (1.8x–4x). See evaluate() below.
  const [revealed, setRevealed] = useState(
    () => typeof window !== 'undefined' && window.scrollY >= window.innerHeight * 1.8,
  )

  const menuItems = {
    Product: [
      {
        icon: Calendar,
        title: 'Plan',
        description: 'Plan your day your way',
        href: '#',
      },
      {
        icon: PenTool,
        title: 'Write',
        description: 'One Writing Experience, Every Device',
        href: '#',
      },
      {
        icon: Sliders,
        title: 'Organize',
        description: 'Structure that adapts to Your thinking',
        href: '#',
      },
      {
        icon: Sparkles,
        title: 'Customize',
        description: 'Make it unmistakably yours',
        href: '#',
      },
    ],
    Community: [
      {
        icon: Sparkles,
        title: "What's New",
        description: 'Latest updates and features',
        href: '#',
      },
      {
        icon: LifeBuoy,
        title: 'Help and Support',
        description: 'Get help when you need it',
        href: '#',
      },
      {
        icon: FileText,
        title: 'Blog',
        description: 'Stories and insights',
        href: '#',
      },
      {
        icon: MessageCircle,
        title: 'Discord',
        description: 'Chat and connect',
        href: '#',
      },
    ],
  }

  useEffect(() => {
    // The 500vh opening container produces ~4x viewport-height of scroll travel
    // (500vh − 100vh sticky). The polaroid zoom (the "opening experience") runs
    // until the hero locks in at scroll progress ~0.45 ≈ 1.8x; from there to 4x
    // is the hero proper.
    const evaluate = (y: number, delta: number) => {
      const vh = window.innerHeight
      if (y < vh * 1.8) return false // opening experience — keep hidden
      if (y < vh * 4) return true // hero — always visible
      // Exiting toward the next section (and beyond): the nav slides up + fades
      // on scroll down, and reappears on scroll up.
      return delta < 0
    }

    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      const delta = y - lastY
      // Ignore tiny jitters so the nav doesn't flicker.
      if (Math.abs(delta) < 6) return
      setRevealed(evaluate(y, delta))
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.div
      initial={false}
      animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : -110 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ pointerEvents: revealed ? 'auto' : 'none' }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <nav className="relative z-10 w-full px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto w-full max-w-[1400px]">
          {/* Desktop Navigation */}
          <motion.div
            className="relative mx-auto hidden lg:block"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            onMouseLeave={() => setActiveMenu(null)}
          >
            {/* Nav Container - whitish glass, white border. Pill by default;
                rounds into a rectangle while a dropdown (Work/Others) is open. */}
            <div
              className={`mx-auto w-fit overflow-hidden border border-white/40 bg-white/20 shadow-xl backdrop-blur-2xl ${
                activeMenu ? 'rounded-3xl' : 'rounded-full'
              }`}
            >
              {/* Main Nav Bar */}
              <div className="flex items-center justify-between gap-2 py-3 pr-3 pl-6">
                {/* Logo */}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    window.dispatchEvent(new Event('opening:return'))
                  }}
                  className="text-tighter mr-6 flex items-center gap-2 text-base font-semibold text-neutral-900"
                >
                  <img src="/favicon.svg" alt="" className="h-5 w-5" />
                  Tanya Das
                </a>

                {/* Nav Links */}
                <div className="flex items-center gap-1">
                  <button
                    onMouseEnter={() => setActiveMenu('Product')}
                    className={`rounded-full px-4 py-2 text-sm tracking-tight hover:text-neutral-700 ${
                      activeMenu === 'Product'
                        ? 'font-bold text-neutral-700'
                        : 'font-light text-neutral-900'
                    }`}
                  >
                    Work
                  </button>
                  <a
                    href="#"
                    className="rounded-full px-4 py-2 text-sm font-light tracking-tight text-neutral-900 no-underline hover:font-bold hover:text-neutral-700"
                    onMouseEnter={() => setActiveMenu(null)}
                  >
                    Testimonial
                  </a>
                  <button
                    onMouseEnter={() => setActiveMenu('Community')}
                    className={`rounded-full px-4 py-2 text-sm tracking-tight hover:text-neutral-700 ${
                      activeMenu === 'Community'
                        ? 'font-bold text-neutral-700'
                        : 'font-light text-neutral-900'
                    }`}
                  >
                    Others
                  </button>
                </div>

                {/* Right Side Actions */}
                <div className="ml-6 flex items-center gap-2">
                  <a
                    href="#"
                    className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-light tracking-tight text-neutral-900 no-underline transition-colors hover:bg-white/60 hover:text-black"
                    onMouseEnter={() => setActiveMenu(null)}
                  >
                    Resume
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    className="rounded-full bg-black px-5 py-2 text-sm font-light tracking-tight text-white no-underline hover:bg-neutral-800"
                    onMouseEnter={() => setActiveMenu(null)}
                  >
                    Let's Connect
                  </a>
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {activeMenu && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="p-2">
                      <div className="grid w-full grid-cols-2 gap-3">
                        {menuItems[activeMenu as keyof typeof menuItems].map(
                          (item, index) => {
                            const Icon = item.icon
                            return (
                              <motion.a
                                key={item.title}
                                href={item.href}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.2,
                                  delay: index * 0.05,
                                  ease: 'easeOut',
                                }}
                                className="group flex items-start gap-3 rounded-2xl border border-white/40 bg-white/20 p-4 backdrop-blur-2xl transition-[border-color,box-shadow] duration-200 hover:border-white/80 hover:shadow-md"
                              >
                                <div className="shrink-0 rounded-lg bg-white/60 p-2">
                                  <Icon className="h-5 w-5 text-neutral-900" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3 className="mb-0.5 text-sm font-normal text-neutral-900 transition-colors group-hover:text-black">
                                    {item.title}
                                  </h3>
                                  <p className="text-xs leading-snug text-neutral-700">
                                    {item.description}
                                  </p>
                                </div>
                              </motion.a>
                            )
                          },
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Mobile Navigation */}
          <motion.div
            className="lg:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="overflow-hidden rounded-full border border-white/40 bg-white/20 shadow-xl backdrop-blur-2xl">
              {/* Mobile Nav Bar */}
              <div className="flex items-center justify-between py-3 pr-3 pl-4">
                {/* Logo */}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    window.dispatchEvent(new Event('opening:return'))
                  }}
                  className="text-tighter flex items-center gap-2 text-base font-semibold text-neutral-900"
                >
                  <img src="/favicon.svg" alt="" className="h-5 w-5" />
                  Tanya Das
                </a>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white"
                  aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Mobile Expanded Content */}
              <AnimatePresence>
                {mobileMenuOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pt-2 pb-4">
                      {/* Mobile Menu Content */}
                      <div className="space-y-4">
                        {/* Simple Links */}
                        <div className="space-y-1">
                          <a
                            href="#"
                            className="block px-2 py-2 text-sm font-medium text-neutral-900 no-underline"
                          >
                            Others
                          </a>
                          <a
                            href="#"
                            className="block px-2 py-2 text-sm font-medium text-neutral-900 no-underline"
                          >
                            Resume
                          </a>
                        </div>

                        {/* Mobile CTA */}
                        <div>
                          <a
                            href="#"
                            className="block w-full rounded-full bg-black px-6 py-2.5 text-center text-sm font-medium text-white no-underline"
                          >
                            Let's Connect
                          </a>
                        </div>

                        {/* Product Section */}
                        <div className="pt-2">
                          <h3 className="mb-2 px-2 text-sm font-bold text-neutral-900">
                            Work
                          </h3>
                          <div className="space-y-2">
                            {menuItems.Product.map((item) => {
                              const Icon = item.icon
                              return (
                                <a
                                  key={item.title}
                                  href={item.href}
                                  className="flex items-start gap-3 rounded-xl border border-white/40 bg-white/20 p-3 no-underline backdrop-blur-2xl"
                                >
                                  <div className="shrink-0 rounded-lg bg-white/60 p-2">
                                    <Icon className="h-4 w-4 text-neutral-900" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h4 className="mb-0.5 text-sm font-semibold text-neutral-900">
                                      {item.title}
                                    </h4>
                                    <p className="text-xs text-neutral-700">
                                      {item.description}
                                    </p>
                                  </div>
                                </a>
                              )
                            })}
                          </div>
                        </div>

                        {/* Community Section */}
                        <div>
                          <h3 className="mb-2 px-2 text-sm font-bold text-neutral-900">
                            About
                          </h3>
                          <div className="space-y-2">
                            {menuItems.Community.map((item) => {
                              const Icon = item.icon
                              return (
                                <a
                                  key={item.title}
                                  href={item.href}
                                  className="flex items-start gap-3 rounded-xl border border-white/40 bg-white/20 p-3 no-underline backdrop-blur-2xl"
                                >
                                  <div className="shrink-0 rounded-lg bg-white/60 p-2">
                                    <Icon className="h-4 w-4 text-neutral-900" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h4 className="mb-0.5 text-sm font-semibold text-neutral-900">
                                      {item.title}
                                    </h4>
                                    <p className="text-xs text-neutral-700">
                                      {item.description}
                                    </p>
                                  </div>
                                </a>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </nav>
    </motion.div>
  )
}
