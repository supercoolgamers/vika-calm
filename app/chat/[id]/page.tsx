import Link from "next/link";
import { notFound } from "next/navigation";
import { ChatPanel } from "@/app/components/chat-panel";
import { createClient } from "@/lib/supabase/server";
import type { ChildProfile, Message } from "@/lib/types";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: conversation }, { data: messages }, { data: profiles }] = await Promise.all([
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
    </main>
  );
}
