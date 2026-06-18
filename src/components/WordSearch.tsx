import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, RotateCcw } from 'lucide-react'
import board from '../assets/ooo_zone/board.png'
import crochet1 from '../assets/ooo_zone/crochet_1.png'
import crochet2 from '../assets/ooo_zone/crochet_2.png'
import dogsImg from '../assets/ooo_zone/dogs.png'
import painting1 from '../assets/ooo_zone/painting_1.png'
import painting2 from '../assets/ooo_zone/painting_2.png'
import vibe1 from '../assets/ooo_zone/vibe_coding_1.png'
import vibe2 from '../assets/ooo_zone/vibe_coding_2.png'
import yogaImg from '../assets/ooo_zone/yoga.png'

/*
 * Interactive word-search on the clipboard. Click-and-drag across letters to
 * select a straight line (horizontal / vertical / diagonal, either direction).
 * Finding a hidden word permanently highlights it, fills the dash after
 * "you'll find me …", and lights up the related object around the board.
 *
 * NOTE: the side "objects" are emoji placeholders for now — swap them for real
 * images by replacing `emoji` with an <img> in the OBJECTS render below.
 */

type Cell = { r: number; c: number }

// 10×10 grid with the six words placed. Fillers are inert letters.
const GRID = [
  'CROCHETING',
  'AZLPBKUFMP',
  'TVHRMWBQDA',
  'LKPYOGANSI',
  'SBRTKMPVLN',
  'OWSKBNTRHT',
  'DLVDOGSKPI',
  'IMBWLKNTVN',
  'NRKPBLWSTG',
  'VIBECODING',
].map((row) => row.split(''))

type WordDef = { word: string; activity: string }

const WORDS: WordDef[] = [
  { word: 'CROCHETING', activity: 'crocheting' },
  { word: 'YOGA', activity: 'doing yoga' },
  { word: 'VIBECODING', activity: 'vibe coding' },
  { word: 'PAINTING', activity: 'painting' },
  { word: 'DOGS', activity: 'with dogs' },
]
const WORD_SET = new Set(WORDS.map((w) => w.word))
const TOTAL = WORDS.length

// Scattered objects flanking the board. `word` ties each to a puzzle word so it
// lights up when that word is found. Positions/tilts are hand-scattered.
type ObjectDef = {
  src: string
  word: string
  pos: string
  w: string
  rotate: number
  href?: string // if set, the object is a clickable link (shows an arrow on hover)
}

// Uniform width keeps every object in the same visual hierarchy; positions are
// staggered (alternating in/out per row) so none overlap.
const OBJECTS: ObjectDef[] = [
  // Left — scattered, all kept within the board's height
  { src: vibe1, word: 'VIBECODING', pos: 'left-[1%] top-[1%]', w: 'w-36 sm:w-44', rotate: -13, href: '#' },
  { src: painting1, word: 'PAINTING', pos: 'left-[14%] top-[26%]', w: 'w-28 sm:w-32', rotate: 8 },
  { src: yogaImg, word: 'YOGA', pos: 'left-[1%] top-[52%]', w: 'w-32 sm:w-36', rotate: 70 },
  { src: crochet1, word: 'CROCHETING', pos: 'left-[8%] bottom-[1%]', w: 'w-8 sm:w-10', rotate: 16 },
  // Right — scattered, all kept within the board's height
  { src: crochet2, word: 'CROCHETING', pos: 'right-[12%] top-[2%]', w: 'w-14 sm:w-16', rotate: 7 },
  { src: painting2, word: 'PAINTING', pos: 'right-[1%] top-[26%]', w: 'w-28 sm:w-32', rotate: -6 },
  { src: vibe2, word: 'VIBECODING', pos: 'right-[11%] top-[51%]', w: 'w-36 sm:w-44', rotate: 11, href: '#' },
  { src: dogsImg, word: 'DOGS', pos: 'right-[0%] bottom-[1%]', w: 'w-28 sm:w-36', rotate: -5 },
]

const key = (r: number, c: number) => `${r},${c}`
const sign = (n: number) => (n > 0 ? 1 : n < 0 ? -1 : 0)

