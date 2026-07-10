# Security Baseline

Vika stores sensitive family and child-related information. Security decisions must be treated as product decisions, not implementation details.

## Current Authentication

The app uses Supabase Auth with email/password.

Relevant files:

- `app/auth/actions.ts`
- `lib/supabase/server.ts`
- `lib/supabase/middleware.ts`
- `middleware.ts`

Server routes and server actions use `supabase.auth.getUser()` to identify the current user.

## Current Protected Areas

Authenticated or session-dependent areas include:

- `POST /api/chat`
- `POST /api/stripe/checkout`
- `POST /api/stripe/portal`
- profile create/update/delete server actions
- conversation save server action
- feedback submit server action
- account page

Stripe webhooks are protected by Stripe signature verification, not by Supabase user login.

## Data Ownership Rule

Never trust an ID sent by the browser.

For any user-owned row, server code should verify ownership directly in the query or before linking records.

Required pattern:

- Read/update/delete by both `id` and authenticated `user_id`
- Verify child profile ownership before linking it to a conversation
- Verify conversation ownership before adding messages or feedback
- Return 404 or a generic not-found response when ownership fails

Do not rely only on frontend hiding, route structure, or user-supplied IDs.

## RLS

Supabase RLS is required, but app-level ownership checks are still expected.

Current migrations:

- `0001_init.sql` created initial tables and open v1 policies
- `0002_auth_billing_rls.sql` replaces those policies with owner-scoped policies

Before production use with real families, confirm live Supabase policies match the locked-down migration.

## Secrets

Secrets must never be committed.

Public variables may start with `NEXT_PUBLIC_` only when they are safe for the browser.

Server-only secrets include:

- `OPENAI_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

The browser must never call OpenAI directly.

## Logging

Do not log:

- Full parent prompts
- Full AI responses
- Child profile notes
- Diagnoses or flags
- API keys
- Session cookies
- Stripe secrets

Safe logs should use IDs, counts, status codes, and short error types where possible.

## Security Headers And CSRF

Future production hardening should include:

- Security headers
- Origin checks for state-changing routes
- CSRF strategy for server actions and POST routes
- Rate limiting for auth, AI, feedback, profile writes, and billing routes

Do not claim these protections exist unless they are implemented and tested.

## Build Verification

`next.config.ts` currently skips type and lint validation during production build. Contributors should run:

```bash
npm run typecheck
npm run build
```

Do not report tests as passing unless they actually ran.

