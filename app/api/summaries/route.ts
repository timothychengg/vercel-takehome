import { NextRequest, NextResponse } from 'next/server';
import { saveSummary } from '@/lib/kv';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const screeningId = body.screeningId as string | undefined;
    const summary = body.summary as string | undefined;

    if (!screeningId?.trim()) {
      return NextResponse.json(
        { error: 'screeningId is required' },
        { status: 400 }
      );
    }

    if (typeof summary !== 'string') {
      return NextResponse.json(
        { error: 'summary is required' },
        { status: 400 }
      );
    }

    await saveSummary(screeningId.trim(), summary);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to save summary' },
      { status: 500 }
    );
  }
}
