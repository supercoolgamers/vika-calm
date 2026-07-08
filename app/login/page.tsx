import Link from "next/link";
import { signIn } from "@/app/auth/actions";

export default function LoginPage() {
  return (
    <main className="auth-frame">
      <form action={signIn} className="profile-form auth-card">
        <p className="eyebrow">Welcome back</p>
        <h1>Log in</h1>
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" required />
        </label>
        <label className="field">
          <span>Password</span>
          <input name="password" type="password" required />
        </label>
        <button type="submit">Log in</button>
        <Link href="/signup">Create an account</Link>
      </form>
    </main>
  );
}
