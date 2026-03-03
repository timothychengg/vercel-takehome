import { NextRequest, NextResponse } from 'next/server';
import { getScreening, addEntry } from '@/lib/kv';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const screeningId = formData.get('screeningId');
    const message = formData.get('message');
    const stars = formData.get('stars');

    if (!screeningId || !message || stars === null) {
      return NextResponse.json(
        { error: 'screeningId, message, and stars are required' },
        { status: 400 }
      );
    }

    const screeningIdStr = String(screeningId).trim();
    const screening = await getScreening(screeningIdStr);
    if (!screening) {
      return NextResponse.json(
        { error: 'Screening not found' },
        { status: 404 }
      );
    }

    const starsNum = Math.min(
      5,
      Math.max(1, parseInt(String(stars), 10) || 1)
    );

    await addEntry(screeningIdStr, {
      message: String(message).trim(),
      stars: starsNum,
    });

    return NextResponse.redirect(
      new URL(`/board/${screeningIdStr}`, request.url)
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to add entry' },
      { status: 500 }
    );
  }
}
