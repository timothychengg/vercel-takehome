import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function BoardPage() {
  return (
    <div>
      <header className='mx-auto max-w-6xl px-5 pt-10'>
        <div className='flex items-center justify-center gap-8'>
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

      <main className='mx-auto max-w-2xl px-5 py-12 text-center flex flex-col items-center'>
        <h1
          className='text-3xl font-semibold'
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Start a screening
        </h1>
        <p className='mt-2 text-sm text-white/80'>
          Enter the movie title to create a shareable board.
        </p>

        <form
          action='/api/screenings'
          method='POST'
          className='mt-8 w-full max-w-md rounded-xl bg-white/5 border border-white/10 p-6 space-y-4'
        >
          <div>
            <label
              htmlFor='movieTitle'
              className='block text-sm font-medium text-white/90'
            >
              Movie title
            </label>
            <input
              id='movieTitle'
              name='movieTitle'
              type='text'
              className='mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white placeholder-white/40 focus:border-amber-200/50 focus:outline-none focus:ring-1 focus:ring-amber-200/50'
              placeholder='e.g. Interstellar'
            />
          </div>
          <button
            type='submit'
            className='w-full rounded-lg bg-[#5b1b1b] px-4 py-3 text-sm font-semibold text-amber-100 border border-amber-200/30 hover:bg-[#6b2222]'
          >
            Create board →
          </button>
        </form>
      </main>
    </div>
  );
}
