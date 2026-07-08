# Test Plan

## Core Success Scenario (manual)
1. Open the app homepage as an anonymous visitor
2. **Expect:** 2 demo conversations visible; no login wall
3. Click "Start a session"
4. Type: _"My 5-year-old threw his shoes this morning and screamed for 20 minutes when I asked him to get dressed"_
5. **Expect:** Typing indicator appears within 1 second
6. **Expect:** VIKA card appears with all four labelled sections (Validate / Investigate / Know / Act) within 10 seconds
7. **Expect:** Three follow-up chips below the card
8. Tap chip: _"What can I do tomorrow morning to prevent this?"_
9. **Expect:** New coach reply appears in context; chips refresh
10. Open Supabase table viewer → `messages` table
11. **Expect:** 4 rows present (2 parent, 2 coach) with `vika_act` populated on coach rows
12. Navigate to `/conversations`
13. **Expect:** New conversation listed with auto-generated title and child name (if linked)
14. Click conversation → **Expect:** Full thread replays correctly

## Empty State Tests
- `/conversations` with no rows: "Start your first coaching session" copy visible
- `/profiles` with no profiles: "Add your first child's details" copy visible
- New conversation before typing: input placeholder "Describe what just happened with your child…" visible; submit disabled

## Error State Tests
- Simulate OpenAI API failure (block network or use invalid key): **Expect** "Something went wrong — please try again" message; no broken UI; no orphaned `messages` row with null content
- Submit empty input: **Expect** button remains disabled; no API call fired

## Auth Tests (Sprint 4)
- Create User A, create a conversation
- Create User B, attempt to fetch User A's conversation ID directly via URL
- **Expect:** 404 or empty result; confirmed by Supabase RLS test mode

## Data Integrity Checks
- Every coach message row must have non-null `vika_validate`, `vika_investigate`, `vika_know`, `vika_act`
- `conversation.message_count` must equal actual count of `messages` rows for that conversation
- `title` must be set on conversation after first coach reply
