import { useRef } from 'react'
import { motion } from 'framer-motion'
import VariableProximity from '../components/VariableProximity'
import quoteBg from '../assets/quote_bg.png'
import stamp from '../assets/stamp.png'
import GlassCursor from '../components/GlassCursor'

/**
 * Quote section — appears after the testimonial cards have slid/faded out.
 * The quote uses the React Bits "Variable Proximity" effect: each letter's
 * weight/optical-size animates with the cursor's distance (Roboto Serif's
 * variable axes). The author's name sits below.
 */
export default function QuoteSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section className="flex min-h-[60vh] w-full items-center justify-center px-[72px] py-24">
      {/* Background container — fills the section margins and holds the quote_bg image */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex min-h-[608px] w-full items-end justify-center overflow-hidden rounded-[20px] px-16 pt-16 sm:px-20 sm:pt-20"
      >
        {/* Glass-cursor image layer — fills the container, sits behind the overlay + paper */}
        <div className="absolute inset-0">
          <GlassCursor
            src={quoteBg}
            width="100%"
            height="100%"
            blobSize={0.02}
            trailLength={16}
            refraction={0.3}
            blobWarpAmount={25}
            blobWarpScale={5}
            borderGlow={0.15}
            specularGain={0.2}
          />
        </div>

        {/* Black overlay at 20% opacity, over the image (pointer-events pass through to the glass effect) and under the paper */}
        <div className="pointer-events-none absolute inset-0 bg-black/20" />

        {/* Paper container — sharp (zero-radius) corners, sits on top of the image */}
        <div
          ref={containerRef}
          className="relative z-10 flex min-h-[528px] w-full max-w-xl flex-col items-start justify-start rounded-t-[16px] bg-[#F3ECE6] p-[56px] text-left shadow-[0_20px_50px_-24px_rgba(0,0,0,0.45)]"
          style={{ fontFamily: '"Libre Franklin", sans-serif' }}
        >
          <span className="mb-6 rounded-full border border-neutral-300 px-4 py-1 text-xs font-medium tracking-[0.2em] text-neutral-600 uppercase">
            A Thought I Design By
          </span>

          <VariableProximity
            label={
              '“Good experiences aren’t defined by visuals — they’re defined by how confidently users move forward.”'
            }
            containerRef={containerRef}
            fromFontVariationSettings="'wght' 400, 'opsz' 14"
            toFontVariationSettings="'wght' 900, 'opsz' 32"
            radius={130}
            falloff="gaussian"
            className="block cursor-default text-left text-[22px] leading-[1.3] tracking-tight text-neutral-900 sm:text-[30px]"
            style={{ fontFamily: '"Libre Franklin", sans-serif' }}
          />

          {/* Author — pinned bottom-left, bottom-aligned with the stamp */}
          <div className="absolute bottom-8 left-[56px]">
            <p className="text-base font-medium tracking-tight text-neutral-900">
              — Tanya Das
            </p>
            <p className="mt-1 text-sm font-medium tracking-tight text-neutral-500">
              (Visual and Product Designer)
            </p>
          </div>

          {/* Stamp — bottom-right corner, tilted left 5° */}
          <img
            src={stamp}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute right-8 bottom-8 w-24 -rotate-[26deg] select-none drop-shadow-[0_6px_10px_rgba(0,0,0,0.25)]"
          />
        </div>
      </motion.div>
    </section>
  )
}
