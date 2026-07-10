import type { Message } from "@/lib/types";

export function VikaCard({
  message,
  onFollowup,
}: {
  message: Message;
  onFollowup?: (text: string) => void;
}) {
  const sections = [
    ["V", "Validate", message.vika_validate],
    ["I", "Investigate together", message.vika_investigate],
    ["K", "Know possible functions", message.vika_know],
    ["A", "Act", message.vika_act],
  ];

  return (
    <article className="vika-card">
      <div className="vika-grid">
        {sections.map(([letter, label, body]) => (
          <section key={letter} className="vika-section">
            <div className="vika-marker" aria-hidden="true">
              {letter}
            </div>
            <div>
              <h3>{label}</h3>
              <p>{body}</p>
            </div>
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