/** Cells along the straight line a→b, or null if it isn't a straight line. */
function lineCells(a: Cell, b: Cell): Cell[] | null {
  const dr = b.r - a.r
  const dc = b.c - a.c
  if (!(dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc))) return null
  const steps = Math.max(Math.abs(dr), Math.abs(dc))
  const sr = sign(dr)
  const sc = sign(dc)
  return Array.from({ length: steps + 1 }, (_, i) => ({
    r: a.r + i * sr,
    c: a.c + i * sc,
  }))
}

const COLS = 10
const CELL = 100 / COLS // one cell as a % of the (square) grid

/** A rounded "stadium" capsule traced from cell a to cell b, in % units. */
function capsuleStyle(a: Cell, b: Cell): CSSProperties {
  const ax = (a.c + 0.5) * CELL
  const ay = (a.r + 0.5) * CELL
  const bx = (b.c + 0.5) * CELL
  const by = (b.r + 0.5) * CELL
  const len = Math.hypot(bx - ax, by - ay)
  const angle = (Math.atan2(by - ay, bx - ax) * 180) / Math.PI
  return {
    left: `${(ax + bx) / 2}%`,
    top: `${(ay + by) / 2}%`,
    width: `${len + CELL}%`,
    height: `${CELL * 0.92}%`,
    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
  }
}

