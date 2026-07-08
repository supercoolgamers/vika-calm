# vika-calm — Product Requirements

## Problem
Parents facing meltdowns and challenging child behavior don't know what to do in the moment. They need immediate, evidence-based guidance — not a book chapter or a waiting list.

## Target User
Parents of children aged 2–12, especially those navigating meltdowns, emotional dysregulation, ADHD, autism, refusal, and daily behavior struggles.

## Core Objects
- **Child Profile** — name, age, flags (ADHD, autism, sensory, etc.)
- **Conversation** — a coaching session tied to one situation
- **Message** — parent input or coach reply; coach replies carry structured VIKA fields
- **Feedback** — post-session rating and comment

## MVP Must-Haves
- [ ] Parent can describe a challenging situation in a text box
- [ ] App returns a VIKA-structured coaching response (Validate / Investigate / Know / Act)
- [ ] Parent can send follow-up messages and receive contextual replies
- [ ] Conversation is saved and can be reopened
- [ ] Child profile can be created and linked to a conversation
- [ ] App is usable without login (demo mode); account creation unlocks saved history

## Non-Goals (v1)
Courses, video library, community, therapist portal, assessments, progress dashboards, mobile app, school reports, printable resources, appointment booking.

## Definition of Done
A parent visits the site, reads a demo conversation, enters a real situation for their child, receives a VIKA response within 10 seconds, sends at least one follow-up, and finds the conversation saved in their history — confirmed by a real row in the database, not mock data.
