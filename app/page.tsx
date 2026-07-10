import Link from "next/link";
import { HomeExperience } from "@/app/components/home-experience";
import { createClient } from "@/lib/supabase/server";
import type { ChildProfile, Conversation } from "@/lib/types";

export default async function Home() {
  const supabase = await createClient();
  const [
    { data: conversations },
    { data: profiles },
    {
      data: { user },
    },
  ] = await Promise.all([
    supabase
      .from("conversations")
      .select("*, child_profiles(id, name, age_years)")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase.from("child_profiles").select("*").order("created_at", { ascending: false }),
    supabase.auth.getUser(),
  ]);

  return (
    <main className="app-frame">
      <section className="topbar">
        <div>
          <p className="eyebrow">VIKA Calm</p>
          <h1>Before you react, let’s understand what’s happening.</h1>
          <p className="hero-copy">
            Vika helps you look beneath the behavior, understand what your child may be
            communicating, and decide what to do next.
          </p>
        </div>
        <nav>
          <Link href="/conversations">Past sessions</Link>
          <Link href="/profiles">Children</Link>
          <Link href={user ? "/account" : "/login"}>{user ? "Account" : "Log in"}</Link>
        </nav>
      </section>

      <section className="workspace">
        <HomeExperience profiles={(profiles || []) as ChildProfile[]} />

        <aside className="side-pane">
          <div className="pane-heading">
            <div>
              <p className="eyebrow">Past sessions</p>
              <h2>Recent coaching</h2>
            </div>
            <Link className="secondary-link" href="/conversations">
              View all
            </Link>
          </div>
          {conversations?.length ? (
            <div className="conversation-list">
              {((conversations || []) as Conversation[]).map((conversation) => (
                <Link href={`/chat/${conversation.id}`} key={conversation.id} className="conversation-card">
                  {conversation.child_profiles?.name ? <small>{conversation.child_profiles.name}</small> : null}
                  <span>{conversation.title || "Untitled session"}</span>
                  <small>
                    {new Date(conversation.created_at).toLocaleDateString()}
                    {conversation.message_count > 2 ? ` · ${conversation.message_count} messages` : ""}
                  </small>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-panel">
              <h2>Your past conversations will appear here.</h2>
            </div>
          )}
        </aside>
      </section>

      <section className="framework-section" aria-labelledby="framework-heading">
        <div>
          <p className="eyebrow">VIKA framework</p>
          <h2 id="framework-heading">How Vika helps you think</h2>
        </div>
        <div className="framework-grid">
          <article>
            <h3>Validate</h3>
            <p>Help the child feel safer and more understood.</p>
          </article>
          <article>
            <h3>Investigate</h3>
            <p>Look at what happened before, during, and after.</p>
          </article>
          <article>
            <h3>Know</h3>
            <p>Consider the need, missing skill, or communication beneath the behavior.</p>
          </article>
          <article>
            <h3>Act</h3>
            <p>Choose a calm, practical next step.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
