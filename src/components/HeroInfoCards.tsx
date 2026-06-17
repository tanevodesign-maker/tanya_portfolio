import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Box, Layers, Lightbulb, Palette, PenTool } from 'lucide-react'

/** How long each card stays on screen before switching (ms). */
const INTERVAL = 4000

/* --- Brand logos (inline SVG so there are no extra asset requests) --- */

function FigmaLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 38 57" className={className} aria-hidden>
      <path
        d="M19 28.5A9.5 9.5 0 1 1 38 28.5 9.5 9.5 0 0 1 19 28.5Z"
        fill="#1ABCFE"
      />
      <path
        d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0Z"
        fill="#0ACF83"
      />
      <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19Z" fill="#FF7262" />
      <path
        d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5Z"
        fill="#F24E1E"
      />
      <path
        d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5Z"
        fill="#A259FF"
      />
    </svg>
  )
}

function VSCodeLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#007ACC"
        d="M23.15 2.587 18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352Zm-5.146 14.861L10.826 12l7.178-5.448Z"
      />
    </svg>
  )
}

function ClaudeLogo({ className }: { className?: string }) {
  // Anthropic / Claude sunburst — a clean radial burst of tapered spokes.
  const spokes = Array.from({ length: 12 })
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <g stroke="#D97757" strokeWidth={2.1} strokeLinecap="round">
        {spokes.map((_, i) => {
          const a = (i / spokes.length) * Math.PI * 2
          const cx = 12
          const cy = 12
          const r1 = 3
          const r2 = 9.6
          return (
            <line
              key={i}
              x1={cx + Math.cos(a) * r1}
              y1={cy + Math.sin(a) * r1}
              x2={cx + Math.cos(a) * r2}
              y2={cy + Math.sin(a) * r2}
            />
          )
        })}
      </g>
    </svg>
  )
}

function Monogram({ letter, bg }: { letter: string; bg: string }) {
  return (
    <span
      className="flex h-4 w-4 items-center justify-center rounded-[4px] text-[9px] font-bold text-white"
      style={{ backgroundColor: bg }}
    >
      {letter}
    </span>
  )
}

/* --- Card data --- */

type SkillItem = { name: string; Icon: typeof Box }
type ToolItem = { name: string; logo: React.ReactNode }

const skills: SkillItem[] = [
  { name: 'Product Design', Icon: Box },
  { name: 'UX Thinking', Icon: Lightbulb },
  { name: 'Wireframing', Icon: PenTool },
  { name: 'Prototyping', Icon: Layers },
  { name: 'Visual Design', Icon: Palette },
]

const tools: ToolItem[] = [
  { name: 'Figma', logo: <FigmaLogo className="h-4 w-auto" /> },
  { name: 'VS Code', logo: <VSCodeLogo className="h-4 w-4" /> },
  { name: 'Claude', logo: <ClaudeLogo className="h-4 w-4" /> },
  { name: 'Rive', logo: <Monogram letter="R" bg="#1A1A1A" /> },
  { name: 'Jitter', logo: <Monogram letter="J" bg="#5D5FEF" /> },
]

const cards = [
  { label: 'Things I can do', kind: 'skills' as const },
  { label: 'Tools that I use', kind: 'tools' as const },
]

const chipClass =
  'inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-800'

/**
 * Auto-rotating info cards pinned to the hero's bottom-left corner, rendered as
 * a stacked deck (one solid-white card on top, the other peeking behind it).
 * The front card cycles between "Things I can do" and "Tools that I use" every
 * few seconds, with a step progress bar that fills across its lifetime.
 */
export default function HeroInfoCards() {
  const [index, setIndex] = useState(0)

  // Auto-advance, restarting the timer whenever the index changes (including
  // manual clicks) so the active card always gets a full interval.
  useEffect(() => {
    const id = setTimeout(
      () => setIndex((i) => (i + 1) % cards.length),
      INTERVAL,
    )
    return () => clearTimeout(id)
  }, [index])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="absolute bottom-6 left-6 z-20 hidden w-[252px] max-w-[calc(100vw-3rem)] sm:bottom-8 sm:left-8 lg:block"
    >
      <div className="relative h-[230px]">
        {cards.map((card, i) => {
          const isActive = i === index
          return (
            <motion.div
              key={card.kind}
              animate={{
                x: isActive ? 0 : 12,
                y: isActive ? 0 : 14,
                rotate: isActive ? 0 : 3,
                scale: isActive ? 1 : 0.96,
              }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ zIndex: isActive ? 2 : 1 }}
              onClick={() => setIndex(i)}
              className="absolute inset-0 flex cursor-pointer flex-col rounded-3xl border border-neutral-200 bg-white p-5 shadow-xl"
            >
              <div>
                {/* Heading row — label left, step progress bar top-right */}
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-[15px] font-semibold tracking-tight text-neutral-900">
                    {card.label}
                  </h3>

                  <div className="flex gap-1.5">
                    {cards.map((_, j) => (
                      <button
                        key={j}
                        type="button"
                        aria-label={`Show ${cards[j].label}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          setIndex(j)
                        }}
                        className="-my-2 cursor-pointer py-2"
                      >
                        <div className="h-1 w-3 overflow-hidden rounded-full bg-neutral-900/15">
                          {j < index && (
                            <div className="h-full w-full bg-neutral-900/70" />
                          )}
                          {j === index && isActive && (
                            <motion.div
                              key={index}
                              className="h-full bg-neutral-900/70"
                              initial={{ width: '0%' }}
                              animate={{ width: '100%' }}
                              transition={{
                                duration: INTERVAL / 1000,
                                ease: 'linear',
                              }}
                            />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {card.kind === 'skills'
                    ? skills.map(({ name }) => (
                        <span key={name} className={chipClass}>
                          {name}
                        </span>
                      ))
                    : tools.map(({ name, logo }) => (
                        <span key={name} className={chipClass}>
                          {logo}
                          {name}
                        </span>
                      ))}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
