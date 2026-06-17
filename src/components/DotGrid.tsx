/**
 * Decorative dot-grid background. Sits behind section content (-z-10, so the
 * parent section must establish a stacking context) and fades out toward the
 * top and bottom edges via a vertical mask, so it blends into adjacent sections.
 */
export default function DotGrid({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 ${className}`}
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(0,0,0,0.09) 1px, transparent 1.5px)',
        backgroundSize: '24px 24px',
        maskImage:
          'linear-gradient(to bottom, transparent, #000 20%, #000 80%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent, #000 20%, #000 80%, transparent)',
      }}
    />
  )
}
