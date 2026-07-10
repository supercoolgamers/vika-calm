import type { Message } from "@/lib/types";

export function VikaCard({
  message,
  onFollowup,
}: {
  message: Message;
  onFollowup?: (text: string) => void;
}) {
  const sections = [
    ["Validate", message.vika_validate],
    ["Investigate", message.vika_investigate],
    ["Know", message.vika_know],
    ["Act", message.vika_act],
  ];

  return (
    <article className="vika-card">
      <div className="vika-grid">
        {sections.map(([label, body]) => (
          <section key={label} className="vika-section">
            <h3>{label}</h3>
            <p>{body}</p>
          </section>
        ))}
      </div>
      {message.suggested_followups?.length ? (
        <div className="followup-panel">
          <p>Next steps</p>
          <div className="followups">
            {message.suggested_followups.map((followup) => (
              <button
                key={followup}
                type="button"
                onClick={() => onFollowup?.(followup)}
                disabled={!onFollowup}
              >
                {followup}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}
