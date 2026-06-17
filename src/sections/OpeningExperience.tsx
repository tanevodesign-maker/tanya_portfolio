import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import heroBg from '../assets/hero_bg.png'
import openingBg from '../assets/opening_bg.png'
import StaggeredText from '../components/StaggeredText'
import HeroInfoCards from '../components/HeroInfoCards'

const PHOTO_ASPECT = 1556 / 1011

/** Tracks the viewport size so the zoom can resolve to an exact full-bleed cover. */
function useViewport() {
  const [size, setSize] = useState(() =>
    typeof window !== 'undefined'
      ? { w: window.innerWidth, h: window.innerHeight }
      : { w: 1920, h: 1080 },
  )
  useEffect(() => {
    const update = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return size
}

/**
 * Section 0 — the opening experience, which scroll-transforms into the hero.
 *
 * A tall scroll container holds a sticky, full-screen stage. As the user
 * scrolls, the Polaroid un-tilts from -5° to 0° and the SAME photo keeps
 * zooming until it exactly covers the screen — becoming the hero background.
 * The end scale is derived from the viewport so the photo fills the screen
 * edge-to-edge (no white bars) on any display, then HOLDS: once it's the
 * background, scrolling no longer zooms it — it just moves on to the next
 * section.
 */
function OpeningExperience() {
  const ref = useRef<HTMLDivElement>(null)
  const { w: vw, h: vh } = useViewport()

  // Scroll-lock: once the hero locks in, the user can't scroll back up into the
  // opening experience. `floorRef` is the minimum scroll position they're held
  // at; `returningRef` temporarily lifts the lock while the nav logo animates
  // them back to the top.
  const lockedRef = useRef(false)
  const floorRef = useRef(0)
  const returningRef = useRef(false)

  // Geometry of the Polaroid photo at rest, and the scale that makes it cover
  // the whole viewport (the larger of the width/height ratios = object-cover).
  const cardWidth = Math.min(380, vw - 48)
  const photoWidth = cardWidth - 24
  const photoHeight = photoWidth / PHOTO_ASPECT
  // 1.03 = a hair of safety margin so no white edge sneaks in from rounding.
  const coverScale = Math.max(vw / photoWidth, vh / photoHeight) * 1.03
  const midScale = 1 + (coverScale - 1) * 0.35

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  // Spring-smooth the raw scroll progress so every transform feels fluid.
  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    mass: 0.4,
  })

  // Un-tilt early, then zoom until the photo exactly covers the screen by ~45%
  // scroll (≈2-3 scrolls in) — and HOLD from there. Because the container is
  // tall (500vh), that hold spans a lot of scroll, so leaving the hero for the
  // next section takes deliberate effort rather than a single flick.
  const rotate = useTransform(progress, [0, 0.18], [-5, 0])
  const scale = useTransform(
    progress,
    [0, 0.25, 0.45, 1],
    [1, midScale, coverScale, coverScale],
  )
  // Scaling from the card's center drifts the photo upward (the frame + caption
  // sit below it). Nudge it back down ~19.5px per unit of scale so the photo
  // stays centered and fills the screen evenly once it becomes the background.
  const y = useTransform(scale, (v) => 19.5 * (v - 1))
  // Caption fades out early; the white frame scales off-screen on its own.
  const chromeOpacity = useTransform(progress, [0.18, 0.3], [1, 0])
  // Opening background fades out as the photo takes over the screen.
  const openingOpacity = useTransform(progress, [0.12, 0.26], [1, 0])
  // Over the last stretch (scrolling from the hero toward the next section) the
  // bottom-left info cards slide off to the left and fade out.
  const cardsExitX = useTransform(progress, [0.85, 1], [0, -200])
  const cardsExitOpacity = useTransform(progress, [0.85, 1], [1, 0])
  // ...and the whole hero stage shrinks, rounds its corners to 24px, and lifts
  // up as it scrolls away to reveal the next section.
  const heroExitScale = useTransform(progress, [0.85, 1], [1, 0.9])
  const heroExitY = useTransform(progress, [0.85, 1], [0, -60])
  const heroExitRadius = useTransform(progress, [0.85, 1], ['0px', '24px'])

  // Mount the hero copy only once the photo has locked in as the background, so
  // the staggered text animation plays on arrival at the hero (not at page load).
  const [heroReached, setHeroReached] = useState(false)
  useMotionValueEvent(progress, 'change', (v) => {
    setHeroReached(v > 0.47)
    // Arm the scroll floor only once the hero is fully assembled (heading,
    // subtext, cards all in) — at ~55%, comfortably past the 0.47 mount point —
    // so the user can never scroll back up to where elements drop away.
    if (v > 0.55 && !returningRef.current) {
      const el = ref.current
      if (el) {
        floorRef.current =
          el.offsetTop + 0.55 * (el.offsetHeight - window.innerHeight)
        lockedRef.current = true
      }
    }
  })

  // Hold the user at the floor: any attempt to scroll back above the locked hero
  // snaps to the floor. Lifted only while returning via the nav logo.
  useEffect(() => {
    const onScroll = () => {
      if (returningRef.current || !lockedRef.current) return
      if (window.scrollY < floorRef.current) {
        window.scrollTo(0, floorRef.current)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // The nav logo dispatches `opening:return` to take the user back to the
  // opening experience: lift the lock and smooth-scroll to the very top.
  useEffect(() => {
    const onReturn = () => {
      returningRef.current = true
      lockedRef.current = false
      window.scrollTo({ top: 0, behavior: 'smooth' })
      window.setTimeout(() => {
        returningRef.current = false
      }, 1400)
    }
    window.addEventListener('opening:return', onReturn)
    return () => window.removeEventListener('opening:return', onReturn)
  }, [])

  // Gate the subtext on the heading finishing its staggered entrance. The
  // heading's last word starts at (7 words - 1) * 80ms = 480ms and runs for
  // 600ms, so it lands ~1080ms after mount; wait that out before revealing.
  const [headingDone, setHeadingDone] = useState(false)
  useEffect(() => {
    if (!heroReached) return
    const t = setTimeout(() => setHeadingDone(true), 1150)
    return () => {
      clearTimeout(t)
      setHeadingDone(false)
    }
  }, [heroReached])

  return (
    <section ref={ref} className="relative h-[500vh]">
      <motion.div
        style={{
          scale: heroExitScale,
          y: heroExitY,
          borderRadius: heroExitRadius,
        }}
        className="sticky top-0 flex h-screen origin-center items-center justify-center overflow-hidden px-6"
      >
        {/* Opening background — fades out as the photo fills the screen */}
        <motion.div
          aria-hidden
          className="absolute inset-0 bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${openingBg})`, opacity: openingOpacity }}
        />

        {/* Polaroid card — intro entrance on the outer wrapper, scroll zoom on the inner */}
        <motion.div
          initial={{ opacity: 0, y: 120 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-[380px]"
        >
          <motion.div
            style={{ rotate, scale, y }}
            className="bg-white p-3 pb-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)]"
          >
            <img
              src={heroBg}
              alt="Tanya Das"
              className="aspect-[1556/1011] w-full object-cover"
            />

            <motion.div
              style={{ opacity: chromeOpacity }}
              className="flex items-center justify-between px-1 pt-4"
            >
              <span className="text-[15px] font-medium leading-none tracking-tight text-neutral-900">
                Tanya Das
              </span>
              <span className="text-[15px] leading-none text-neutral-500">
                Product Designer
              </span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Hero intro copy — overlaid on the photo; the staggered text mounts
            (and animates in) only once the hero is reached */}
        <div className="pointer-events-none absolute inset-x-0 top-[24%] z-10 flex flex-col items-center gap-3 px-6">
          {heroReached && (
            <>
              <StaggeredText
                text="Hello, I'm Tanya!|Product & Visual Designer"
                segmentBy="words"
                separator="|"
                direction="top"
                delay={80}
                duration={0.6}
                blur
                staggerDirection="forward"
                segmentClassName={(segment) => {
                  if (segment === 'Tanya!') return 'font-light italic'
                  if (
                    segment === 'Product' ||
                    segment === 'Visual' ||
                    segment === 'Designer'
                  )
                    return 'font-medium italic'
                  return 'font-light'
                }}
                className="max-w-3xl text-center font-serif text-[40px] leading-[55px] tracking-tight text-neutral-900"
              />
              {headingDone && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-xl text-center text-[16px] leading-relaxed font-normal text-neutral-700"
                >
                  <span className="font-bold">3 years</span> of experience
                  designing <span className="font-bold">end-to-end</span>{' '}
                  experiences
                  <br />
                  for{' '}
                  <span className="font-bold">
                    SaaS, EdTech, and AI products.
                  </span>
                </motion.p>
              )}
            </>
          )}
        </div>

        {/* Auto-rotating info cards — mount on hero arrival, bottom-left corner.
            On the way out they slide left and fade with scroll progress. */}
        {heroReached && (
          <motion.div
            style={{ x: cardsExitX, opacity: cardsExitOpacity }}
            className="pointer-events-none absolute inset-0 z-20"
          >
            <HeroInfoCards />
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}

export default OpeningExperience
