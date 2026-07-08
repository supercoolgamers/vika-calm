"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function flagsFromForm(value: FormDataEntryValue | null) {
  return String(value || "")
    .split(",")
    .map((flag) => flag.trim().toLowerCase())
    .filter(Boolean);
}

export async function createProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const name = String(formData.get("name") || "").trim();
  const age = Number(formData.get("age_years") || 0);

  if (!user) {
    redirect("/login");
  }

  if (!name) {
    redirect("/profiles?error=name");
  }

  await supabase.from("child_profiles").insert({
    name,
    user_id: user.id,
    age_years: Number.isFinite(age) && age > 0 ? age : null,
    notes: String(formData.get("notes") || "").trim() || null,
    flags: flagsFromForm(formData.get("flags")),
  });

  revalidatePath("/");
  revalidatePath("/profiles");
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const age = Number(formData.get("age_years") || 0);

  if (!user) {
    redirect("/login");
  }

  if (!id || !name) {
    redirect("/profiles?error=missing");
  }

  await supabase
    .from("child_profiles")
    .update({
      name,
      age_years: Number.isFinite(age) && age > 0 ? age : null,
      notes: String(formData.get("notes") || "").trim() || null,
      flags: flagsFromForm(formData.get("flags")),
    })
    .eq("id", id);

  revalidatePath("/");
  revalidatePath("/profiles");
  revalidatePath("/conversations");
}

export async function deleteProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const id = String(formData.get("id") || "");

  if (!user) {
    redirect("/login");
  }

  if (id) {
    await supabase.from("child_profiles").delete().eq("id", id);
  }

  revalidatePath("/");
  revalidatePath("/profiles");
  revalidatePath("/conversations");
}
