# System Overview

## Stack

Current application stack:

- Next.js App Router
- React
- Supabase Auth and Postgres
- Supabase RLS policies
- OpenAI chat completions through a server route
- Stripe checkout, portal, and webhook scaffolding
- Vercel deployment from GitHub

## Current Core Workflow

1. Parent opens `/`.
2. Parent chooses `Guide me` or `Help me understand`.
3. Parent enters text in the coaching composer.
4. `app/components/chat-panel.tsx` sends a POST request to `/api/chat`.
5. `app/api/chat/route.ts` authenticates the user with Supabase.
6. The route creates or loads a conversation.
7. It loads message history and optional child profile context.
8. `lib/vika.ts` builds the prompt and calls OpenAI through `generateVikaResponse`.
9. The route stores the parent message and coach response in `messages`.
10. The route updates conversation title, tags, and message count.
11. The UI renders a VIKA card and follow-up chips.

## Important Application Files

- `app/page.tsx`: homepage shell, recent conversations, framework section
- `app/components/home-experience.tsx`: pathway choice and homepage coaching entry
- `app/components/chat-panel.tsx`: client-side composer, optimistic message state, API call, follow-up handling
- `app/components/vika-card.tsx`: structured VIKA display
- `app/api/chat/route.ts`: main coaching API route
- `lib/vika.ts`: prompt assembly, fallback response, parsing, safety signpost
- `lib/vika-knowledge.ts`: system prompt and selected knowledge sections
- `lib/supabase/server.ts`: server Supabase client
- `lib/supabase/middleware.ts`: session refresh middleware
- `supabase/migrations/`: database schema and RLS

## Architecture Principles

1. Database first: core objects should persist even if AI is unavailable.
2. AI on top: AI populates structured coaching content, titles, tags, and follow-ups.
3. Server-side AI only: the browser must never call OpenAI directly.
4. User ownership: user-specific rows must be scoped to the authenticated user.
5. Observable data flow: parent input, AI response, and database writes should be easy to trace.
6. Graceful failure: OpenAI failures should not corrupt conversations or create orphaned rows.

## Current Implementation Notes

- The app currently requires authentication for `/api/chat` writes.
- The homepage still displays recent conversations returned by Supabase under current RLS policies.
- The AI response is expected as JSON and parsed into VIKA fields.
- If `OPENAI_API_KEY` is missing, `fallbackVikaResponse` is used.
- The production build currently skips TypeScript and lint validation through `next.config.ts`; run `npm run typecheck` manually when verifying changes.

## Deployment Rule

Deploy by GitHub push to `main`. Do not use `vercel deploy` for production because that can desynchronize deployed files from the repository.

