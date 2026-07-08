import Link from "next/link";
import { ChatPanel } from "@/app/components/chat-panel";
import { createClient } from "@/lib/supabase/server";
import type { ChildProfile, Conversation } from "@/lib/types";

export default async function Home() {
  const supabase = await createClient();
  const [{ data: conversations }, { data: profiles }] = await Promise.all([
    supabase
      .from("conversations")
      .select("*, child_profiles(id, name, age_years)")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase.from("child_profiles").select("*").order("created_at", { ascending: false }),
  ]);

  return (
    <main className="app-frame">
      <section className="topbar">
        <div>
          <p className="eyebrow">VIKA Calm</p>
          <h1>Coaching for the hard moment happening right now.</h1>
        </div>
        <nav>
          <Link href="/conversations">History</Link>
          <Link href="/profiles">Profiles</Link>
        </nav>
      </section>

      <section className="workspace">
        <div className="primary-pane">
          <div className="pane-heading">
            <div>
              <p className="eyebrow">Start a session</p>
              <h2>Describe what happened.</h2>
            </div>
            <Link className="secondary-link" href="/conversations">
              Saved sessions
            </Link>
          </div>
          <ChatPanel
            initialMessages={[]}
            profiles={(profiles || []) as ChildProfile[]}
          />
        </div>

        <aside className="side-pane">
          <div className="pane-heading">
            <div>
              <p className="eyebrow">Demo conversations</p>
              <h2>Recent coaching</h2>
            </div>
          </div>
          {conversations?.length ? (
            <div className="conversation-list">
              {((conversations || []) as Conversation[]).map((conversation) => (
                <Link href={`/chat/${conversation.id}`} key={conversation.id} className="conversation-card">
                  <span>{conversation.title || "Untitled session"}</span>
                  <small>
                    {conversation.child_profiles?.name || "No child linked"} ·{" "}
                    {conversation.message_count} messages
                  </small>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-panel">
              <h2>Start your first coaching session</h2>
              <p>Describe what is happening and VIKA will save the thread here.</p>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}
