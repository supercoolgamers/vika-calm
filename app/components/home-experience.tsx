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
    title: "I need help right now",
    description: "Something difficult is happening and I need a calm next step.",
    button: "Guide me through this moment",
  },
  {
    mode: "reflection",
    title: "Help me understand a pattern",
    description: "This keeps happening and I want to understand what may be underneath.",
    button: "Explore what may be underneath",
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

      <section className="grounding-note">
        <h2>You’re not here because you’re failing. You’re here because you’re trying to understand.</h2>
        <p>
          Your child’s behavior is information. Together, we’ll look at what may be underneath
          before deciding what to do next.
        </p>
      </section>

      <section id="coaching-entry" className="primary-pane coaching-entry" aria-label="Start coaching session">
        <div className="pane-heading">
          <div>
            <p className="eyebrow">{mode === "immediate" ? "Immediate support" : "Pattern reflection"}</p>
            <h2>Tell me what just happened.</h2>
            <p className="pane-copy">
              Don’t worry about using the right words. Just describe what you noticed.
            </p>
          </div>
        </div>
        <ChatPanel initialMessages={[]} profiles={profiles} mode={mode} />
      </section>
    </div>
  );
}
