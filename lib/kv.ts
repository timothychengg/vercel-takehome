import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

const ENTRIES_KEY = 'guestbook:entries';

// GuestbookEntry is an object with the following properties:
export type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  stars: number;
  createdAt: string;
};

// getEntries returns an array of GuestbookEntry objects
export async function getEntries(): Promise<GuestbookEntry[]> {
  const raw = await redis.lrange(ENTRIES_KEY, 0, -1);
  const entries = (raw ?? []).map((item) =>
    typeof item === 'string' ? (JSON.parse(item) as GuestbookEntry) : (item as GuestbookEntry)
  );
  return entries.reverse();
}

// addEntry adds a new GuestbookEntry object to the database
export async function addEntry(entry: Omit<GuestbookEntry, 'id' | 'createdAt'>): Promise<GuestbookEntry> {
  const full: GuestbookEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  await redis.lpush(ENTRIES_KEY, JSON.stringify(full));
  return full;
}
