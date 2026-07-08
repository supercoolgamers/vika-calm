"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function submitFeedback(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const conversationId = String(formData.get("conversation_id") || "");
  const rating = Number(formData.get("rating") || 0);

  if (!user) {
    redirect("/login");
  }

  await supabase.from("feedback").insert({
    user_id: user.id,
    conversation_id: conversationId || null,
    rating,
    comment: String(formData.get("comment") || "").trim() || null,
  });

  if (conversationId) {
    revalidatePath(`/chat/${conversationId}`);
  }
}
