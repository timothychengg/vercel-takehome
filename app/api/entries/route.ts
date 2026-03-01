import { NextRequest, NextResponse } from 'next/server';
import { getEntries, addEntry } from '@/lib/kv';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const screeningId = searchParams.get('screeningId');

    if (!screeningId) {
      return NextResponse.json(
        { error: 'screeningId is required' },
        { status: 400 }
      );
    }

    const entries = await getEntries(screeningId);
    return NextResponse.json(entries);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to fetch entries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const screeningId = formData.get('screeningId');
    const name = formData.get('name');
    const message = formData.get('message');
    const stars = formData.get('stars');

    if (!screeningId || !name || !message || stars === null) {
      return NextResponse.json(
        { error: 'screeningId, name, message, and stars are required' },
        { status: 400 }
      );
    }

    const screeningIdStr = String(screeningId).trim();
    const starsNum = Math.min(
      5,
      Math.max(1, parseInt(String(stars), 10) || 1)
    );

    await addEntry(screeningIdStr, {
      name: String(name).trim(),
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
