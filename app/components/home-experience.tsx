"use client";

import { useState } from "react";
import { ChatPanel, type CoachingMode } from "@/app/components/chat-panel";
import type { ChildProfile } from "@/lib/types";

const pathways: Array<{
  mode: CoachingMode;
  title: string;
  description: string;
  button: string;
}> = [
  {
    mode: "immediate",
    title: "Guide me",
    description: "Something difficult is happening right now.",
    button: "Guide me",
  },
  {
    mode: "reflection",
    title: "Help me understand",
    description: "This keeps happening and I’d like to understand it.",
    button: "Help me understand",
  },
];

export function HomeExperience({ profiles }: { profiles: ChildProfile[] }) {
  const [mode, setMode] = useState<CoachingMode>("immediate");

  function chooseMode(nextMode: CoachingMode) {
    setMode(nextMode);
    document.getElementById("coaching-entry")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div className="home-experience">
      <section className="pathway-grid" aria-label="Choose how Vika can help">
        {pathways.map((pathway) => (
          <article
            className={mode === pathway.mode ? "pathway-card active" : "pathway-card"}
            key={pathway.mode}
          >
            <div>
              <h2>{pathway.title}</h2>
              <p>{pathway.description}</p>
            </div>
            <button
              type="button"
              aria-pressed={mode === pathway.mode}
              onClick={() => chooseMode(pathway.mode)}
            >
              {pathway.button}
            </button>
          </article>
        ))}
      </section>

      <section id="coaching-entry" className="primary-pane coaching-entry" aria-label="Start coaching session">
        <div className="pane-heading">
          <div>
            <p className="eyebrow">{mode === "immediate" ? "Right now" : "Ongoing pattern"}</p>
            <h2>Describe what you saw.</h2>
            <p className="pane-copy">
              Start with what you noticed. We&apos;ll explore what happened before choosing a response.
            </p>
          </div>
        </div>
        <ChatPanel initialMessages={[]} profiles={profiles} mode={mode} />
      </section>

      <section className="grounding-note">
        <h2>Understanding comes before responding.</h2>
      </section>
    </div>
  );
}
