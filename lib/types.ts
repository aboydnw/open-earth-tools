import type { ToolFile } from './tool-schema';

export type OpennessAssessment = ToolFile['openness'];
export type OpennessScore = OpennessAssessment['dimensions'][keyof OpennessAssessment['dimensions']];

/** A tool as stored in `data/tools/<id>.json`, plus the id taken from its filename. */
export type Tool = ToolFile & { id: string };

export interface OpennessLevelConfig {
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}
