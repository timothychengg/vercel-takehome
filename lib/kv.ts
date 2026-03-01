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
  name?: string; // optional; defaults to "Anonymous"
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

export async function getScreening(id: string): Promise<Screening | null> {
  const raw = await redis.get(screeningKey(id));
  if (!raw) return null;
  return typeof raw === 'string' ? (JSON.parse(raw) as Screening) : (raw as Screening);
}

export async function createScreening(movieTitle: string): Promise<Screening> {
  const screening: Screening = {
    id: crypto.randomUUID(),
    movieTitle: movieTitle.trim() || 'Untitled Screening',
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
    name: entry.name?.trim() || undefined,
    id: crypto.randomUUID(),
    screeningId,
    createdAt: new Date().toISOString(),
  };
  await redis.lpush(entriesKey(screeningId), JSON.stringify(full));
  return full;
}
