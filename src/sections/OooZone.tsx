import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import type { MotionValue, SpringOptions } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import artwork from '../assets/ooo_zone/artwork.png'
import claude from '../assets/ooo_zone/claude.png'
import crochet from '../assets/ooo_zone/crochet.png'
import uxProblems from '../assets/ooo_zone/ux_problems.png'

// Same tilt/zoom feel as the testimonial cards.
const tiltSpring: SpringOptions = { damping: 30, stiffness: 100, mass: 2 }
const ROTATE_AMPLITUDE = 12

type ZoneCard = {
  id: string
  image: string
  alt: string
  href: string
  /** Rendered image width (px) */
  width: number
  /** Resting position offset from the section centre (px) and tilt (deg) */
  cx: number
  cy: number
  rotate: number
  /** Off-screen offset (px) the card slides in from */
  fromX: number
  fromY: number
}

// Scattered around the centre heading; each flies in from a different edge.
const cards: ZoneCard[] = [
  { id: 'top', image: artwork, alt: 'Artwork', href: '#', width: 200, cx: -90, cy: -210, rotate: 6, fromX: -1120, fromY: -720, exitX: -1120, exitY: -820 },
  { id: 'right', image: claude, alt: 'Claude', href: '#', width: 260, cx: 320, cy: -100, rotate: -14, fromX: 1060, fromY: -120, exitX: 1120, exitY: -120 },
  { id: 'left', image: crochet, alt: 'Crochet', href: '#', width: 200, cx: -320, cy: 80, rotate: 4, fromX: -1060, fromY: 90, exitX: -1120, exitY: 90 },
  { id: 'bottom', image: uxProblems, alt: 'UX problems', href: '#', width: 200, cx: 110, cy: 210, rotate: -8, fromX: 120, fromY: 960, exitX: 120, exitY: 1000 },
]

function ZoneCard({
  c,
  progress,
}: {
  c: ZoneCard
  progress: MotionValue<number>
}) {
  // Scroll-linked, three phases: slide in → hold → slide back out.
  const x = useTransform(
    progress,
    [0, 0.4, 0.6, 1],
    [c.fromX, c.cx, c.cx, c.exitX],
  )
  const y = useTransform(
    progress,
    [0, 0.4, 0.6, 1],
    [c.fromY, c.cy, c.cy, c.exitY],
  )
  const opacity = useTransform(progress, [0, 0.25, 0.7, 1], [0, 1, 1, 0])

  // Mouse-tracked 3D tilt + zoom on hover (matches the testimonial cards).
  const ref = useRef<HTMLDivElement>(null)
  const rotateX = useSpring(useMotionValue(0), tiltSpring)
  const rotateY = useSpring(useMotionValue(0), tiltSpring)
  const scale = useSpring(1, tiltSpring)

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left - rect.width / 2
    const offsetY = e.clientY - rect.top - rect.height / 2
    rotateX.set((offsetY / (rect.height / 2)) * -ROTATE_AMPLITUDE)
    rotateY.set((offsetX / (rect.width / 2)) * ROTATE_AMPLITUDE)
  }

  function handleMouseEnter() {
    scale.set(1.06)
  }

  function handleMouseLeave() {
    rotateX.set(0)
    rotateY.set(0)
    scale.set(1)
  }

  return (
    // Outer anchor owns the scroll-linked position; the inner wrapper centres
    // itself (-50%) and owns the tilt/zoom — the image keeps its natural aspect
    // ratio (no mask/card/shadow).
    <motion.a
      href={c.href}
      className="group absolute top-1/2 left-1/2 cursor-pointer [perspective:800px]"
      style={{ x, y, opacity }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        ref={ref}
        className="relative [transform-style:preserve-3d]"
        style={{ x: '-50%', y: '-50%', rotate: c.rotate, rotateX, rotateY, scale }}
      >
        <img
          src={c.image}
          alt={c.alt}
          loading="lazy"
          className="block max-w-[42vw] select-none"
          style={{ width: c.width }}
        />

        {/* Click affordance — a ringed diagonal arrow that fades in on hover */}
        <div className="absolute inset-0 grid place-items-center">
          <span className="grid h-14 w-14 place-items-center rounded-full border border-white/60 bg-white/90 text-neutral-900 opacity-0 shadow-md backdrop-blur transition-opacity duration-300 [transform:translateZ(40px)] group-hover:opacity-100">
            <ArrowUpRight className="h-6 w-6" />
          </span>
        </div>
      </motion.div>
    </motion.a>
  )
}

/**
 * "Things I do apart from work" — a centred heading ringed by the four scattered
 * assets. As the user scrolls in the assets slide in from every edge and settle
 * into their tilted resting spots (scroll-linked, reversible). Hovering one
 * tilts/zooms it and reveals a ringed arrow link.
 */
export default function OooZone() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end 15%'],
  })

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen w-full items-center justify-center overflow-x-clip px-6"
    >
      {cards.map((c) => (
        <ZoneCard key={c.id} c={c} progress={scrollYProgress} />
      ))}

      <h2 className="relative z-10 text-center font-serif text-[40px] leading-[1.05] font-medium tracking-tight text-neutral-900 lg:text-[52px]">
        Things I do
        <br />
        apart from work!
      </h2>
    </section>
  )
}
