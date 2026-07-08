import { NextResponse } from "next/server";
import { generateVikaResponse } from "@/lib/vika";
import { createClient } from "@/lib/supabase/server";
import type { ChildProfile, Message } from "@/lib/types";

function childContext(profile: ChildProfile | null) {
  if (!profile) return "";
  const parts = [
    profile.name,
    profile.age_years ? `${profile.age_years} years old` : null,
    profile.flags?.length ? `flags: ${profile.flags.join(", ")}` : null,
    profile.notes ? `notes: ${profile.notes}` : null,
  ].filter(Boolean);
  return parts.join("; ");
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();
  const message = String(body.message || "").trim();
  const conversationId = body.conversationId ? String(body.conversationId) : "";
  const childProfileId = body.childProfileId ? String(body.childProfileId) : null;

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  let conversation = null;
  if (conversationId) {
    const { data, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .single();
    if (error || !data) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }
    conversation = data;
  } else {
    const { data, error } = await supabase
      .from("conversations")
      .insert({ child_profile_id: childProfileId, title: "New coaching session" })
      .select("*")
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    conversation = data;
  }

  const { data: history } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversation.id)
    .order("created_at", { ascending: true });

  const { data: profile } = conversation.child_profile_id
    ? await supabase
        .from("child_profiles")
        .select("*")
        .eq("id", conversation.child_profile_id)
        .maybeSingle()
    : { data: null };

  let vika;
  try {
    vika = await generateVikaResponse({
      input: message,
      history: (history || []) as Message[],
      childContext: childContext(profile as ChildProfile | null),
    });
  } catch (error) {
    console.error("[api/chat]", error);
    return NextResponse.json(
      { error: "Something went wrong - please try again" },
      { status: 502 },
    );
  }

  const reviewStatus = vika.confidence < 0.7 ? "flagged" : "unreviewed";
  const coachContent = [vika.validate, vika.investigate, vika.know, vika.act].join("\n\n");

  const { data: insertedMessages, error: messageError } = await supabase
    .from("messages")
    .insert([
      {
        conversation_id: conversation.id,
        role: "parent",
        content: message,
        vika_source: null,
      },
      {
        conversation_id: conversation.id,
        role: "coach",
        content: coachContent,
        vika_validate: vika.validate,
        vika_investigate: vika.investigate,
        vika_know: vika.know,
        vika_act: vika.act,
        vika_source: process.env.OPENAI_API_KEY ? "openai" : "fallback",
        vika_confidence: vika.confidence,
        vika_review_status: reviewStatus,
        suggested_followups: vika.suggested_followups,
      },
    ])
    .select("*")
    .order("created_at", { ascending: true });

  if (messageError || !insertedMessages) {
    return NextResponse.json(
      { error: messageError?.message || "Could not save messages" },
      { status: 500 },
    );
  }

  const nextCount = (conversation.message_count || 0) + 2;
  const { data: updatedConversation } = await supabase
    .from("conversations")
    .update({
      title: !conversation.title || conversation.title === "New coaching session" ? vika.title : conversation.title,
      title_source: "openai",
      title_confidence: vika.confidence,
      title_review_status: reviewStatus,
      behavior_tags: vika.behavior_tags,
      message_count: nextCount,
    })
    .eq("id", conversation.id)
    .select("*")
    .single();

  return NextResponse.json({
    conversation: updatedConversation || { ...conversation, message_count: nextCount },
    parentMessage: insertedMessages.find((row) => row.role === "parent"),
    coachMessage: insertedMessages.find((row) => row.role === "coach"),
  });
}
