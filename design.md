# Room Review — Design Document

**Version:** 1.0  
**Status:** Implemented (MVP)  
**Last updated:** March 2025

---

## 1. Problem & Context

### Problem

Movie screenings (friends, film clubs, festivals) often end with scattered reactions. There's no simple way to capture and summarize what the group thought.

### Context

- Early-stage AI startup MVP
- Take-home assignment: guestbook app with AI
- Constraints: Next.js, Vercel, any DB, any AI service
- Scope: clarity of thinking and fundamentals, not production hardening

---

## 2. Goals & Non-Goals

### Goals

| Goal | Priority |
|------|----------|
| Public homepage explaining the product | Must |
| Separate page for guestbook entries | Must |
| Users submit messages and see all entries | Must |
| AI enhances the experience | Must |
| Deploy on Vercel | Must |
| Use a database for persistence | Must |

### Non-Goals

- User authentication
- Spam protection
- Production hardening
- Complex queries (e.g., "all screenings by user")
- Real-time updates across devices

---

## 3. Proposed Solution

### Product Concept

**Room Review** — a screening-scoped guestbook. Each screening gets its own board and shareable link. Guests submit reactions (message + 1–5 stars). AI summarizes the room's feedback into an "Audience Summary."

### Core User Flow

1. **Homepage** — Marketing page → "Start a screening"
2. **Create screening** — Enter movie title → create board → redirect to `/board/{id}`
3. **Board** — Share link; guests submit reactions; AI streams a summary

### Differentiator

Per-screening boards instead of one global guestbook. One shared moment = one board.

---

## 4. Technical Design

### Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 14 (App Router) | Assignment requirement; good fit for static + dynamic |
| Styling | Tailwind CSS | Fast iteration |
| Database | Upstash Redis (KV) | Serverless-friendly, append-only, no pooling |
| AI | Vercel AI SDK + OpenAI (gpt-4o-mini) | Streaming UX, Vercel-native |
| Deployment | Vercel | Assignment requirement |

### Data Model

**Screening**

- `id` (UUID)
- `movieTitle` (string)
- `createdAt` (ISO timestamp)

**Entry**

- `id` (UUID)
- `screeningId` (string)
- `message` (string)
- `stars` (1–5)
- `createdAt` (ISO timestamp)

**Redis Keys**

- `screening:{id}` — Screening metadata (JSON)
- `screening:{id}:entries` — List of entry objects (JSON strings)
- `screening:{id}:summary` — Cached AI summary (string)

### Routes & Rendering

| Route | Type | Reason |
|-------|------|--------|
| `/` | Static | No dynamic data; CDN cache |
| `/board` | Dynamic | Creates screenings; writes to DB |
| `/board/[id]` | Dynamic | Reads entries and summary from Redis |

### API Surface

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/screenings` | POST | Create screening, redirect to board |
| `/api/entries` | POST | Add entry (form POST + redirect) |
| `/api/summarize` | POST | Stream AI summary (Vercel AI SDK) |
| `/api/summaries` | POST | Persist summary to Redis |

### Component Boundaries

- **Server Components:** Board page (fetches screening, entries, summary)
- **Client Components:** `AudienceSummary` (useCompletion, streaming), `CopyLinkButton` (clipboard)

---

## 5. Alternatives Considered

### Database: Redis vs Postgres

| Option | Pros | Cons |
|--------|------|------|
| **Redis (chosen)** | Serverless-friendly, no pooling, append-only fits guestbook | No complex queries, no full-text search |
| Postgres | Rich queries, relational model | Connection pooling, migrations, heavier for MVP |

**Decision:** Redis. Simple, fast to ship, and sufficient for this scope.

### Form Submission: POST + Redirect vs Client Fetch

| Option | Pros | Cons |
|--------|------|------|
| **POST + Redirect (chosen)** | Works without JS, simple, no client state | Full page reload, no optimistic updates |
| Client fetch | Optimistic updates, better error handling | More client logic, JS required |

**Decision:** POST + Redirect for MVP simplicity. Client fetch is a clear next step.

### Board Model: Global vs Per-Screening

| Option | Pros | Cons |
|--------|------|------|
| **Per-screening (chosen)** | Clear mental model, shareable links, scoped data | More keys, no global view |
| Global | Single guestbook, simpler | Mixed reactions, no per-event context |

**Decision:** Per-screening. Matches "one shared moment" and keeps data scoped.

---

## 6. Tradeoffs & Risks

| Tradeoff | Impact | Mitigation |
|----------|--------|------------|
| KV limits query flexibility | Can't do "all screenings by user" or full-text search | Acceptable for MVP; migrate to Postgres if needed |
| Static homepage | Content changes require redeploy | Fine for marketing page |
| No cache invalidation | Board refetches on every request | Add `revalidatePath` after new entry |
| Full page reload on submit | Feels slower than SPA | Add optimistic updates later |
| No real-time sync | Other viewers don't see new entries until refresh | Add polling or push later |

---

## 7. Open Questions / Future Work

1. **Caching** — Use `revalidatePath` in entries POST handler.
2. **Optimistic updates** — Switch to client-side fetch for entry submission.
3. **Pagination** — Use `LRANGE` with offset/limit for large boards.
4. **Real-time** — Polling (e.g., SWR) or push (Pusher/Ably) for live updates.

---

## 8. Appendix: File Structure

```
app/
├── page.tsx                    # Marketing homepage (static)
├── board/
│   ├── page.tsx                # Create screening form
│   └── [id]/page.tsx           # Board: entries + AI summary
└── api/
    ├── screenings/route.ts
    ├── entries/route.ts
    ├── summarize/route.ts
    └── summaries/route.ts
lib/
└── kv.ts                       # Redis operations
```
