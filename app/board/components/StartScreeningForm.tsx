'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function StartScreeningForm() {
  const [movieTitle, setMovieTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = movieTitle.trim();
    if (!trimmed) {
      setError('Movie title is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.set('movieTitle', trimmed);

      const res = await fetch('/api/screenings', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const message = data?.error ?? 'Failed to create screening';
        setError(message);
        return;
      }

      const data = await res.json();
      const id = data?.id;
      if (id) {
        router.push(`/board/${id}`);
      } else {
        setError('Created but could not redirect');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='mt-8 w-full max-w-md mx-auto space-y-4'
    >
      <div>
        <label
          htmlFor='movieTitle'
          className='block text-sm font-medium text-zinc-900'
        >
          Movie title
        </label>
        <input
          id='movieTitle'
          name='movieTitle'
          type='text'
          required
          minLength={1}
          value={movieTitle}
          onChange={(e) => setMovieTitle(e.target.value)}
          disabled={isSubmitting}
          className='mt-1 w-full rounded-lg border border-zinc-700/40 bg-white/70 px-4 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-800'
          placeholder='e.g. Interstellar'
        />
      </div>
      {error && (
        <p className='text-sm text-red-600'>{error}</p>
      )}
      <button
        type='submit'
        disabled={isSubmitting}
        className='w-full rounded-lg bg-[#5b1b1b] px-4 py-3 text-sm font-semibold text-amber-100 border border-amber-200/30 hover:bg-[#6b2222] disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {isSubmitting ? 'Creating…' : 'Create board →'}
      </button>
    </form>
  );
}
