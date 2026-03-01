import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Review } from '../../components/Review';
import { getScreening, getEntries } from '@/lib/kv';

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
          {screening.movieTitle}
        </h1>
        <p className='mt-2 text-sm text-white/80'>Leave your reaction!</p>

        <form
          action='/api/entries'
          method='POST'
          className='mt-8 w-full max-w-md rounded-xl bg-white/5 border border-white/10 p-6 space-y-4'
        >
          <input type='hidden' name='screeningId' value={id} />
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-white/90'
            >
              Name
            </label>
            <input
              id='name'
              name='name'
              type='text'
              required
              className='mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white placeholder-white/40 focus:border-amber-200/50 focus:outline-none focus:ring-1 focus:ring-amber-200/50'
              placeholder='Your name'
            />
          </div>
          <div>
            <label
              htmlFor='message'
              className='block text-sm font-medium text-white/90'
            >
              Message
            </label>
            <textarea
              id='message'
              name='message'
              required
              rows={3}
              className='mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white placeholder-white/40 focus:border-amber-200/50 focus:outline-none focus:ring-1 focus:ring-amber-200/50'
              placeholder='What did you think?'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-white/90 mb-2'>
              Stars (1–5)
            </label>
            <select
              name='stars'
              required
              className='w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white focus:border-amber-200/50 focus:outline-none focus:ring-1 focus:ring-amber-200/50'
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
            className='w-full rounded-lg bg-[#5b1b1b] px-4 py-3 text-sm font-semibold text-amber-100 border border-amber-200/30 hover:bg-[#6b2222]'
          >
            Submit reaction
          </button>
        </form>

        <div className='mt-12 w-full max-w-md'>
          <h2 className='text-lg font-semibold'>Entries</h2>
          {entries.length === 0 ? (
            <p className='mt-4 text-sm text-white/60'>
              No reactions yet. Be the first!
            </p>
          ) : (
            <div className='mt-4 space-y-4 text-left'>
              {entries.map((entry) => (
                <Review
                  key={entry.id}
                  name={entry.name}
                  stars={entry.stars}
                  text={entry.message}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
