import { NextRequest, NextResponse } from 'next/server';
import { createScreening } from '@/lib/kv';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const movieTitle = formData.get('movieTitle');
    const trimmed = movieTitle ? String(movieTitle).trim() : '';

    if (!trimmed) {
      return NextResponse.json(
        { error: 'Movie title is required' },
        { status: 400 }
      );
    }

    const screening = await createScreening(trimmed);

    const accept = request.headers.get('Accept') ?? '';
    if (accept.includes('application/json')) {
      return NextResponse.json({ id: screening.id });
    }

    return NextResponse.redirect(new URL(`/board/${screening.id}`, request.url));
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to create screening' },
      { status: 500 }
    );
  }
}
