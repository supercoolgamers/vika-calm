# Architecture

## Stack
- **Frontend:** Next.js 14 (App Router) on Vercel
- **Database + Auth:** Supabase (Postgres, RLS, Auth)
- **AI:** OpenAI GPT-4o via server-side API route
- **Payments (Sprint 5):** Stripe

## What Runs Now vs Later
| Now | Later |
|---|---|
| VIKA chat engine | Behavior trend dashboard |
| Child profiles | Therapist portal |
| Saved conversations | Mobile app |
| Demo mode (no login) | Courses / video library |
| Account + RLS lock-down | Subscription analytics |

## Key User Action — Step by Step
1. Parent types a situation into the chat input
2. Next.js API route receives the text + conversation history
3. Server builds the VIKA system prompt and calls OpenAI (GPT-4o)
4. Streamed response is parsed into four VIKA sections server-side
5. Both the parent message and coach reply are written to `messages` table
6. `conversations.message_count` is incremented
7. UI renders the structured VIKA card + three suggested follow-up chips
8. Parent taps a chip or types a reply → loop repeats with full thread context

## Layer Order
1. **Data first** — tables, constraints, and RLS policies
2. **App logic** — forms, API routes, CRUD — works even if AI is disabled
3. **Intelligence on top** — OpenAI generates VIKA content; if the call fails, a graceful error is shown and no data is corrupted

## Core Without AI
The conversation list, child profiles, and saved message display all work from the database alone. The AI only populates the VIKA fields — everything else is plain CRUD.
