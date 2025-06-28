import { opennessLevels } from '@/lib/constants';

interface OpennessScoreProps {
  score: number;
  level: string;
  size?: "sm" | "lg";
}

export function OpennessScore({ score, level, size = "sm" }: OpennessScoreProps) {
  const config = opennessLevels[level];
  const filledDots = score;
  const emptyDots = 6 - score;
  const dotSize = size === "lg" ? "w-3 h-3" : "w-2 h-2";
  const textSize = size === "lg" ? "text-sm" : "text-xs";

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {Array.from({ length: filledDots }, (_, i) => (
          <div key={`filled-${i}`} className={`${dotSize} rounded-full bg-${config.color}-500`}></div>
        ))}
        {Array.from({ length: emptyDots }, (_, i) => (
          <div key={`empty-${i}`} className={`${dotSize} rounded-full bg-gray-200`}></div>
        ))}
      </div>
      <span className={`${textSize} font-medium ${config.textColor}`}>
        {score}/6 {level}
      </span>
    </div>
  );
}
