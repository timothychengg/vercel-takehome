import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export type Screening = {
  id: string;
  movieTitle: string;
  createdAt: string;
};

export type Entry = {
  id: string;
  screeningId: string;
  message: string;
  stars: number;
  createdAt: string;
};

function screeningKey(id: string) {
  return `screening:${id}`;
}

function entriesKey(screeningId: string) {
  return `screening:${screeningId}:entries`;
}

function summaryKey(screeningId: string) {
  return `screening:${screeningId}:summary`;
}

export async function getSummary(screeningId: string): Promise<string | null> {
  const raw = await redis.get(summaryKey(screeningId));
  if (!raw) return null;
  return typeof raw === 'string' ? raw : String(raw);
}

export async function saveSummary(screeningId: string, summary: string): Promise<void> {
  await redis.set(summaryKey(screeningId), summary);
}

export async function getScreening(id: string): Promise<Screening | null> {
  const raw = await redis.get(screeningKey(id));
  if (!raw) return null;
  return typeof raw === 'string' ? (JSON.parse(raw) as Screening) : (raw as Screening);
}

export async function createScreening(movieTitle: string): Promise<Screening> {
  const trimmed = movieTitle.trim();
  if (!trimmed) {
    throw new Error('Movie title is required');
  }
  const screening: Screening = {
    id: crypto.randomUUID(),
    movieTitle: trimmed,
    createdAt: new Date().toISOString(),
  };
  await redis.set(screeningKey(screening.id), JSON.stringify(screening));
  return screening;
}

export async function getEntries(screeningId: string): Promise<Entry[]> {
  const raw = await redis.lrange(entriesKey(screeningId), 0, -1);
  const entries = (raw ?? []).map((item) =>
    typeof item === 'string' ? (JSON.parse(item) as Entry) : (item as Entry)
  );
  return entries.reverse();
}

export async function addEntry(
  screeningId: string,
  entry: Omit<Entry, 'id' | 'screeningId' | 'createdAt'>
): Promise<Entry> {
  const full: Entry = {
    ...entry,
    id: crypto.randomUUID(),
    screeningId,
    createdAt: new Date().toISOString(),
  };
  await redis.lpush(entriesKey(screeningId), JSON.stringify(full));
  return full;
}
