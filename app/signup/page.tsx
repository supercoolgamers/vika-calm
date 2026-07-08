import Link from "next/link";
import { signUp } from "@/app/auth/actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="auth-frame">
      <form action={signUp} className="profile-form auth-card">
        <p className="eyebrow">Save your history</p>
        <h1>Create an account</h1>
        {params.error ? (
          <p className="form-error">
            Signup did not work. Try a different email, or use Log in if you already created an account.
          </p>
        ) : null}
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" required />
        </label>
        <label className="field">
          <span>Password</span>
          <input name="password" type="password" minLength={8} required />
        </label>
        <button type="submit">Sign up</button>
        <Link href="/login">I already have an account</Link>
      </form>
    </main>
  );
}
