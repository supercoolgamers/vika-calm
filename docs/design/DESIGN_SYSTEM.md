# Design System

The visual system should feel calm, warm, natural, premium, intelligent, and human.

The reference feeling is:

> Apple-level simplicity with the warmth of a beautifully designed therapy practice.

Avoid generic SaaS dashboards, medical portals, corporate productivity styling, and chatbot-heavy interfaces.

## Color Roles

Current CSS tokens live in `app/globals.css`.

Core roles:

- `--background`: warm linen page background
- `--surface`: soft ivory cards and inputs
- `--surface-soft`: quiet warm surface
- `--text-primary`: deep charcoal
- `--text-secondary`: warm grey
- `--border-subtle`: pale warm beige
- `--primary`: muted sage/eucalyptus
- `--primary-hover`: deeper muted sage
- `--primary-strong`: high-contrast sage
- `--accent`: terracotta
- `--focus-ring`: accessible warm focus outline

Avoid:

- Bright blue
- Stark white as the dominant surface
- Pure black for most text
- Very dark corporate green
- Strong gradients
- Glossy effects
- Heavy shadows

## Typography

The app currently uses system sans-serif typography.

Hierarchy:

- Hero: large, calm, confident, spacious
- Section heading: clear and much smaller than hero
- Card title: medium weight
- Body: warm grey, comfortable line-height
- Metadata: smaller but readable

Do not make every text element dark. Reserve deep charcoal for headings and important labels.

## Cards And Surfaces

Use cards only when they help the parent make a choice or understand a grouped interaction.

Cards are appropriate for:

- The two homepage pathways
- The active coaching form
- Recent conversation items
- Profile and account forms
- VIKA response sections

Avoid wrapping every explanatory section in a box. Use whitespace, rhythm, and editorial spacing instead.

## Buttons

Primary buttons:

- Muted sage background
- High-contrast text
- Comfortable touch target
- Subtle radius
- Clear hover/focus/disabled states

Secondary buttons:

- Soft ivory or transparent background
- Subtle warm border
- Charcoal or strong sage text

Button labels should be short:

- `Guide me`
- `Help me understand`
- `Save`
- `Retry`

## Forms

Forms should feel like a calm invitation, not a clinical intake form.

Use:

- Clear labels
- Soft ivory inputs
- Warm borders
- Spacious touch targets
- Observational placeholders

Avoid:

- Dense questionnaires on the homepage
- Clinical language unless necessary
- Multiple competing calls to action

## Mobile

Mobile matters because parents may open Vika during a difficult moment.

Mobile requirements:

- Main action visible quickly
- Buttons large enough to tap
- No horizontal scrolling
- No dense dashboard columns
- Prompt chips should wrap cleanly
- The composer should stack when needed

## Decorative Elements

Do not introduce cartoon illustrations.

If decorative elements are added, they should be extremely subtle and natural:

- Botanical line drawings
- Organic flowing shapes
- Gentle natural forms

Decoration must never compete with the parent’s next action.

