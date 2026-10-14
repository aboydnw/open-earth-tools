import { ScoreBar } from '@/components/survey/Symbology';
import { QUESTIONS } from '@/lib/survey';

const LEVELS: [number, string, string][] = [
  [6, '6', 'Fully open'],
  [5, '4–5', 'Mostly open'],
  [3, '2–3', 'Partially open'],
  [1, '1', 'Minimally open'],
];

/** Dark band explaining the six openness questions and how they add up to a score. */
export function MethodSection() {
  return (
    <section id="method" aria-labelledby="method-heading" className="bg-ink text-paper">
      <div className="mx-auto flex max-w-[1320px] flex-wrap gap-14 px-4 py-[88px] sm:px-8">
        <div className="flex flex-[1_1_340px] flex-col gap-5">
          <p className="font-mono text-xs uppercase tracking-[.12em] text-fog">Method</p>
          <h2 id="method-heading" className="font-wide text-[40px] font-[520] leading-[1.05] tracking-[-0.02em]">
            How openness is scored
          </h2>
          <p className="max-w-[420px] text-[17px] leading-relaxed text-fog">
            Every tool is checked against six questions a visitor would actually ask. Each answer is yes, partly or no.
            The score adds a point for each yes and half a point for each partly.
          </p>
          <p className="max-w-[420px] text-sm leading-relaxed text-fog">
            We’re still adding answers for the account question. Until then, scores count community governance in its
            place.
          </p>
          <div className="mt-2 flex flex-col gap-2 font-mono text-[13px]">
            {LEVELS.map(([score, range, name]) => (
              <div key={name} className="flex items-center gap-3">
                <ScoreBar score={score} empty="#3A4246" />
                <span className="text-paper">{range}</span>
                <span className="text-fog">{name}</span>
              </div>
            ))}
          </div>
        </div>
        <ol className="grid flex-[2_1_560px] grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] border-t border-graphite">
          {QUESTIONS.map((q, i) => (
            <li key={q.question} className="flex flex-col gap-2 border-b border-graphite py-6 pr-6">
              <span className="font-mono text-xs text-rust-light">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-[19px] font-semibold">{q.question}</span>
              <span className="text-[15px] leading-[1.55] text-fog">{q.explainer}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
