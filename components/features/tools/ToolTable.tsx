import { Tool } from '@/types';
import { AnswerMark, ScoreBar, ThemeSwatch } from '@/components/survey/Symbology';
import { ANSWER_LABELS, answersFor, QUESTIONS, themeOf } from '@/lib/survey';

interface ToolTableProps {
  tools: Tool[];
  onOpen: (tool: Tool) => void;
}

const COLUMNS = 'minmax(260px,2.6fr) 190px 200px repeat(6,48px)';

/** Dense table view of the directory with one column per openness question. */
export function ToolTable({ tools, onOpen }: ToolTableProps) {
  return (
    <>
      <div className="overflow-x-auto border border-ink bg-band">
        <div className="min-w-[1040px]">
          <div
            className="grid items-end gap-x-3 border-b border-ink px-5 pb-2.5 pt-3.5 font-mono text-[10.5px] uppercase tracking-[.08em] text-graphite"
            style={{ gridTemplateColumns: COLUMNS }}
          >
            <span>Tool</span>
            <span>Theme</span>
            <span>Openness</span>
            {QUESTIONS.map(q => <span key={q.short} title={q.question}>{q.short}</span>)}
          </div>
          {tools.map((tool, i) => {
            const theme = themeOf(tool);
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => onOpen(tool)}
                className="grid w-full animate-rise-fast items-center gap-x-3 border-b border-[#D6D4CB] bg-transparent px-5 py-3 text-left transition-colors hover:bg-sheet"
                style={{ gridTemplateColumns: COLUMNS, animationDelay: `${Math.min(i, 16) * 35}ms` }}
              >
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-[15px] font-semibold">{tool.name}</span>
                  <span className="truncate font-mono text-[11.5px] text-graphite">{tool.organization}</span>
                </span>
                <span className="flex items-center gap-2 text-[13px]">
                  <ThemeSwatch theme={theme} size={14} />
                  {theme.label}
                </span>
                <span className="flex items-center gap-2">
                  <ScoreBar score={tool.openness.score} segmentWidth={12} />
                  <span className="font-mono text-xs">{tool.openness.score}/6</span>
                </span>
                {answersFor(tool).map(a => (
                  <span
                    key={a.short}
                    title={`${a.question} ${a.answer ? ANSWER_LABELS[a.answer] : 'Not assessed yet'}`}
                    className="flex justify-center"
                  >
                    <AnswerMark answer={a.answer} />
                  </span>
                ))}
              </button>
            );
          })}
        </div>
      </div>
      <AnswerLegend />
    </>
  );
}

/** Key for the yes / partly / no answer marks. */
export function AnswerLegend() {
  return (
    <p className="mt-3 flex flex-wrap gap-5 font-mono text-xs text-slate">
      <span className="flex items-center gap-1.5"><AnswerMark answer="yes" size={12} />Yes</span>
      <span className="flex items-center gap-1.5"><AnswerMark answer="partly" size={12} />Partly</span>
      <span className="flex items-center gap-1.5"><AnswerMark answer="no" size={12} />No</span>
      <span className="flex items-center gap-1.5 text-muted">– Not assessed yet</span>
    </p>
  );
}
