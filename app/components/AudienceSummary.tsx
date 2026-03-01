'use client';

import { useCompletion } from '@ai-sdk/react';

type Props = {
  screeningId: string;
  movieTitle: string;
  entryCount: number;
  averageStars?: number;
  initialSummary?: string;
  variant?: 'default' | 'cream';
};

export function AudienceSummary({
  screeningId,
  movieTitle,
  entryCount,
  averageStars,
  initialSummary,
  variant = 'default',
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

  const isCream = variant === 'cream';

  return (
    <div
      className={
        isCream
          ? 'summary-box w-full text-left'
          : 'w-full max-w-md rounded-xl bg-white/5 border border-white/10 p-6 text-center'
      }
    >
      <div className={isCream ? 'flex items-baseline justify-between gap-4' : 'flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4'}>
        <h2
          className={
            isCream ? 'text-xl font-bold text-zinc-900' : 'text-lg font-semibold'
          }
        >
          Audience Summary
        </h2>
        {entryCount === 0 ? (
          <span
            className={
              isCream ? 'text-sm text-zinc-600' : 'text-xs text-white/50'
            }
          >
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

      <div
        className={
          isCream
            ? 'mt-4 grid grid-cols-[minmax(9rem,auto)_1fr] gap-x-4 gap-y-2 items-baseline text-base'
            : 'mt-3 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4 text-sm'
        }
      >
        {isCream ? (
          <>
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
          </>
        ) : (
          <>
            <span className="text-white/60">Tonight&apos;s Screening</span>
            <span className="font-semibold">{movieTitle}</span>
          </>
        )}
      </div>

      {!isCream && typeof averageStars === 'number' && (
        <div className="mt-2 text-sm text-white/80">
          Average rating: {averageStars.toFixed(1)} ★
        </div>
      )}

      {!isCream && (
        <div className="mt-4 min-h-[4rem] text-sm text-white/85">
          {completion ? (
            <p>
              <span className="font-bold">AI summary: </span>
              <span className="whitespace-pre-wrap">{completion}</span>
            </p>
          ) : isLoading ? (
            <p className="text-white/60 animate-pulse">Summarizing…</p>
          ) : (
            <p className="text-white/50">
              Click Generate to create an AI summary of the audience reactions.
            </p>
          )}
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-600">
          {error.message}
        </p>
      )}

    </div>
  );
}
