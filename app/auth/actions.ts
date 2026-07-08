"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect("/login?error=1");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email,
      subscription_status: "free",
    });
  }

  redirect("/");
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error || !data.user) {
    redirect("/signup?error=1");
  }

  if (data.session) {
    await supabase.from("profiles").upsert({
      id: data.user.id,
      email,
      subscription_status: "free",
    });

    redirect("/");
  }

  redirect("/login?notice=check-email");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const password = String(formData.get("password") || "");
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect("/account?error=1");
  }

  redirect("/account?updated=1");
}
