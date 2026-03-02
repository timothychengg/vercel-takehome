import Link from 'next/link';
import { Step } from './components/Step';
import { Review } from './components/Review';

export const dynamic = 'force-static';

export default function HomePage() {
  return (
    <div className='relative min-h-screen overflow-x-hidden'>
      <div
        className='curtain-left hidden sm:block fixed left-0 top-0 bottom-0 w-20 sm:w-28 z-10 pointer-events-none'
        aria-hidden
      />
      <div
        className='curtain-right hidden sm:block fixed right-0 top-0 bottom-0 w-20 sm:w-28 z-10 pointer-events-none'
        aria-hidden
      />
      <header className='mx-auto max-w-6xl px-5 pt-10'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <span className='inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/10 border border-white/15 text-xs font-semibold'>
              AC
            </span>
            <span className='text-sm font-semibold tracking-tight'>
              AfterCredits
            </span>
          </div>

          <nav className='hidden sm:flex items-center gap-8 text-sm text-white/80'>
            <Link href='#how' className='hover:text-white'>
              How it works
            </Link>
            <Link href='#preview' className='hover:text-white'>
              Preview
            </Link>
          </nav>

          <Link
            href='/board'
            className='rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/10'
          >
            Start a screening →
          </Link>
        </div>
      </header>

      <main className='mx-auto max-w-6xl px-5 pb-20'>
        <section className='mt-8'>
          <div className='marquee-frame p-4'>
            <div className='flex justify-center gap-2 px-4 pb-3'>
              {/* Creates 42 bulbs */}
              {Array.from({ length: 42 }).map((_, i) => (
                <span key={i} className='bulb opacity-95' />
              ))}
            </div>

            <div className='marquee-inner px-8 py-10 text-center'>
              <h1
                className='mx-auto max-w-3xl text-4xl sm:text-6xl font-semibold leading-tight'
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                When the credits roll,
                <br />
                what did the room think?
              </h1>

              <p className='mt-4 text-sm sm:text-base text-zinc-800/80'>
                AfterCredits captures the audience reaction and extracts the
                signal using AI.
              </p>

              <div className='mt-7 flex flex-col sm:flex-row items-center justify-center gap-3'>
                <Link
                  href='/board'
                  className='rounded-md bg-[#5b1b1b] px-6 py-3 text-sm font-semibold text-amber-100 border border-amber-200/30 shadow-[0_0_0_1px_rgba(0,0,0,.08),0_0_30px_rgba(252,211,77,.22)]'
                >
                  Start a screening →
                </Link>
                <Link
                  href='#how'
                  className='rounded-md bg-zinc-900 px-6 py-3 text-sm font-semibold text-white border border-black/30 shadow-[0_0_0_1px_rgba(255,255,255,.08)]'
                >
                  See how it works →
                </Link>
              </div>

              <p className='mt-6 text-xs text-zinc-900/70'>
                No accounts. No feeds. One shared board for one shared moment.
              </p>
            </div>
            <div className='flex justify-center gap-2 px-4 pt-3'>
              {/* Creates 42 bulbs */}
              {Array.from({ length: 42 }).map((_, i) => (
                <span key={i} className='bulb opacity-90' />
              ))}
            </div>
          </div>
        </section>

        <section id='how' className='mt-16 text-center'>
          <h2
            className='text-3xl sm:text-4xl font-semibold'
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            How it works
          </h2>

          <div className='mt-10 grid gap-8 sm:grid-cols-3 text-left'>
            <Step
              num='1'
              title='Set the screening'
              body='Enter the movie title for the session.'
            />
            <Step
              num='2'
              title='Collect reactions'
              body='Share quick thoughts and ratings.'
            />
            <Step
              num='3'
              title='Extract the summary'
              body='AI summarizes the feedback.'
            />
          </div>
        </section>

        <section id='preview' className='mt-16 text-center'>
          <h2
            className='text-3xl sm:text-4xl font-semibold'
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Preview
          </h2>
          <p className='mt-2 text-white/80'>
            What you&apos;ll see on the board.
          </p>

          <div className='mt-10 grid gap-6 lg:grid-cols-2 items-start'>
            <div className='marquee-frame p-4'>
              <div className='flex justify-center gap-2 px-4 pb-3'>
                {/* Creates 24 bulbs */}
                {Array.from({ length: 24 }).map((_, i) => (
                  <span key={i} className='bulb opacity-95' />
                ))}
              </div>

              <div className='marquee-inner p-6 text-left'>
                <p className='text-sm font-semibold'>Audience Summary</p>
                <div className='mt-5 flex items-center justify-between gap-4 text-sm'>
                  <span className='text-zinc-800/80'>
                    Tonight&apos;s Screening
                  </span>
                  <span className='font-semibold'>Interstellar</span>
                </div>

                <div className='mt-5 text-sm text-zinc-800/80'>
                  <span className='font-semibold text-zinc-900'>
                    AI summary:
                  </span>{' '}
                  Visually stunning with standout cinematography and score. The ending divided the room—some found it profound, others felt the pacing dragged. Overall positive sentiment.
                </div>
              </div>

              <div className='flex justify-center gap-2 px-4 pt-3'>
                {/* Creates 24 bulbs */}
                {Array.from({ length: 24 }).map((_, i) => (
                  <span key={i} className='bulb opacity-90' />
                ))}
              </div>
            </div>

            <div className='space-y-4'>
              <Review
                stars={5}
                text='The cinematography was unreal. Ending had me thinking for hours.'
              />
              <Review
                stars={4}
                text='Loved the score, but the pacing was a bit slow.'
              />
              <Review
                stars={4}
                text='Cool concept, but the characters felt flat.'
              />
            </div>
          </div>
        </section>

        <section className='mt-20 text-center'>
          <h3
            className='text-3xl sm:text-4xl font-semibold'
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Start your next movie night board.
          </h3>
          <p className='mt-3 text-white/80'>
            Set the title, share the link, and capture the room&apos;s reaction
            in real-time.
          </p>

          <div className='mt-8 flex justify-center'>
            <Link
              href='/board'
              className='rounded-xl border border-amber-200/40 bg-[#5b1b1b] px-10 py-4 text-sm font-semibold text-amber-100 shadow-[0_0_0_1px_rgba(0,0,0,.15),0_0_50px_rgba(252,211,77,.28)]'
            >
              Start a screening →
            </Link>
          </div>

          <footer className='mt-14 flex items-center justify-between text-xs text-white/60'>
            <span>© 2026 AfterCredits.</span>
            <span>Built with Next.js on Vercel.</span>
          </footer>
        </section>
      </main>
    </div>
  );
}
