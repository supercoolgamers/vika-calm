# Security

## Secrets
- `OPENAI_API_KEY` and `STRIPE_SECRET_KEY` live only in Vercel environment variables — never in client code or git
- Supabase `service_role` key never leaves the server; client uses `anon` key only
- All AI calls go through a Next.js server-side API route — the parent's browser never touches OpenAI directly

## Permission Model
- **v1 (demo):** open RLS policies — all rows readable and writable; safe because no real user PII is stored yet
- **Lock-down sprint:** replace all policies with `auth.uid() = user_id`; users can only read/write their own rows; seed/demo rows have `user_id = null` and remain publicly readable
- Agent actions inherit the authenticated user's Supabase session — no elevated service-role calls from the frontend

## Approved Tools Only
- AI calls: `openai_chat_completion` only — no code-execution or file-write tools granted to the model
- DB writes: parameterised Supabase client calls only — no raw SQL from user input
- Payments: `stripe_create_subscription` and `stripe_create_checkout_session` only

## Audit Principle
Every coach message generation, conversation save, and subscription change is logged with actor, action, and timestamp. Logs are append-only and never exposed to the client.

## Stop Points
If implementing RLS changes or Stripe webhooks, the builder must manually verify in Supabase dashboard before marking done — do not trust code review alone.
