import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import type { MotionValue, SpringOptions } from 'framer-motion'
import { Star } from 'lucide-react'
import DotGrid from '../components/DotGrid'

// Spring feel for the 3D tilt / zoom-on-hover (from React Bits "TiltedCard").
const tiltSpring: SpringOptions = { damping: 30, stiffness: 100, mass: 2 }
const ROTATE_AMPLITUDE = 12

type Testimonial = {
  id: string
  quote: string
  name: string
  role: string
  /** Card surface + text colours */
  className: string
  starClassName: string
  dividerClassName: string
  roleClassName: string
  /** Resting position offset from the cluster centre (px) and tilt (deg) */
  cx: number
  cy: number
  rotate: number
  /** Off-screen offset (px) the card flies in from */
  fromX: number
  fromY: number
  /** Off-screen offset (px) the card flies out to when leaving the section */
  exitX: number
  exitY: number
  /** Stack order at rest (Tailwind z-* class) */
  z: string
}

// Ordered back → front. Every card flies in from the top or sides (the Work
// area above), descending into a centred fan; none come from below so the
// page never extends downward.
const testimonials: Testimonial[] = [
  {
    id: 'daniel',
    quote:
      'I recently used these guys for our company conference. They were friendly and professional throughout.',
    name: 'Daniel K.',
    role: 'Operations · Quanta',
    className: 'bg-[#E6CCB2] border-2 border-white text-neutral-800',
    starClassName: 'text-[#5D5D5D]',
    dividerClassName: 'border-black/10',
    roleClassName: 'text-neutral-500',
    cx: 250,
    cy: -30,
    rotate: 8,
    fromX: 820,
    fromY: -120, // enters from the top-right
    exitX: 920,
    exitY: -760, // exits up-right
    z: 'z-10',
  },
  {
    id: 'maria',
    quote:
      'Super professional, organised and great to work with. These guys were invaluable on our last major project. Can’t recommend enough.',
    name: 'Maria L.',
    role: 'Project Lead · Northwind',
    className: 'bg-[#E4E47E] border-2 border-white text-neutral-800',
    starClassName: 'text-[#5D5D5D]',
    dividerClassName: 'border-black/10',
    roleClassName: 'text-neutral-500',
    cx: -30,
    cy: -110,
    rotate: -5,
    fromX: 0,
    fromY: -700, // enters from the top
    exitX: -120,
    exitY: -960, // exits straight up
    z: 'z-30',
  },
  {
    id: 'barry',
    quote:
      'Really useful system. We got an amazing service for our company hotel bookings for our up and coming events.',
    name: 'Barry W.',
    role: 'Founder · Drift Co.',
    className: 'bg-[#BBECF7] border-2 border-white text-neutral-800 shadow-xl',
    starClassName: 'text-[#5D5D5D]',
    dividerClassName: 'border-black/10',
    roleClassName: 'text-neutral-500',
    cx: -110,
    cy: 120,
    rotate: -3,
    fromX: -560,
    fromY: -460, // enters from the top-left
    exitX: -880,
    exitY: 820, // exits down-left
    z: 'z-40',
  },
  {
    id: 'stephen',
    quote:
      'Within minutes the friendly sales assistant had secured me a spectacular room at The Pullman Hotel, right by the M&S Bank Arena.',
    name: 'Stephen A.',
    role: 'Events Manager · Pullman',
    className: 'bg-[#CEDBA9] border-2 border-white text-neutral-800',
    starClassName: 'text-[#5D5D5D]',
    dividerClassName: 'border-black/10',
    roleClassName: 'text-neutral-500',
    cx: -260,
    cy: 30,
    rotate: -8,
    fromX: -820,
    fromY: -120, // enters from the left
    exitX: -1040,
    exitY: -80, // exits left
    z: 'z-20',
  },
  {
    id: 'simon',
    quote:
      'Sorted accommodation in Scotland for me and were very timely and professional. Excellent rates and more discounted than anywhere else :)',
    name: 'Simon F.',
    role: 'Director · Orbital',
    className: 'bg-[#FAF3B6] border-2 border-white text-neutral-900',
    starClassName: 'text-[#5D5D5D]',
    dividerClassName: 'border-black/10',
    roleClassName: 'text-neutral-700',
    cx: 120,
    cy: 80,
    rotate: 5,
    fromX: 760,
    fromY: -60, // enters from the lower-right
    exitX: 900,
    exitY: 820, // exits down-right
    z: 'z-50',
  },
]

