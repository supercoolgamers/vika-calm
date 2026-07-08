import Link from "next/link";
import { toggleSaved } from "@/app/conversations/actions";
import { createClient } from "@/lib/supabase/server";
import type { Conversation } from "@/lib/types";

export default async function ConversationsPage() {
  const supabase = await createClient();
  const { data: conversations } = await supabase
    .from("conversations")
    .select("*, child_profiles(id, name, age_years)")
    .order("created_at", { ascending: false });

  return (
    <main className="app-frame">
      <section className="topbar compact-topbar">
        <div>
          <p className="eyebrow">Saved history</p>
          <h1>Conversations</h1>
        </div>
        <nav>
          <Link href="/">New session</Link>
          <Link href="/profiles">Profiles</Link>
        </nav>
      </section>

      {conversations?.length ? (
        <section className="history-grid">
          {((conversations || []) as Conversation[]).map((conversation) => (
            <article key={conversation.id} className="history-card">
              <div>
                <Link href={`/chat/${conversation.id}`}>
                  <h2>{conversation.title || "Untitled session"}</h2>
                </Link>
                <p>
                  {conversation.child_profiles?.name || "No child linked"} ·{" "}
                  {new Date(conversation.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="tag-row">
                {(conversation.behavior_tags || []).slice(0, 4).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="card-footer">
                <small>{conversation.message_count} messages</small>
                <form action={toggleSaved}>
                  <input type="hidden" name="id" value={conversation.id} />
                  <input type="hidden" name="is_saved" value={String(conversation.is_saved)} />
                  <button type="submit">{conversation.is_saved ? "Saved" : "Save"}</button>
                </form>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className="empty-panel wide">
          <h2>Start your first coaching session</h2>
          <p>Saved conversations will appear here once you send a situation.</p>
          <Link href="/">Start a session</Link>
        </div>
      )}
    </main>
  );
}
