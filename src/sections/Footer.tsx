import { motion } from 'framer-motion'
import TextPressure from '../components/TextPressure'

const socials = [
  {
    key: 'x',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    key: 'ig',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: 'yt',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 4 12 4 12 4s-7.5 0-9.4.4A3 3 0 0 0 .5 6.5C0 8.4 0 12 0 12s0 3.6.5 5.5a3 3 0 0 0 2.1 2.1C4.5 20 12 20 12 20s7.5 0 9.4-.4a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.5.5-5.5s0-3.6-.5-5.5zM9.6 15.6V8.4l6.4 3.6z" />
      </svg>
    ),
  },
  {
    key: 'li',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zm7 0h3.8v1.7h.05c.53-1 1.84-2.05 3.78-2.05 4.04 0 4.78 2.66 4.78 6.12V21h-4v-5.5c0-1.3-.02-3-1.83-3s-2.11 1.43-2.11 2.9V21h-4z" />
      </svg>
    ),
  },
]

const cols = [
  {
    title: 'Explore',
    links: ['Work', 'About', 'Playground'],
  },
  {
    title: 'Resources',
    links: ['Resume', 'Case studies'],
  },
  {
    title: 'Connect',
    links: [{ label: 'Email' }, { label: 'Let’s talk', badge: 'available' }],
  },
] as const

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-[linear-gradient(to_bottom,rgba(251,251,251,0),#FBFBFB_200px,#D5EFF3_620px)] backdrop-blur-sm px-[72px] py-12 sm:py-16">
      <div className="relative mx-auto w-full max-w-[1400px]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
          >
            <p className="max-w-xs text-sm leading-relaxed text-neutral-900 sm:text-base">
              Product designer crafting calm, confident digital experiences —
              from first idea to shipped product.
            </p>
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.key}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-[#ADCDDD] text-neutral-700 transition-colors hover:bg-[#ADCDDD] hover:text-neutral-900"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </motion.div>

          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-10 lg:justify-end">
            {cols.map((col, ci) => (
              <motion.div
                key={col.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.05 + ci * 0.05 }}
              className="flex flex-col gap-2"
            >
              <h4 className="text-base font-semibold text-neutral-900 sm:text-lg">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-1">
                {col.links.map((link) => {
                  const label = typeof link === 'string' ? link : link.label
                  const badge =
                    typeof link === 'string' || !('badge' in link)
                      ? undefined
                      : link.badge
                  return (
                    <li key={label} className="flex items-center gap-2">
                      <a
                        href="#"
                        className="text-sm text-neutral-700 transition-colors hover:text-neutral-900 sm:text-base"
                      >
                        {label}
                      </a>
                      {badge && (
                        <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-[10px] tracking-wide text-neutral-700 uppercase">
                          {badge}
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </motion.div>
            ))}
          </div>
        </div>

        <div
          className="mt-20 w-full"
          aria-hidden="true"
          style={{ height: 'clamp(70px, 13vw, 200px)' }}
        >
          <TextPressure
            text="Tanya Das"
            flex
            width
            weight
            italic
            scale
            stroke={false}
            textColor="#000000"
            minFontSize={36}
          />
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-[#2E5E8A] pt-6 text-xs text-neutral-500 sm:flex-row sm:items-center sm:text-sm">
          <p>© 2026 Tanya Das / Designed &amp; built with care</p>
          <div className="flex items-center gap-5">
            <a href="#" className="transition-colors hover:text-neutral-900">
              Resume
            </a>
            <a href="#" className="transition-colors hover:text-neutral-900">
              Terms of service
            </a>
            <a href="#" className="transition-colors hover:text-neutral-900">
              Privacy policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
