import Link from "next/link";
import { createProfile, deleteProfile, updateProfile } from "@/app/profiles/actions";
import { createClient } from "@/lib/supabase/server";
import type { ChildProfile } from "@/lib/types";

export default async function ProfilesPage() {
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("child_profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="app-frame">
      <section className="topbar compact-topbar">
        <div>
          <p className="eyebrow">Personalise coaching</p>
          <h1>Child profiles</h1>
        </div>
        <nav>
          <Link href="/">New session</Link>
          <Link href="/conversations">History</Link>
        </nav>
      </section>

      <form action={createProfile} className="profile-form">
        <div className="form-grid">
          <label className="field">
            <span>Name</span>
            <input name="name" required placeholder="Avery" />
          </label>
          <label className="field">
            <span>Age</span>
            <input name="age_years" min="1" max="18" type="number" placeholder="5" />
          </label>
        </div>
        <label className="field">
          <span>Flags</span>
          <input name="flags" placeholder="adhd, sensory, bedtime" />
        </label>
        <label className="field">
          <span>Notes</span>
          <textarea name="notes" rows={3} placeholder="What should VIKA know?" />
        </label>
        <button type="submit">Add profile</button>
      </form>

      {profiles?.length ? (
        <section className="profiles-grid">
          {((profiles || []) as ChildProfile[]).map((profile) => (
            <article className="profile-card" key={profile.id}>
              <form action={updateProfile} className="profile-edit-form">
                <input type="hidden" name="id" value={profile.id} />
                <div className="form-grid">
                  <label className="field">
                    <span>Name</span>
                    <input name="name" required defaultValue={profile.name} />
                  </label>
                  <label className="field">
                    <span>Age</span>
                    <input
                      name="age_years"
                      min="1"
                      max="18"
                      type="number"
                      defaultValue={profile.age_years || ""}
                    />
                  </label>
                </div>
                <label className="field">
                  <span>Flags</span>
                  <input name="flags" defaultValue={(profile.flags || []).join(", ")} />
                </label>
                <label className="field">
                  <span>Notes</span>
                  <textarea name="notes" rows={3} defaultValue={profile.notes || ""} />
                </label>
                <div className="button-row">
                  <button type="submit">Save</button>
                </div>
              </form>
              <form action={deleteProfile}>
                <input type="hidden" name="id" value={profile.id} />
                <button className="danger-button" type="submit">
                  Delete
                </button>
              </form>
            </article>
          ))}
        </section>
      ) : (
        <div className="empty-panel wide">
          <h2>Add your first child's details to personalise coaching</h2>
          <p>Profiles can be linked when you start a new coaching session.</p>
        </div>
      )}
    </main>
  );
}
