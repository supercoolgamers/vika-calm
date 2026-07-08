"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleSaved(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const id = String(formData.get("id") || "");
  const isSaved = String(formData.get("is_saved")) === "true";

  if (!user) {
    return;
  }

  if (id) {
    await supabase.from("conversations").update({ is_saved: !isSaved }).eq("id", id);
  }

  revalidatePath("/");
  revalidatePath("/conversations");
}
