import type { Message, VikaResponse } from "@/lib/types";

const fallbackFollowups = [
  "What can I do next time?",
  "How do I stay calm in the moment?",
  "Should there be a consequence after?",
];

function detectContext(input: string) {
  const lower = input.toLowerCase();
  const contexts = {
    bedtime: lower.includes("bed") || lower.includes("sleep") || lower.includes("night"),
    morning:
      lower.includes("morning") ||
      lower.includes("dress") ||
      lower.includes("shoes") ||
      lower.includes("school"),
    aggression:
      lower.includes("throw") ||
      lower.includes("hit") ||
      lower.includes("kick") ||
      lower.includes("bite"),
    refusal:
      lower.includes("refuse") ||
      lower.includes("won't") ||
      lower.includes("wouldn't") ||
      lower.includes("no "),
    sensory:
      lower.includes("loud") ||
      lower.includes("noise") ||
      lower.includes("scratchy") ||
      lower.includes("clothes"),
  };

  const tags = [
    contexts.bedtime ? "bedtime" : null,
    contexts.morning ? "transition" : null,
    contexts.aggression ? "aggression" : null,
    contexts.refusal ? "refusal" : null,
    contexts.sensory ? "sensory" : null,
    lower.includes("scream") || lower.includes("meltdown") ? "meltdown" : null,
  ].filter(Boolean) as string[];

  return { contexts, tags: tags.length ? tags : ["stress", "coaching"] };
}

export function fallbackVikaResponse(input: string): VikaResponse {
  const trimmed = input.trim();
  const { contexts, tags } = detectContext(trimmed);
  const setting = contexts.bedtime
    ? "bedtime"
    : contexts.morning
      ? "the morning transition"
      : contexts.refusal
        ? "the refusal"
        : "this moment";

  const prevention = contexts.bedtime
    ? "Tonight, make the next step tiny: bathroom, one book, lights. Use the same calm phrase each time and avoid renegotiating the whole routine."
    : contexts.morning
      ? "Tomorrow, set clothes and shoes out first, give a 5-minute warning, then offer one small choice: shirt first or shoes first."
      : "For the next repeat, lower the demand, offer one clear choice, and wait for the first small sign of cooperation before adding more words.";

  const safety = contexts.aggression
    ? "Move breakable or hard objects away first and give a little space while staying nearby."
    : "Stay close enough to feel available, but do not crowd them.";

  return {
    validate:
      `That sounds exhausting and stressful. In ${setting}, your child is probably already past the point where more explaining will help, and you are not failing because they escalated.`,
    investigate:
      "Look at the 10 minutes before it blew up: Were they hungry, tired, rushed, interrupted, surprised by a transition, or bothered by a sensory detail? Pick one likely trigger instead of trying to solve everything at once.",
    know:
      "When a child is flooded, the thinking part of the brain is not running the show. Short phrases, fewer choices, and physical calm work better than questions, lectures, or consequences in the middle of it.",
    act:
      `${safety} Say one sentence: "I will help you get through this." Then give one doable next step. ${prevention} After they are calm, do a brief repair: name what happened, name the limit, and practice the next step once.`,
    suggested_followups: contexts.morning
      ? [
          "What can I do tomorrow morning to prevent this?",
          "What should I say when they refuse?",
          "Should I give a consequence later?",
        ]
      : contexts.bedtime
        ? [
            "How do I stop bedtime from becoming a battle?",
            "What if they keep getting out of bed?",
            "How do I stay calm when I am exhausted?",
          ]
        : fallbackFollowups,
    behavior_tags: tags,
    title: trimmed.length > 52 ? `${trimmed.slice(0, 49)}...` : trimmed || "New coaching session",
    confidence: 0.72,
  };
}

export function addSafetySignpost(response: VikaResponse): VikaResponse {
  const safetyTags = response.behavior_tags.map((tag) => tag.toLowerCase());
  if (safetyTags.includes("self-harm")) {
    return {
      ...response,
      validate: `If there is immediate danger, call local emergency services now. ${response.validate}`,
    };
  }

  if (safetyTags.includes("aggression")) {
    return {
      ...response,
      validate: `First make sure everyone has physical space and any hard objects are out of reach. ${response.validate}`,
    };
  }

  return response;
}

export function parseVikaJson(raw: string, input: string): VikaResponse {
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  const parsed = JSON.parse(jsonMatch?.[0] ?? raw) as Partial<VikaResponse>;
  const fallback = fallbackVikaResponse(input);

  return addSafetySignpost({
    validate: parsed.validate || fallback.validate,
    investigate: parsed.investigate || fallback.investigate,
    know: parsed.know || fallback.know,
    act: parsed.act || fallback.act,
    suggested_followups:
      Array.isArray(parsed.suggested_followups) && parsed.suggested_followups.length
        ? parsed.suggested_followups.slice(0, 3)
        : fallback.suggested_followups,
    behavior_tags:
      Array.isArray(parsed.behavior_tags) && parsed.behavior_tags.length
        ? parsed.behavior_tags.slice(0, 6)
        : fallback.behavior_tags,
    title: parsed.title || fallback.title,
    confidence:
      typeof parsed.confidence === "number"
        ? Math.max(0, Math.min(1, parsed.confidence))
        : fallback.confidence,
  });
}

export function buildVikaPrompt(history: Message[], input: string, childContext: string) {
  const thread = history
    .map((message) => `${message.role === "parent" ? "Parent" : "Coach"}: ${message.content}`)
    .join("\n");

  return [
    {
      role: "system",
      content:
        "You are VIKA, an evidence-informed parenting coach for parents of children ages 2-12. Return only valid JSON with keys validate, investigate, know, act, suggested_followups, behavior_tags, title, confidence. Keep advice warm, concrete, nonjudgmental, and safe. Do not diagnose. If self-harm or immediate danger is mentioned, include behavior_tags with self-harm.",
    },
    {
      role: "user",
      content: `Child context: ${childContext || "No child profile selected."}\n\nConversation so far:\n${thread || "No previous messages."}\n\nLatest parent message: ${input}`,
    },
  ];
}

export async function generateVikaResponse({
  input,
  history,
  childContext,
}: {
  input: string;
  history: Message[];
  childContext: string;
}) {
  if (!process.env.OPENAI_API_KEY) {
    return fallbackVikaResponse(input);
  }

  const result = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o",
      temperature: 0.35,
      response_format: { type: "json_object" },
      messages: buildVikaPrompt(history, input, childContext),
    }),
  });

  if (!result.ok) {
    throw new Error(`OpenAI request failed with ${result.status}`);
  }

  const payload = await result.json();
  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI response did not include content");
  }

  return parseVikaJson(content, input);
}
