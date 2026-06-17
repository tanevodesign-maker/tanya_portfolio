import { useRef } from 'react'
import { motion } from 'framer-motion'
import VariableProximity from '../components/VariableProximity'

/**
 * Quote section — appears after the testimonial cards have slid/faded out.
 * The quote uses the React Bits "Variable Proximity" effect: each letter's
 * weight/optical-size animates with the cursor's distance (Roboto Serif's
 * variable axes). The author's name sits below.
 */
export default function QuoteSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section className="flex min-h-[60vh] w-full items-center justify-center bg-[#FBFBFB] px-6 py-24">
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex max-w-4xl flex-col items-center"
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
          className="block cursor-default text-center text-[30px] leading-[1.3] tracking-tight text-neutral-900 sm:text-[44px]"
          style={{ fontFamily: '"Inter", sans-serif' }}
        />

        <p className="mt-5 text-base font-medium tracking-tight text-neutral-500">
          — Tanya Das
        </p>
      </motion.div>
    </section>
  )
}
