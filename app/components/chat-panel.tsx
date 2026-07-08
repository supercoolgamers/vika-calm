"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { VikaCard } from "@/app/components/vika-card";
import type { ChildProfile, Message } from "@/lib/types";

export function ChatPanel({
  conversationId,
  initialMessages,
  profiles,
}: {
  conversationId?: string;
  initialMessages: Message[];
  profiles: ChildProfile[];
}) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [childProfileId, setChildProfileId] = useState("");
  const [error, setError] = useState("");
  const [upgradeRequired, setUpgradeRequired] = useState(false);
  const [isPending, startTransition] = useTransition();

  const canSubmit = input.trim().length > 0 && !isPending;
  const latestCoach = useMemo(
    () => [...messages].reverse().find((message) => message.role === "coach"),
    [messages],
  );

  async function submit(text = input) {
    const content = text.trim();
    if (!content) return;

    setError("");
    setInput("");
    const optimistic: Message = {
      id: `pending-${Date.now()}`,
      conversation_id: conversationId || "pending",
      role: "parent",
      content,
      vika_validate: null,
      vika_investigate: null,
      vika_know: null,
      vika_act: null,
      vika_confidence: null,
      vika_review_status: null,
      suggested_followups: null,
      created_at: new Date().toISOString(),
    };
    setMessages((current) => [...current, optimistic]);

    startTransition(async () => {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId,
            childProfileId: childProfileId || undefined,
            message: content,
          }),
        });

        const payload = await response.json();
        if (response.status === 401) {
          router.push("/login");
          return;
        }
        if (response.status === 402) {
          setUpgradeRequired(true);
          setMessages((current) => current.filter((message) => message.id !== optimistic.id));
          setInput(content);
          return;
        }
        if (!response.ok) {
          throw new Error(payload.error || "Something went wrong");
        }

        if (!conversationId) {
          router.push(`/chat/${payload.conversation.id}`);
          return;
        }

        setMessages((current) => [
          ...current.filter((message) => message.id !== optimistic.id),
          payload.parentMessage,
          payload.coachMessage,
        ]);
        router.refresh();
      } catch {
        setMessages((current) => current.filter((message) => message.id !== optimistic.id));
        setError("Something went wrong - please try again");
        setInput(content);
      }
    });
  }

  async function upgrade() {
    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const payload = await response.json();
    if (payload.url) {
      window.location.href = payload.url;
    } else {
      setError("Upgrade is not configured yet");
    }
  }

  return (
    <div className="chat-shell">
      {!conversationId ? (
        <label className="field compact">
          <span>Child profile</span>
          <select value={childProfileId} onChange={(event) => setChildProfileId(event.target.value)}>
            <option value="">No profile yet</option>
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.name}
                {profile.age_years ? `, ${profile.age_years}` : ""}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <div className="message-list" aria-live="polite">
        {messages.length === 0 ? (
          <div className="empty-panel">
            <h2>Start your first coaching session</h2>
            <p>Describe what just happened with your child.</p>
          </div>
        ) : null}

        {messages.map((message) =>
          message.role === "parent" ? (
            <div key={message.id} className="parent-message">
              {message.content}
            </div>
          ) : (
            <VikaCard key={message.id} message={message} onFollowup={submit} />
          ),
        )}

        {isPending ? (
          <div className="typing" aria-label="VIKA is writing">
            <span />
            <span />
            <span />
          </div>
        ) : null}
      </div>

      {error ? (
        <div className="error-row">
          <span>{error}</span>
          <button type="button" onClick={() => submit(input)}>
            Retry
          </button>
        </div>
      ) : null}

      {upgradeRequired ? (
        <div className="paywall">
          <h2>Free sessions used</h2>
          <p>Upgrade to keep saving new coaching sessions and continue without the five-session limit.</p>
          <button type="button" onClick={upgrade}>
            Upgrade
          </button>
        </div>
      ) : null}

      <form
        className="composer"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Describe what just happened with your child..."
          rows={3}
        />
        <button type="submit" disabled={!canSubmit}>
          Send
        </button>
      </form>

      {latestCoach?.vika_review_status === "flagged" ? (
        <p className="review-note">This response was marked for review because confidence was low.</p>
      ) : null}
    </div>
  );
}
