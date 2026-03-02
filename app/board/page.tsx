import Link from 'next/link';
import { StartScreeningForm } from './components/StartScreeningForm';

export const dynamic = 'force-dynamic';

export default function BoardPage() {
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
          <Link href='/' className='flex items-center gap-3 hover:opacity-90'>
            <span className='inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/10 border border-white/15 text-xs font-semibold'>
              AC
            </span>
            <span className='text-sm font-semibold tracking-tight'>
              AfterCredits
            </span>
          </Link>

          <Link
            href='/'
            className='rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/10'
          >
            ← Home
          </Link>
        </div>
      </header>

      <main className='mx-auto max-w-6xl px-5 pb-20'>
        <section className='mt-8'>
          <div className='marquee-frame p-4'>
            <div className='flex justify-center gap-2 px-4 pb-3'>
              {Array.from({ length: 42 }).map((_, i) => (
                <span key={i} className='bulb opacity-95' />
              ))}
            </div>

            <div className='marquee-inner px-8 py-10 text-center'>
              <h1
                className='text-3xl sm:text-4xl font-semibold leading-tight'
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Start a screening
              </h1>
              <p className='mt-2 text-sm text-zinc-800/80'>
                Enter the movie title to create a shareable board.
              </p>

              <StartScreeningForm />
            </div>

            <div className='flex justify-center gap-2 px-4 pt-3'>
              {Array.from({ length: 42 }).map((_, i) => (
                <span key={i} className='bulb opacity-90' />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
