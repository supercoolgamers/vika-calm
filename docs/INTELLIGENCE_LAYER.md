# Intelligence Layer

## Messy Parent Input → Structured Output
Parent types: _"He screamed for an hour at bedtime and threw his water bottle at me."_

System prompt instructs GPT-4o to return JSON:
```json
{
  "validate": "He is overwhelmed and does not yet have the words to express it.",
  "investigate": "What was the lead-up? Had he missed a nap? Was there a change to routine?",
  "know": "Bedtime resistance peaks at ages 2–4. Cortisol spikes from over-tiredness make self-regulation impossible.",
  "act": "Use a 3-step visual chart. Stay calm and close. Reduce demands. Offer one small choice.",
  "suggested_followups": [
    "How do I stay calm when he throws things?",
    "Should I give a consequence after?",
    "What if it happens again tomorrow night?"
  ],
  "behavior_tags": ["meltdown", "bedtime", "aggression"],
  "title": "Bedtime meltdown and bottle throwing",
  "confidence": 0.88
}
```

## What Gets Stored
- All four VIKA fields + source + confidence + review_status on every coach `message` row
- `behavior_tags` and `title` on the `conversation` row
- `suggested_followups` array on the coach message row

## Scoring Rules (v1 — rule-based)
- Confidence < 0.7 → flag message for human review (review_status = 'flagged')
- Tags containing 'aggression' or 'self-harm' → prepend a safety signpost to the Validate section

## v1 vs Later
| v1 | Later |
|---|---|
| VIKA response per message | Behavior pattern scoring across sessions |
| Auto-title + auto-tag | Trend alerts ("3 meltdowns this week") |
| Follow-up chip suggestions | Personalised coaching based on profile history |
