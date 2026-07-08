import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut, updatePassword } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <main className="app-frame">
      <section className="topbar compact-topbar">
        <div>
          <p className="eyebrow">Account</p>
          <h1>{user.email}</h1>
          <p className="subtle">Plan: {profile?.subscription_status || "free"}</p>
        </div>
        <nav>
          <Link href="/">New session</Link>
          <Link href="/conversations">History</Link>
        </nav>
      </section>

      <form action={updatePassword} className="profile-form">
        <h2>Change password</h2>
        <label className="field">
          <span>New password</span>
          <input name="password" type="password" minLength={8} required />
        </label>
        <button type="submit">Update password</button>
      </form>

      <form action={signOut} className="profile-form">
        <button type="submit">Log out</button>
      </form>
    </main>
  );
}
