'use client';

import { useCompletion } from '@ai-sdk/react';

type Props = {
  screeningId: string;
  movieTitle: string;
  entryCount: number;
  averageStars?: number;
  initialSummary?: string;
};

export function AudienceSummary({
  screeningId,
  movieTitle,
  entryCount,
  averageStars,
  initialSummary,
}: Props) {
  const {
    completion,
    complete,
    isLoading,
    error,
    stop,
  } = useCompletion({
    api: '/api/summarize',
    body: { screeningId },
    initialCompletion: initialSummary ?? '',
    onFinish: async (_, finalCompletion) => {
      if (finalCompletion?.trim()) {
        await fetch('/api/summaries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ screeningId, summary: finalCompletion }),
        });
      }
    },
  });

  const handleGenerate = () => {
    complete('');
  };

  return (
    <div className='summary-box w-full text-left'>
      <div className='flex items-baseline justify-between gap-4'>
        <h2 className='text-xl font-bold text-zinc-900'>
          Audience Summary
        </h2>
        {entryCount === 0 ? (
          <span className='text-sm text-zinc-600'>
            Add reactions first
          </span>
        ) : (
          <button
            type="button"
            onClick={isLoading ? stop : handleGenerate}
            disabled={entryCount === 0}
            className="rounded-lg bg-[#5b1b1b] px-3 py-1.5 text-xs font-medium text-amber-100 border border-amber-200/30 hover:bg-[#6b2222] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Stop' : 'Generate'}
          </button>
        )}
      </div>

      <div className='mt-4 grid grid-cols-[minmax(9rem,auto)_1fr] gap-x-4 gap-y-2 items-baseline text-base'>
        <span className="text-zinc-600">Tonight&apos;s Screening</span>
        <span className="font-bold text-zinc-900">{movieTitle}</span>
        {typeof averageStars === 'number' && (
          <>
            <span className="text-zinc-600">Average rating</span>
            <span className="text-zinc-900">{averageStars.toFixed(1)} ★</span>
          </>
        )}
        <span className="font-bold text-zinc-900 pt-1">AI summary</span>
        <span className={`text-zinc-600 whitespace-pre-wrap pt-1 ${isLoading ? 'animate-pulse' : ''}`}>
          {completion ?? (isLoading ? 'Summarizing…' : 'Click Generate to create an AI summary of the audience reactions.')}
        </span>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
}
