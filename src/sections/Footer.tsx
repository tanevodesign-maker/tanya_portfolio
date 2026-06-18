import { useRef } from 'react'
import { motion } from 'framer-motion'
import VariableProximity from '../components/VariableProximity'

const socials = [
  {
    key: 'x',
    href: 'https://x.com/tanevo_design',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    key: 'ig',
    href: 'https://www.instagram.com/tanyaa_das/',
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
    key: 'be',
    href: 'https://www.behance.net/designtanya',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 4.4v15.2h7.3c1.435 0 2.626-.336 3.573-1.008.947-.672 1.42-1.68 1.42-3.024 0-.83-.2-1.538-.6-2.124-.4-.586-.99-1.005-1.77-1.257.55-.27.96-.62 1.23-1.05.27-.43.405-.964.405-1.602 0-.595-.098-1.092-.294-1.49-.196-.4-.475-.72-.838-.96-.362-.24-.8-.41-1.314-.51-.514-.1-1.084-.15-1.71-.15H0zm15.78 1.2v1.46h5.91V5.6h-5.91zM3.34 7.49h3.13c.27 0 .53.02.78.07.25.05.47.13.66.252.19.12.34.285.45.495.11.21.165.48.165.81 0 .595-.178 1.024-.535 1.287-.357.263-.81.394-1.36.394H3.34V7.49zm14.59 2.74c-.74 0-1.41.13-2.01.39-.6.26-1.114.62-1.54 1.08-.427.46-.756 1.004-.99 1.63-.233.627-.35 1.307-.35 2.04 0 .76.114 1.454.343 2.082.23.628.56 1.168.99 1.62.43.452.953.8 1.57 1.047.617.247 1.31.37 2.078.37 1.105 0 2.046-.252 2.824-.756.778-.504 1.354-1.34 1.728-2.508h-2.35c-.087.302-.296.59-.626.866-.33.276-.74.414-1.225.414-.677 0-1.196-.176-1.556-.527-.36-.35-.557-.92-.59-1.706h6.99c.05-.748-.012-1.466-.187-2.153-.176-.687-.46-1.297-.853-1.83-.393-.532-.896-.957-1.51-1.274-.613-.317-1.328-.475-2.146-.475zm.06 1.81c.538 0 .976.146 1.314.44.338.293.537.74.597 1.34h-3.93c.013-.17.05-.354.11-.553.06-.2.166-.388.317-.566.15-.178.353-.327.607-.448.254-.12.553-.18.897-.18z" />
      </svg>
    ),
  },
  {
    key: 'li',
    href: 'https://www.linkedin.com/in/designtanya/',
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
  const wordmarkRef = useRef<HTMLDivElement>(null)

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
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
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
          ref={wordmarkRef}
          className="relative mt-20 flex w-full justify-center"
        >
          <VariableProximity
            label="Stay Curious"
            containerRef={wordmarkRef}
            fromFontVariationSettings="'wght' 400, 'wdth' 100"
            toFontVariationSettings="'wght' 800, 'wdth' 140"
            radius={260}
            falloff="gaussian"
            className="cursor-default text-center leading-none whitespace-nowrap text-neutral-900 uppercase"
            style={{
              fontFamily: '"Roboto Flex", sans-serif',
              fontSize: 'min(12.8vw, 188px)',
              letterSpacing: '0.05em',
            }}
          />
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-black/20 pt-6 text-xs text-neutral-500 sm:flex-row sm:items-center sm:text-sm">
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
