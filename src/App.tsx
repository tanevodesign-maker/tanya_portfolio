import Navigation from './components/Navigation'
import OpeningExperience from './sections/OpeningExperience'
import LogoMarquee from './components/LogoMarquee'
import Work from './sections/Work'
import Testimonials from './sections/Testimonials'
import QuoteSection from './sections/QuoteSection'
import OooZone from './sections/OooZone'
import Footer from './sections/Footer'
import bottomImg from './assets/bottom.png'

function App() {
  return (
    <main>
      {/* Fixed top nav — hidden during the opening, revealed once the hero is reached */}
      <Navigation />

      {/* Section 0 — opening experience that zooms into the hero */}
      <OpeningExperience />

      {/* Section 1 — logo marquee */}
      <LogoMarquee />

      {/* Section 2 — work showcase */}
      <Work />

      {/* Section 3 — testimonials */}
      <Testimonials />

      {/* Section 4 — quote (shows after the testimonial cards slide/fade out) */}
      <QuoteSection />

      {/* Section 5 — OOO Zone: heading ringed by scattered cards */}
      <OooZone />

      {/* Section 6 — footer */}
      <Footer />

      {/* Bottom image — the final element in normal flow; sits below the footer
          and the page ends here (no scroll beyond). */}
      <img
        src={bottomImg}
        alt=""
        className="block w-full bg-[#D7F3F6]"
      />
    </main>
  )
}

export default App
