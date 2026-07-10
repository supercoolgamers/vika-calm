# Data And AI Flow

## Database Tables

Core coaching tables:

- `child_profiles`
- `conversations`
- `messages`
- `feedback`

Account and billing tables:

- `profiles`
- `subscriptions`
- `purchases`

## Message Storage

Each coaching exchange stores:

- Parent message row:
  - `role = parent`
  - `content = parent text`
  - `user_id`
  - `conversation_id`

- Coach message row:
  - `role = coach`
  - `content = combined VIKA text`
  - `vika_validate`
  - `vika_investigate`
  - `vika_know`
  - `vika_act`
  - `vika_source`
  - `vika_confidence`
  - `vika_review_status`
  - `suggested_followups`

Conversation rows also store:

- `title`
- `title_source`
- `title_confidence`
- `title_review_status`
- `behavior_tags`
- `message_count`

## AI Prompt Inputs

The current AI call may include:

- Latest parent message
- Conversation history
- Coaching mode
- Child profile name
- Child age
- Child flags
- Child notes
- Selected Vika knowledge sections

Because this can include sensitive child and family information, any future prompt work must also read `docs/security/PRIVACY_AND_DATA_MINIMIZATION.md`.

## AI Output Contract

`lib/vika-knowledge.ts` requires valid JSON with these keys:

- `validate`
- `investigate`
- `know`
- `act`
- `suggested_followups`
- `behavior_tags`
- `title`
- `confidence`

`lib/vika.ts` parses the response, falls back when fields are missing, slices follow-ups and tags to bounded lengths, and clamps confidence between 0 and 1.

## Clarification Behavior

If the first parent message lacks enough observable detail, Vika should ask clarifying questions rather than infer a likely cause.

Current logic in `lib/vika.ts` checks for:

- Very short input
- Missing observable action words
- Missing context words

When details are insufficient, the prompt instructs Vika to:

- Validate briefly
- Ask for before/during/after information
- Name all five C lenses
- Give a small safety or boundary script only if needed
- Ask the parent to reply with missing details

## Follow-Up Behavior

When a parent taps a suggested follow-up, `app/components/chat-panel.tsx` sends a `coachInstruction` telling Vika not to repeat the first response and to help implement the chosen idea.

Future follow-up changes should preserve this rule:

> Follow-ups should move the coaching forward, not restart the same answer.

## Fallback Behavior

If `OPENAI_API_KEY` is absent, `fallbackVikaResponse` creates a deterministic VIKA-style response. This protects local builds and basic UI behavior, but it is not a substitute for the full coaching model.

## Data Integrity Expectations

Every saved coach response should have:

- Non-empty VIKA fields
- A conversation ID
- A user ID when authenticated
- A source value
- Confidence and review status

Conversation `message_count` should reflect actual message rows.

