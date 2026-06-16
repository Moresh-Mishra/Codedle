import { useEffect, useMemo, useState } from "react";
import { FadeIn } from "./ui/FadeIn.jsx";
import { Button } from "./ui/Button.jsx";

export default function ChallengeRenderer({ challenge, onSubmit, disabled, attemptsRemaining }) {
  const [value, setValue] = useState("");


  const challengeLines = useMemo(() => {
    if (challenge?.type !== "reorder_lines") {
      return [];
    }

    return challenge.lines ?? [];
  }, [challenge]);

  useEffect(() => {
    setValue("");
  }, [challenge]);

  if (!challenge) {
    return null;
  }

  const challengeLabel =
    challenge.type === "output_prediction"
      ? "Output prediction"
      : challenge.type === "fill_blank"
        ? "Fill in the blank"
        : challenge.type === "bug_fix"
          ? "Bug fix"
          : challenge.type === "reorder_lines"
            ? "Reorder lines"
            : "Combo";

  return (
    <FadeIn>
      <section className="overflow-hidden rounded-3xl border border-outline-variant bg-surface-container-low shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between gap-4 border-b border-outline-variant bg-surface-container px-5 py-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-on-surface-variant">Challenge</p>
            <h2 className="text-xl font-semibold text-on-surface">{challenge.title || challengeLabel}</h2>
          </div>
          <span className="rounded-full border border-outline-variant bg-background px-3 py-1 text-xs uppercase tracking-[0.2em] text-on-surface-variant">
            {attemptsRemaining} attempts left
          </span>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em] text-on-surface-variant">
            <span className="rounded-full border border-outline-variant px-3 py-1">{challengeLabel}</span>
            <span className="rounded-full border border-outline-variant px-3 py-1">{challenge.language}</span>
          </div>

          {challenge.prompt ? <p className="text-sm text-on-surface-variant">{challenge.prompt}</p> : null}

          {challenge.code ? (
            <pre className="overflow-x-auto rounded-2xl border border-outline-variant bg-[#0f172a] p-4 text-sm leading-6 text-slate-100">
              <code>{challenge.code}</code>
            </pre>
          ) : null}

          {challenge.type === "reorder_lines" ? (
            <div className="space-y-3">
              <p className="text-sm text-on-surface-variant">
                Type the line order as comma-separated indexes. For example: <span className="font-semibold text-on-surface">1,2,3</span>
              </p>
              <ol className="space-y-2 rounded-2xl border border-outline-variant bg-surface-container-high p-4 text-sm">
                {challengeLines.map((line, index) => (
                  <li key={line} className="flex items-start gap-3">
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-container text-xs font-semibold text-on-primary-container">
                      {index + 1}
                    </span>
                    <span className="font-mono text-on-surface">{line}</span>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          <textarea
            className="min-h-32 w-full rounded-2xl border border-outline-variant bg-background px-4 py-3 font-mono text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            disabled={disabled}
            onChange={(event) => setValue(event.target.value)}
            placeholder={
              challenge.type === "output_prediction"
                ? "Type the exact output"
                : challenge.type === "reorder_lines"
                  ? "Enter line order, e.g. 1,3,2"
                  : "Enter your answer"
            }
            value={value}
          />

          <div className="flex flex-wrap items-center gap-3">
            <Button
              disabled={disabled}
              onClick={() => {
                onSubmit(value);
                setValue("");
              }}
            >
              Submit challenge answer
            </Button>
            <span className="text-xs text-on-surface-variant">Wrong attempts unlock a roast.</span>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}