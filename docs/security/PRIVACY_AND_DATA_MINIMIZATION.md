# Privacy And Data Minimization

Vika may process highly sensitive family context. Data minimization is a core product requirement.

## Sensitive Data Categories

Treat these as sensitive:

- Child name
- Child age
- Child profile notes
- Developmental flags
- Parent descriptions of difficult moments
- Conversation history
- AI-generated interpretations
- Feedback comments
- Subscription and billing identifiers

## Prompt Minimization

Before sending data to an AI provider, ask:

- Does the model need the child’s name?
- Does it need the full profile notes?
- Does it need the full conversation history or only recent turns?
- Can flags be summarized?
- Can the prompt use `your child` instead of the name?

The current implementation may send child name, age, flags, notes, latest parent input, and conversation history to OpenAI. Future work should reduce this where possible without weakening coaching quality.

## Response Minimization

API routes should return only fields needed by the UI.

Avoid `select("*")` in security-sensitive responses when a narrower field list is enough.

## Retention

Current retention behavior is not yet defined.

Before scaling, define:

- How long conversations are stored
- Whether users can delete conversations
- Whether child profiles can be fully deleted
- Whether AI prompts/responses are retained by third-party providers
- How backups and logs handle deleted data

## Analytics

Do not add analytics that capture full prompts, full AI responses, child notes, or profile flags.

Useful privacy-preserving metrics may include:

- Number of sessions created
- Response success/failure counts
- Latency buckets
- Follow-up chip click counts
- Error codes without sensitive content

## Exports And Uploads

The current app does not have user uploads or exports.

Before adding either:

- Define accepted file types
- Scan or validate uploads
- Enforce size limits
- Require ownership checks
- Avoid public buckets for private child/family data
- Add explicit user confirmation before export

## AI Provider Boundary

The AI provider should receive only what is necessary to produce the current response. Vika should not send unrelated database rows, full child histories, billing data, email addresses, or authentication data.

Never send:

- Supabase tokens
- User email unless strictly necessary
- Stripe IDs
- Internal database IDs unless required for technical routing
- Secrets

