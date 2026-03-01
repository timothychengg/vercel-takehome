import { NextRequest, NextResponse } from 'next/server';
import { getEntries, addEntry } from '@/lib/kv';

// GET request "route" to fetch all entries
export async function GET() {
  try {
    const entries = await getEntries();
    return NextResponse.json(entries);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
  }
}

// POST request "route" to add a new entry
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const message = formData.get('message');
    const stars = formData.get('stars');

    if (!name || !message || stars === null) {
      return NextResponse.json(
        { error: 'name, message, and stars are required' },
        { status: 400 }
      );
    }

    const starsNum = Math.min(5, Math.max(1, parseInt(String(stars), 10) || 1));

    await addEntry({
      name: String(name).trim(),
      message: String(message).trim(),
      stars: starsNum,
    });

    return NextResponse.redirect(new URL('/board', request.url));
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to add entry' }, { status: 500 });
  }
}