export default function WordSearch() {
  const [foundWords, setFoundWords] = useState<string[]>([])
  const [foundLines, setFoundLines] = useState<{ a: Cell; b: Cell }[]>([])
  const [start, setStart] = useState<Cell | null>(null)
  const [path, setPath] = useState<Cell[]>([])
  const [error, setError] = useState(false)
  const selecting = useRef(false)

  const completed = foundWords.length === TOTAL

  // Latest values for the global mouseup handler (avoids stale closures).
  const latest = useRef({ path, foundWords })
  latest.current = { path, foundWords }

  function finishSelection() {
    const { path: p, foundWords: fw } = latest.current
    selecting.current = false
    setStart(null)
    setPath([])

    if (p.length < 2) return
    const str = p.map((c) => GRID[c.r][c.c]).join('')
    const rev = str.split('').reverse().join('')
    const match = WORD_SET.has(str) ? str : WORD_SET.has(rev) ? rev : null

    if (match && !fw.includes(match)) {
      setFoundWords((f) => [...f, match])
      setFoundLines((l) => [...l, { a: p[0], b: p[p.length - 1] }])
    } else if (!match) {
      // Brief error flash on the (re-shown) path, then drop it.
      setPath(p)
      setError(true)
      window.setTimeout(() => {
        setError(false)
        setPath([])
      }, 450)
    }
  }

  useEffect(() => {
    const up = () => {
      if (selecting.current) finishSelection()
    }
    window.addEventListener('mouseup', up)
    return () => window.removeEventListener('mouseup', up)
  }, [])

  function handleDown(r: number, c: number) {
    if (completed || error) return
    selecting.current = true
    setStart({ r, c })
    setPath([{ r, c }])
  }

  function restart() {
    selecting.current = false
    setFoundWords([])
    setFoundLines([])
    setStart(null)
    setPath([])
    setError(false)
  }

  function handleEnter(r: number, c: number) {
    if (!selecting.current || !start) return
    const cells = lineCells(start, { r, c })
    if (cells) setPath(cells)
  }

  // Only the most recently discovered activity is shown in the blank — a new
  // find replaces the previous one.
  const lastWord = foundWords[foundWords.length - 1]
  const lastActivity = WORDS.find((w) => w.word === lastWord)?.activity ?? ''

  return (
    <div className="flex w-full flex-col items-center">
      {/* Board + flanking objects. This wrapper is exactly the board's height,
          so the objects only sit to its left/right — never above or below it. */}
      <div className="relative mx-auto w-full max-w-[1040px]">
      {/* Objects scattered around the board — always fully visible; once their
          word is found they grow a little + glow. Each also zooms on hover. */}
      {OBJECTS.map((o, i) => {
        const lit = completed || foundWords.includes(o.word)
        const img = (
          <motion.img
            src={o.src}
            alt=""
            draggable={false}
            className={`h-auto cursor-pointer select-none transition-[filter] duration-300 hover:drop-shadow-[0_3px_6px_rgba(0,0,0,0.12)] ${o.w}`}
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
        )
        return (
          <motion.div
            key={i}
            className={`group absolute z-20 ${o.pos}`}
            initial={{ rotate: o.rotate, scale: 1 }}
            animate={{ rotate: o.rotate, scale: lit ? 1.14 : 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {o.href ? (
              <a href={o.href} className="relative block">
                {img}
                {/* Click affordance — ringed arrow revealed on hover */}
                <span className="pointer-events-none absolute inset-0 grid place-items-center">
                  <span
                    style={{ transform: `rotate(${-o.rotate}deg)` }}
                    className="grid h-10 w-10 place-items-center rounded-full border border-white/70 bg-white/90 text-neutral-900 opacity-0 shadow-md backdrop-blur transition-opacity duration-300 group-hover:opacity-100"
                  >
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </span>
              </a>
            ) : (
              img
            )}
          </motion.div>
        )
      })}

      {/* Clipboard with the heading + dash + letter grid all on the paper */}
      <motion.div
        className="relative mx-auto w-full max-w-[430px]"
        animate={completed ? { scale: [1, 1.03, 1] } : { scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <img
          src={board}
          alt="Find-a-word clipboard"
          draggable={false}
          className="block w-full select-none"
        />

        {/* Heading on the clipboard paper — centered, clear of the clip */}
        <div className="absolute top-[calc(20%+32px)] left-1/2 w-[78%] -translate-x-1/2 text-center font-serif text-[19px] leading-snug font-medium text-neutral-900 sm:text-[23px]">
          <AnimatePresence mode="wait">
            {completed ? (
              <motion.p
                key="done"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                Now you know what
                <br />
                keeps me busy outside work!
              </motion.p>
            ) : (
              <motion.p
                key="prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                When I am not designing,
                <br />
                You&apos;ll find me{' '}
                {/* Always-visible underline; the latest activity is written on
                    it in a handwritten font (one at a time, replaced on a new
                    find). */}
                <span className="ml-1 inline-flex min-w-[120px] items-end justify-center border-b-2 border-neutral-500 align-[0.1em] leading-none">
                  <AnimatePresence mode="wait">
                    {lastActivity && (
                      <motion.span
                        key={lastActivity}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.3 }}
                        className="font-['Indie_Flower'] text-[20px] leading-none font-semibold text-neutral-900 sm:text-[24px]"
                      >
                        {lastActivity}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Letter grid on the clipboard paper, below the heading */}
        <div
          className="absolute top-[63%] left-1/2 aspect-square w-[72%] -translate-x-1/2 -translate-y-1/2 select-none"
          onDragStart={(e) => e.preventDefault()}
        >
          {/* Outline capsules traced around found words + the live selection */}
          <div className="pointer-events-none absolute inset-0">
            {foundLines.map((ln, i) => (
              <div
                key={i}
                className="absolute rounded-full border-[2.5px] border-emerald-500"
                style={capsuleStyle(ln.a, ln.b)}
              />
            ))}
            {path.length >= 1 && (
              <div
                className={`absolute rounded-full border-[2.5px] ${
                  error ? 'border-rose-500' : 'border-indigo-500'
                }`}
                style={capsuleStyle(path[0], path[path.length - 1])}
              />
            )}
          </div>

          <div className="relative grid h-full w-full grid-cols-10 gap-[2px]">
            {GRID.map((row, r) =>
              row.map((letter, c) => (
                <div
                  key={key(r, c)}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    handleDown(r, c)
                  }}
                  onMouseEnter={() => handleEnter(r, c)}
                  className="flex cursor-pointer items-center justify-center text-[2.4vw] leading-none font-semibold text-neutral-800 uppercase select-none sm:text-[14px]"
                >
                  {letter}
                </div>
              )),
            )}
          </div>
        </div>
      </motion.div>
      </div>

      {/* Restart — only once every word has been found */}
      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-2 flex justify-center"
          >
            <button
              type="button"
              onClick={restart}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-neutral-400 px-3.5 py-1.5 text-xs font-medium text-neutral-800 transition-colors hover:bg-neutral-100"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Restart
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
