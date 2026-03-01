import { NextRequest, NextResponse } from 'next/server';
import { createScreening } from '@/lib/kv';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const movieTitle = formData.get('movieTitle');

    const screening = await createScreening(
      movieTitle ? String(movieTitle).trim() : 'Untitled Screening'
    );

    return NextResponse.redirect(new URL(`/board/${screening.id}`, request.url));
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to create screening' },
      { status: 500 }
    );
  }
}
