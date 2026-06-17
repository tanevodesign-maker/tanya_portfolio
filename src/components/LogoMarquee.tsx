import {
  Aperture,
  Atom,
  Command,
  Feather,
  Ghost,
  Hexagon,
} from 'lucide-react'

/**
 * Placeholder brand logos (icon + wordmark). Swap these for real logos later.
 */
const logos = [
  { name: 'Nimbus', Icon: Aperture },
  { name: 'Vertex', Icon: Hexagon },
  { name: 'Phantom', Icon: Ghost },
  { name: 'Atomic', Icon: Atom },
  { name: 'Quill', Icon: Feather },
  { name: 'Cmnd', Icon: Command },
]

function LogoItem({ name, Icon }: { name: string; Icon: typeof Aperture }) {
  return (
    <div className="flex shrink-0 items-center gap-2 px-8 text-neutral-400 transition-colors duration-200 hover:text-black">
      <Icon className="h-6 w-6" />
      <span className="text-xl font-semibold tracking-tight">{name}</span>
    </div>
  )
}

/**
 * Logo scroll strip — logos glide right-to-left forever. Hovering the strip
 * pauses the scroll, and the specific logo under the cursor turns full black.
 */
export default function LogoMarquee() {
  return (
    <section className="relative z-10 overflow-hidden bg-[#FBFBFB] py-16">
      {/* Edge fades so logos ease in/out instead of hard-clipping */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#FBFBFB] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#FBFBFB] to-transparent" />

      <div className="group flex w-max">
        <div className="animate-marquee flex w-max group-hover:[animation-play-state:paused]">
          {/* The track is two identical halves; the animation shifts it -50%
              (exactly one half) so the loop is gapless. Each half repeats the
              set twice so a half always overflows the viewport — no blank tail. */}
          {[...logos, ...logos, ...logos, ...logos].map(({ name, Icon }, i) => (
            <LogoItem key={`${name}-${i}`} name={name} Icon={Icon} />
          ))}
        </div>
      </div>
    </section>
  )
}
