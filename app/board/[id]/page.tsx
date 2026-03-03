import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Review } from '../../components/Review';
import { AudienceSummary } from '../../components/AudienceSummary';
import { CopyLinkButton } from '../../components/CopyLinkButton';
import { getScreening, getEntries, getSummary } from '@/lib/kv';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BoardScreeningPage({ params }: Props) {
  const { id } = await params;
  const screening = await getScreening(id);

  if (!screening) {
    notFound();
  }

  const entries = await getEntries(id);
  const savedSummary = await getSummary(id);

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

          <div className='flex items-center gap-3'>
            <CopyLinkButton />
            <Link
              href='/'
              className='rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/10'
            >
              ← Home
            </Link>
          </div>
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
                className='mx-auto max-w-3xl text-4xl sm:text-6xl font-semibold leading-tight'
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                {screening.movieTitle}
              </h1>

              <form
                action='/api/entries'
                method='POST'
                className='summary-box mt-8 mx-auto max-w-md space-y-5 text-center'
              >
                <input type='hidden' name='screeningId' value={id} />
                <div>
                  <label
                    htmlFor='message'
                    className='block text-base font-bold text-zinc-900'
                  >
                    Message
                  </label>
                  <textarea
                    id='message'
                    name='message'
                    required
                    rows={3}
                    className='mt-2 w-full rounded-lg border border-zinc-700/40 bg-white/70 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-500 focus:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-800 text-center'
                    placeholder='What did you think?'
                  />
                </div>
                <div>
                  <label className='block text-base font-bold text-zinc-900 mb-2'>
                    Stars (1–5)
                  </label>
                  <select
                    name='stars'
                    required
                    className='w-full rounded-lg border border-zinc-700/40 bg-white/70 px-4 py-2.5 text-sm text-zinc-900 focus:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-800 text-center'
                  >
                    <option value=''>Select</option>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} ★
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type='submit'
                  className='w-full rounded-lg bg-[#5b1b1b] px-4 py-3 text-sm font-semibold text-amber-100 border border-zinc-800/30 shadow-[0_2px_8px_rgba(0,0,0,.15)] hover:bg-[#6b2222]'
                >
                  Submit reaction
                </button>
              </form>

              <div className='mt-10 mx-auto max-w-md'>
                <AudienceSummary
                  screeningId={id}
                  movieTitle={screening.movieTitle}
                  entryCount={entries.length}
                  averageStars={
                    entries.length > 0
                      ? entries.reduce((sum, e) => sum + e.stars, 0) / entries.length
                      : undefined
                  }
                  initialSummary={savedSummary ?? undefined}
                />
              </div>
            </div>

            <div className='flex justify-center gap-2 px-4 pt-3'>
              {Array.from({ length: 42 }).map((_, i) => (
                <span key={i} className='bulb opacity-90' />
              ))}
            </div>
          </div>
        </section>

        <section className='mt-16 text-center'>
          <h2
            className='text-3xl sm:text-4xl font-semibold'
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Entries
          </h2>
          <p className='mt-2 text-white/80'>
            What the room thought.
          </p>

          <div className='mt-10 grid gap-6 lg:grid-cols-2 items-start max-w-4xl mx-auto'>
            {entries.length === 0 ? (
              <p className='col-span-full text-sm text-white/60'>
                No reactions yet. Be the first!
              </p>
            ) : (
              <div className='col-span-full space-y-4 text-center'>
                {entries.map((entry) => (
                  <Review
                    key={entry.id}
                    stars={entry.stars}
                    text={entry.message}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
