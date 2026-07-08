# Tasks & Sprints

## Sprint 1 — Database + VIKA Coaching Engine ⭐ v1 functional
**Goal:** A visitor can open the app, see demo conversations, type a real situation, and receive a VIKA coaching response — all persisted to the database.

- [ ] Apply migration SQL to Supabase (child_profiles, conversations, messages, feedback + v1 RLS + seed data)
- [ ] Build `/` homepage: show seed conversation list + prominent "Start a session" CTA
- [ ] Build `/chat/[id]` page: message thread + input box
- [ ] Loading state: typing indicator (animated dots) while AI responds
- [ ] Empty state on `/`: "Start your first coaching session — describe what's happening"
- [ ] Error state: "Something went wrong — please try again" with retry button
- [ ] Server API route `POST /api/chat`: build VIKA system prompt → call OpenAI → parse JSON → write parent message + coach reply to `messages` → return structured VIKA fields
- [ ] Render coach reply as VIKA card (4 labelled sections + follow-up chips)
- [ ] Increment `conversations.message_count` on each exchange
- [ ] Verify: submit situation → VIKA card appears → `messages` row confirmed in Supabase table viewer

**Definition of Done:** A new conversation started from the UI produces two persisted `messages` rows (one parent, one coach) with all four VIKA fields populated, confirmed in the Supabase dashboard.

---

## Sprint 2 — Child Profiles + Conversation List
**Goal:** Parents can manage child profiles and browse saved conversations.

- [ ] `/profiles` page: create/edit/delete child profile form (name, age, notes, flags)
- [ ] Empty state: "Add your first child's details to personalise coaching"
- [ ] `/conversations` page: list all conversations, show child name + first message preview + date
- [ ] Link conversation to a child profile (optional dropdown on new chat)
- [ ] Saved conversation detail: full read-only message thread
- [ ] Star/save toggle on conversation card
- [ ] Verify: create profile → start conversation linked to it → appears in list → reopen shows full thread

**Definition of Done:** Child profile and linked conversation appear in the database and list UI; thread reopens correctly from a saved URL.

---

## Sprint 3 — Conversation Continuity + Follow-ups
**Goal:** Multi-turn chat works; follow-up chips are tappable; conversations feel like real coaching.

- [ ] Multi-turn: send full message thread as context on each new parent message
- [ ] Follow-up chip tap pre-fills input and submits immediately
- [ ] Conversation title auto-set from AI on first reply (stored in `conversations.title`)
- [ ] Behavior tags auto-applied from AI response
- [ ] Safety signpost: if tags include 'self-harm', prepend a crisis resource line to Validate section
- [ ] Verify: 3-turn conversation → all messages persist → title auto-set → chips work

**Definition of Done:** A 3-message conversation (1 parent, 1 coach, 1 follow-up, 1 coach) is fully persisted and the title is set on the conversation row.

---

## Sprint 4 — Lock It Down (Auth + Per-User RLS)
**Goal:** Real users own their data; no user can see another user's conversations.

- [ ] Enable Supabase Auth: email + password signup and login
- [ ] `/login` and `/signup` pages
- [ ] Set `user_id` on all new rows at write time from `auth.uid()`
- [ ] Replace v1 open RLS policies with owner-scoped policies on all tables
- [ ] Seed/demo rows (`user_id = null`) remain readable to anonymous visitors
- [ ] Account page: show email, change password
- [ ] Redirect unauthenticated write attempts to `/login`
- [ ] Verify: user A cannot fetch user B's rows; anonymous visitor sees demo rows only

**Definition of Done:** Two test accounts created; each sees only their own conversations confirmed via Supabase RLS test in the dashboard.

---

## Sprint 5 — Feedback + Subscription Gating
**Goal:** Collect feedback; free tier limited to 5 conversations; paid tier unlimited.

- [ ] Post-session feedback prompt (rating 1–5 + optional comment) → `feedback` table
- [ ] Stripe Checkout: upgrade to paid plan
- [ ] `subscription_status` field on user profile (free/paid)
- [ ] Paywall modal when free limit reached (5 conversations)
- [ ] Stripe webhook: update subscription status on payment confirmed
- [ ] Verify: free user hits limit → paywall shown → upgrades → continues chatting

**Definition of Done:** A test user reaches 5 conversations, sees paywall, completes Stripe test checkout, and is unblocked — confirmed by subscription_status change in database.

---

## Gantt (Sprint → Week)
| Sprint | Week |
|---|---|
| 1 — DB + VIKA engine | Week 1 |
| 2 — Profiles + conversation list | Week 1–2 |
| 3 — Multi-turn + follow-ups | Week 2 |
| 4 — Auth + RLS lock-down | Week 2–3 |
| 5 — Feedback + subscriptions | Week 3 |