function Stars({ className }: { className: string }) {
  return (
    <div className={`flex gap-1 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-current" strokeWidth={0} />
      ))}
    </div>
  )
}

/**
 * A single review card. Its position/opacity are driven directly by the
 * section's scroll progress, so the motion is continuous and reversible:
 * scrolling down pulls it from off-screen into the cluster, scrolling up
 * pushes it back out — every time, in sync with the scroll.
 */
function TestimonialCard({
  t,
  progress,
}: {
  t: Testimonial
  progress: MotionValue<number>
}) {
  // Scroll-linked, three phases across the section pass:
  //  • 0   → 0.4  enter: off-screen origin → resting position in the fan
  //  • 0.4 → 0.6  hold:  stay put, centred
  //  • 0.6 → 1    exit:  scatter back out off-screen as the next section nears
  const x = useTransform(
    progress,
    [0, 0.4, 0.6, 1],
    [t.fromX, t.cx, t.cx, t.exitX],
  )
  const y = useTransform(
    progress,
    [0, 0.4, 0.6, 1],
    [t.fromY, t.cy, t.cy, t.exitY],
  )
  const opacity = useTransform(progress, [0, 0.25, 0.7, 1], [0, 1, 1, 0])

  // Mouse-tracked 3D tilt + zoom on hover.
  const ref = useRef<HTMLDivElement>(null)
  const rotateX = useSpring(useMotionValue(0), tiltSpring)
  const rotateY = useSpring(useMotionValue(0), tiltSpring)
  const scale = useSpring(1, tiltSpring)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
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
    // Outer layer: scroll-linked position + fan tilt + perspective for the 3D.
    <motion.div
      ref={ref}
      className={`absolute top-1/2 left-1/2 -mt-[156px] -ml-[125px] w-[250px] cursor-pointer [perspective:800px] ${t.z} hover:z-[80]`}
      style={{ x, y, rotate: t.rotate, opacity }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Inner surface: tilts toward the cursor and zooms on hover. */}
      <motion.div
        className={`flex w-full flex-col rounded-2xl px-7 py-8 transition-shadow [transform-style:preserve-3d] hover:shadow-2xl ${t.className}`}
        style={{ rotateX, rotateY, scale }}
      >
        <Stars className={t.starClassName} />
        <p className="mt-4 text-[16px] leading-relaxed">{t.quote}</p>
        <div className={`mt-3 border-t pt-3 ${t.dividerClassName}`}>
          <p className="text-sm font-semibold">{t.name}</p>
          <p className={`text-[11px] ${t.roleClassName}`}>{t.role}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

/**
 * Testimonials — a cluster of five fanned, overlapping review cards whose
 * fly-in is scroll-linked. As the user scrolls out of the Work section the
 * cards begin converging from every direction into the centre fan, and the
 * whole thing reverses smoothly when scrolling back up.
 */
export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null)
  // One progress value spans the whole pass over the section: it stays 0 until
  // the Work section is ~3/4 through (section top at 70% of the viewport), then
  // runs to 1 as the section scrolls up and off the top. The cards fly in,
  // hold centred, then scatter back out — see TestimonialCard for the phases.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 70%', 'end 15%'],
  })

  return (
    <section
      ref={ref}
      id="testimonials"
      // overflow-x-clip kills the horizontal scroll from the off-screen card
      // origins while leaving the vertical axis visible — so the cards can peek
      // up over the Work section as they fly in instead of being masked off.
      // z-10 lifts the section above the later QuoteSection so cards exiting
      // downward render on top of it instead of being clipped at its top edge.
      // (They've faded to opacity 0 by the time the quote is in view.)
      className="relative z-10 w-full scroll-mt-24 overflow-x-clip bg-[#FBFBFB] px-6 py-20 sm:py-28"
    >
      <DotGrid />
      <div className="mx-auto flex max-w-[1100px] flex-col items-center">
        <h2 className="text-center font-serif text-[40px] font-medium leading-[1.05] tracking-tight text-neutral-900 lg:text-[52px]">
          From People
          <br />
          I've Worked With
        </h2>

        {/* Card cluster — positions are scroll-linked (see TestimonialCard) */}
        <div className="relative mt-20 h-[520px] w-full">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} t={t} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  )
}
