import type { Message, VikaResponse } from "@/lib/types";

const fallbackFollowups = [
  "What can I do next time?",
  "How do I stay calm in the moment?",
  "Should there be a consequence after?",
];

export function fallbackVikaResponse(input: string): VikaResponse {
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();
  const tags = [
    lower.includes("bed") ? "bedtime" : null,
    lower.includes("school") || lower.includes("dress") ? "transition" : null,
    lower.includes("throw") || lower.includes("hit") ? "aggression" : null,
    lower.includes("scream") || lower.includes("meltdown") ? "meltdown" : null,
  ].filter(Boolean) as string[];

  return {
    validate:
      "This sounds like a very hard moment for both of you. Your child is showing stress with the tools they have available right now, and your calm presence can help their nervous system settle.",
    investigate:
      "Look at what happened just before the escalation: hunger, tiredness, a sudden transition, sensory overload, or a demand that felt too big. One small clue usually points to the best first support.",
    know:
      "When children are flooded, reasoning and lectures usually land too late. Regulation comes first, then repair and teaching once their body is calmer.",
    act:
      "Lower your voice, reduce the number of words, move close but give space, and offer one concrete next step. After calm returns, name what happened and practice the replacement behavior once.",
    suggested_followups: fallbackFollowups,
    behavior_tags: tags.length ? tags : ["stress", "coaching"],
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
