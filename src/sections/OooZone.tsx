import DotGrid from '../components/DotGrid'
import WordSearch from '../components/WordSearch'

/**
 * "Things I do apart from work" — an interactive find-a-word puzzle on the
 * clipboard, surrounded by objects that light up as their word is discovered.
 */
export default function OooZone() {
  return (
    <section className="relative isolate flex w-full items-center justify-center bg-[#FBFBFB] px-[72px] py-[104px]">
      <DotGrid />
      <div className="relative z-10 w-full">
        <WordSearch />
      </div>
    </section>
  )
}
