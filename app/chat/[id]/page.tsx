import Link from "next/link";
import { notFound } from "next/navigation";
import { ChatPanel } from "@/app/components/chat-panel";
import { submitFeedback } from "@/app/feedback/actions";
import { createClient } from "@/lib/supabase/server";
import type { ChildProfile, Message } from "@/lib/types";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: conversation }, { data: messages }, { data: profiles }, { data: feedback }] = await Promise.all([
    supabase
      .from("conversations")
      .select("*, child_profiles(id, name, age_years)")
      .eq("id", id)
      .single(),
    supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true }),
    supabase.from("child_profiles").select("*").order("created_at", { ascending: false }),
    supabase.from("feedback").select("id").eq("conversation_id", id).limit(1),
  ]);

  if (!conversation) {
    notFound();
  }

  return (
    <main className="app-frame">
      <section className="topbar compact-topbar">
        <div>
          <p className="eyebrow">Coaching session</p>
          <h1>{conversation.title || "New coaching session"}</h1>
          <p className="subtle">
            {conversation.child_profiles?.name
              ? `${conversation.child_profiles.name}${conversation.child_profiles.age_years ? `, ${conversation.child_profiles.age_years}` : ""}`
              : "No child profile linked"}
          </p>
        </div>
        <nav>
          <Link href="/">New</Link>
          <Link href="/conversations">History</Link>
          <Link href="/profiles">Profiles</Link>
        </nav>
      </section>
      <ChatPanel
        conversationId={id}
        initialMessages={(messages || []) as Message[]}
        profiles={(profiles || []) as ChildProfile[]}
      />
      {messages?.length && !feedback?.length ? (
        <form action={submitFeedback} className="feedback-form">
          <input type="hidden" name="conversation_id" value={id} />
          <h2>How helpful was this session?</h2>
          <label className="field">
            <span>Rating</span>
            <select name="rating" required defaultValue="5">
              <option value="5">5 - Very helpful</option>
              <option value="4">4 - Helpful</option>
              <option value="3">3 - Mixed</option>
              <option value="2">2 - Not quite</option>
              <option value="1">1 - Not helpful</option>
            </select>
          </label>
          <label className="field">
            <span>Comment</span>
            <textarea name="comment" rows={3} placeholder="What should VIKA improve?" />
          </label>
          <button type="submit">Send feedback</button>
        </form>
      ) : null}
    </main>
  );
}
