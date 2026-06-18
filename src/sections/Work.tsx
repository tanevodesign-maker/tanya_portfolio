import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'

const filters = ['Selected', 'Product', 'Visual', 'Front End'] as const

type Project = {
  title: string
  client: string
  year: string
  tag: string
  image: string
}

const img = {
  a: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80',
  b: 'https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?w=800&q=80',
  c: 'https://images.unsplash.com/photo-1618004652321-13a63e576b80?w=800&q=80',
  d: 'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=800&q=80',
  e: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&q=80',
  f: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
  g: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&q=80',
  h: 'https://images.unsplash.com/photo-1618220252344-8ec99ec624b1?w=800&q=80',
}

// Four cards per tab.
const projectsByTab: Record<(typeof filters)[number], Project[]> = {
  Selected: [
    { title: 'Halcyon Type Foundry', client: 'Halcyon', year: '2025', tag: 'Identity', image: img.a },
    { title: 'Quanta Dashboard', client: 'Quanta', year: '2024', tag: 'Product', image: img.e },
    { title: 'Bloom Cold Brew', client: 'Bloom Coffee', year: '2025', tag: 'Campaign', image: img.b },
    { title: 'Parsec Mobile OS', client: 'Parsec', year: '2023', tag: 'Product', image: img.h },
  ],
  Product: [
    { title: 'Quanta Dashboard', client: 'Quanta', year: '2024', tag: 'Product', image: img.e },
    { title: 'Parsec Mobile OS', client: 'Parsec', year: '2023', tag: 'Product', image: img.h },
    { title: 'Northwind Commerce', client: 'Northwind', year: '2024', tag: 'Product', image: img.d },
    { title: 'Orbital Summer Drop', client: 'Orbital', year: '2023', tag: 'Product', image: img.g },
  ],
  Visual: [
    { title: 'Halcyon Type Foundry', client: 'Halcyon', year: '2025', tag: 'Visual', image: img.a },
    { title: 'Bloom Cold Brew', client: 'Bloom Coffee', year: '2025', tag: 'Visual', image: img.b },
    { title: 'Drift Outerwear', client: 'Drift', year: '2024', tag: 'Visual', image: img.f },
    { title: 'Polaris Navigation Kit', client: 'Polaris', year: '2024', tag: 'Visual', image: img.c },
  ],
  'Front End': [
    { title: 'Quanta Dashboard', client: 'Quanta', year: '2024', tag: 'Front End', image: img.e },
    { title: 'Northwind Commerce', client: 'Northwind', year: '2024', tag: 'Front End', image: img.d },
    { title: 'Polaris Navigation Kit', client: 'Polaris', year: '2024', tag: 'Front End', image: img.c },
    { title: 'Parsec Mobile OS', client: 'Parsec', year: '2023', tag: 'Front End', image: img.h },
  ],
}

export default function Work() {
  const [active, setActive] = useState<(typeof filters)[number]>('Selected')
  const sectionRef = useRef<HTMLElement>(null)

  const visible = projectsByTab[active]

  // The nav's "Work" dropdown dispatches this with a tab name — open that tab
  // and scroll the Work section into view.
  useEffect(() => {
    const onNavigate = (e: Event) => {
      const tab = (e as CustomEvent<string>).detail
      if ((filters as readonly string[]).includes(tab)) {
        setActive(tab as (typeof filters)[number])
      }
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    window.addEventListener('work:navigate', onNavigate)
    return () => window.removeEventListener('work:navigate', onNavigate)
  }, [])

  return (
    <section
      ref={sectionRef}
      id="work"
      className="flex min-h-screen w-full scroll-mt-24 items-start bg-[#FBFBFB] px-[72px] py-12 sm:py-16"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6 flex flex-col items-center gap-6 text-center sm:mb-8"
        >
          <h2 className="max-w-3xl font-serif text-[40px] font-medium leading-[1.05] tracking-tight text-neutral-900 lg:text-[52px]">
            What I've Been Working On
          </h2>
        </motion.div>

        <div className="flex justify-center">
          <div className="relative inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-100 p-1.5">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`relative isolate cursor-pointer rounded-full px-5 py-2 text-sm transition-colors ${
                  active === f
                    ? 'font-semibold text-neutral-900'
                    : 'font-medium text-neutral-500 hover:text-neutral-800'
                }`}
              >
                {active === f && (
                  <motion.span
                    layoutId="work-pill"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    className="absolute inset-0 -z-10 rounded-full bg-white shadow-sm"
                  />
                )}
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((p) => (
              <motion.a
                key={`${active}-${p.title}`}
                href="#"
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  layout: {
                    type: 'spring',
                    stiffness: 260,
                    damping: 30,
                    mass: 0.8,
                  },
                  opacity: { duration: 0.25, ease: 'easeOut' },
                }}
                whileHover="hover"
                className="group flex flex-col gap-4"
              >
                <div className="relative aspect-[2/1] overflow-hidden rounded-2xl bg-neutral-100">
                  <motion.img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    variants={{ hover: { scale: 1.05 } }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <motion.div
                    variants={{ hover: { opacity: 1, y: 0 } }}
                    initial={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white text-neutral-900 shadow-md"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </motion.div>
                  <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium tracking-[0.15em] text-neutral-900 uppercase backdrop-blur-sm">
                      {p.tag}
                    </span>
                  </div>
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <h3 className="truncate text-base font-semibold text-neutral-900 sm:text-lg">
                      {p.title}
                    </h3>
                    <span className="text-xs text-neutral-500">
                      {p.client}
                    </span>
                  </div>
                  <span className="shrink-0 text-xs tracking-[0.15em] text-neutral-400">
                    {p.year}
                  </span>
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
