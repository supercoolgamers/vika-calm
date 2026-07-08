# Data Model

## child_profiles
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | set at lock-down sprint |
| name | text | |
| date_of_birth | date | |
| age_years | int | |
| notes | text | free-form parent notes |
| flags | text[] | e.g. ['adhd','autism','sensory'] |
| created_at | timestamptz | |

## conversations
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| child_profile_id | uuid FK → child_profiles | nullable |
| title | text | AI-generated |
| title_source | text | 'openai' |
| title_confidence | numeric | 0–1 |
| title_review_status | text | 'unreviewed'\|'approved'\|'edited' |
| behavior_tags | text[] | AI-tagged |
| is_saved | boolean | parent-starred |
| message_count | int | |
| created_at | timestamptz | |

## messages
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| conversation_id | uuid FK → conversations | cascade delete |
| role | text | 'parent'\|'coach' |
| content | text | full raw text |
| vika_validate | text | AI field |
| vika_investigate | text | AI field |
| vika_know | text | AI field |
| vika_act | text | AI field |
| vika_source | text | 'openai' |
| vika_confidence | numeric | 0–1 |
| vika_review_status | text | 'unreviewed' |
| suggested_followups | text[] | AI-generated chips |
| created_at | timestamptz | |

## feedback
| Field | Type | Notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid nullable | |
| conversation_id | uuid FK nullable | |
| rating | int | 1–5 |
| comment | text | |
| created_at | timestamptz | |

## RLS
All tables: v1 open policies (select/all = true). Lock-down sprint replaces with `auth.uid() = user_id`.
