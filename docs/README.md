# Vika Calm Documentation

This directory is the source of truth for how Vika Calm should think, look, communicate, and behave.

Vika is not a generic parenting chatbot. Vika helps parents observe what happened, understand what may be underneath it, and respond with more calm and skill. Every product decision should support that sequence:

1. Calm
2. Observation
3. Understanding
4. Response
5. Practice over time

## How To Use These Docs

Before changing the app, read the documents that match the work:

- Product or copy changes: `docs/brand/` and `docs/clinical/`
- UI changes: `docs/design/`, then the relevant brand docs
- AI prompt or response changes: `docs/clinical/`, `docs/brand/`, and `docs/architecture/DATA_AND_AI_FLOW.md`
- Auth, database, API, or deployment changes: `docs/architecture/` and `docs/security/`
- Any change involving child/family data: `docs/security/` first

The older sprint documents in `/docs` remain useful historical planning references. The subfolders below are the durable product foundation.

## Current Product Shape

The current app is a Next.js App Router application using Supabase for auth/database, OpenAI for VIKA coaching responses, and Stripe for billing scaffolding. The core user job is:

> A parent describes what happened, receives a structured VIKA response, and can continue the conversation with context.

Core objects:

- `child_profiles`
- `conversations`
- `messages`
- `feedback`
- `profiles`
- `subscriptions`
- `purchases`

Core routes and components:

- `/` homepage and coaching entry
- `/chat/[id]` saved conversation thread
- `/conversations` conversation history
- `/profiles` child profiles
- `/account`, `/login`, `/signup`
- `POST /api/chat`
- Stripe checkout, portal, and webhook routes

## Documentation Map

### Brand

- `docs/brand/BRAND_FOUNDATION.md`
- `docs/brand/VOICE_AND_COPY.md`

### Clinical

- `docs/clinical/VIKA_FRAMEWORK.md`
- `docs/clinical/SAFETY_AND_SCOPE.md`

### Design

- `docs/design/DESIGN_SYSTEM.md`
- `docs/design/HOMEPAGE_UX.md`

### Architecture

- `docs/architecture/SYSTEM_OVERVIEW.md`
- `docs/architecture/DATA_AND_AI_FLOW.md`

### Security

- `docs/security/SECURITY_BASELINE.md`
- `docs/security/PRIVACY_AND_DATA_MINIMIZATION.md`

