import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { getScreening, getEntries } from '@/lib/kv';
import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const screeningId = body.screeningId as string | undefined;

    if (!screeningId?.trim()) {
      return NextResponse.json(
        { error: 'screeningId is required' },
        { status: 400 }
      );
    }

    const screening = await getScreening(screeningId.trim());
    if (!screening) {
      return NextResponse.json(
        { error: 'Screening not found' },
        { status: 404 }
      );
    }

    const entries = await getEntries(screeningId.trim());
    if (entries.length === 0) {
      return NextResponse.json(
        { error: 'No entries to summarize' },
        { status: 400 }
      );
    }

    const entriesText = entries
      .map((e) => `- Anonymous (${e.stars}★): ${e.message}`)
      .join('\n');

    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: `You are summarizing audience reactions from a movie screening. Be concise (2-4 sentences). Capture the overall sentiment, what people praised, and any common criticisms or debates.`,
      prompt: `Summarize these audience reactions for "${screening.movieTitle}":

${entriesText}`,
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
