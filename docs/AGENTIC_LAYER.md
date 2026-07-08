# Agentic Layer

## Risk Levels & Actions

### Low — Auto-execute (no approval needed)
| Action | Trigger | Tool |
|---|---|---|
| Generate VIKA response | Parent submits message | `openai_chat_completion` |
| Auto-title conversation | First message sent | `openai_chat_completion` |
| Auto-tag behavior type | Coach reply received | `openai_chat_completion` |
| Suggest follow-up chips | After each coach reply | `openai_chat_completion` |

### Medium — Logged, reviewable
| Action | Trigger | Tool |
|---|---|---|
| Flag low-confidence response | confidence < 0.7 | `supabase_update` (review_status) |
| Safety signpost injection | tag = 'self-harm' | `template_insert` |

### High — Always requires approval
| Action | Trigger | Tool |
|---|---|---|
| Send marketing email | Campaign trigger | human approval required |
| Apply subscription charge | Upgrade flow | `stripe_create_subscription` (builder confirms) |

### Critical — Human only
| Action | Notes |
|---|---|
| Delete a user account + data | Builder action only |
| Issue refund | Manual via Stripe dashboard |

## Audit Log Fields (on every meaningful action)
`action_type`, `actor_id`, `target_table`, `target_id`, `payload_summary`, `risk_level`, `created_at`

## v1 Scope
Only Low-risk auto-actions ship in v1. Medium and above come in Sprint 3+.
