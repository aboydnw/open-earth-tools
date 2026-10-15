import { Tool } from '@/types';
import { ScoreBar, ThemeFill } from '@/components/survey/Symbology';
import { levelLabel, pinFor, themeOf } from '@/lib/survey';

interface ToolCardProps {
  tool: Tool;
  /** Position in the results, used to stagger the entrance animation. */
  index: number;
  onOpen: (tool: Tool) => void;
  editMode?: boolean;
  onDelete?: (tool: Tool) => void;
  onEdit?: (tool: Tool) => void;
}

/** Directory card: a theme map tile with a pin, the tool's name and its openness bar. */
export function ToolCard({ tool, index, onOpen, editMode = false, onDelete, onEdit }: ToolCardProps) {
  const theme = themeOf(tool);
  const pin = pinFor(tool.name);
  const score = tool.openness.score;

  return (
    <li className="flex flex-col">
      <button
        type="button"
        onClick={() => onOpen(tool)}
        aria-label={`${tool.name}, ${tool.organization}. Openness ${score} of 6. Open details.`}
        className="tool-card relative flex flex-1 flex-col border border-rule bg-sheet p-0 text-left"
        style={{ animationDelay: `${Math.min(index, 16) * 35}ms` }}
      >
        <div className="relative h-[132px] w-full overflow-hidden border-b border-rule" style={{ background: theme.bg }}>
          <ThemeFill theme={theme.key} className="pattern" />
          <div aria-hidden="true" className="absolute h-0 w-0" style={{ left: pin.x, top: pin.y }}>
            <span
              className="absolute -left-[9px] -top-[9px] h-[18px] w-[18px] animate-pin rounded-full border"
              style={{ borderColor: theme.ink }}
            />
            <span className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-ink" />
          </div>
          <span className="absolute left-3 top-2.5 bg-sheet/85 px-1.5 py-0.5 font-mono text-[10.5px] uppercase tracking-[.1em] text-ink">
            {theme.label}
          </span>
          <span className="absolute bottom-2.5 right-3 bg-sheet/85 px-1.5 py-0.5 font-mono text-[10.5px] text-ink">
            {pin.coord}
          </span>
          <span className="crop-marks absolute inset-2" aria-hidden="true" />
        </div>
        <div className="flex w-full flex-1 flex-col gap-1.5 px-[18px] pb-[18px] pt-4">
          <span className="text-lg font-semibold leading-tight tracking-[-0.01em] [text-wrap:balance]">{tool.name}</span>
          <span className="font-mono text-xs text-graphite">{tool.organization}</span>
          <span className="mt-1 line-clamp-2 text-sm leading-normal text-slate">{tool.description}</span>
          <span className="flex-1" />
          <span className="mt-3 flex items-center gap-2.5 border-t border-dashed border-rule pt-3">
            <ScoreBar score={score} />
            <span className="font-mono text-xs text-ink">
              {score}/6 · {levelLabel(score)}
            </span>
          </span>
        </div>
      </button>
      {editMode && (
        <div className="flex border border-t-0 border-rule">
          <button
            type="button"
            onClick={() => onEdit?.(tool)}
            className="min-h-[44px] flex-1 bg-sheet text-sm font-[550] transition-colors hover:bg-ink hover:text-sheet"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(tool)}
            className="min-h-[44px] flex-1 border-l border-rule bg-sheet text-sm font-[550] text-[#9B2C1F] transition-colors hover:bg-[#9B2C1F] hover:text-white"
          >
            Delete
          </button>
        </div>
      )}
    </li>
  );
}
