import type { OpennessAssessment, Tool } from './types';

export type ThemeKey = 'atm' | 'water' | 'land' | 'haz' | 'soc' | 'img';

export interface Theme {
  key: ThemeKey;
  label: string;
  /** Swatch ground behind the theme's symbol pattern. */
  bg: string;
  /** Stroke colour of the theme's symbol pattern. */
  ink: string;
}

export const THEMES: Record<ThemeKey, Theme> = {
  atm: { key: 'atm', label: 'Air & climate', bg: '#D4DBE0', ink: '#5F7487' },
  water: { key: 'water', label: 'Water & ocean', bg: '#D1DEDB', ink: '#4C7C7B' },
  land: { key: 'land', label: 'Land & forest', bg: '#DAE0CE', ink: '#6C7D52' },
  haz: { key: 'haz', label: 'Hazards', bg: '#E6D6CA', ink: '#A2603E' },
  soc: { key: 'soc', label: 'Food, energy & people', bg: '#E5DDC8', ink: '#8F7640' },
  img: { key: 'img', label: 'Imagery', bg: '#DCD9E2', ink: '#6E6684' },
};

export const THEME_ORDER: ThemeKey[] = ['atm', 'water', 'land', 'haz', 'soc', 'img'];

/** Which theme each category in the data belongs to. Add new categories here. */
export const CATEGORY_THEMES: Record<string, ThemeKey> = {
  'Atmospheric Science': 'atm',
  Climate: 'atm',
  Emissions: 'atm',
  Weather: 'atm',
  'Ocean & Climate': 'water',
  'Marine Ecosystems': 'water',
  'Marine Monitoring': 'water',
  'Water Resources': 'water',
  Carbon: 'land',
  Forests: 'land',
  'Environmental Monitoring': 'land',
  Disasters: 'haz',
  'Food Systems': 'soc',
  Energy: 'soc',
  'Environmental Justice': 'soc',
  'Satellite Imagery': 'img',
};

const FALLBACK_THEME: ThemeKey = 'land';

/** The map theme a tool belongs to, derived from its category. */
export function themeOf(tool: Pick<Tool, 'category'>): Theme {
  return THEMES[CATEGORY_THEMES[tool.category] ?? FALLBACK_THEME];
}

/** Openness depth ramp: one hue, six lightness steps, lightest first. */
export const RAMP = ['#C9D1D8', '#A6B4C0', '#8195A6', '#5E7589', '#41586D', '#24394C'];
export const RAMP_EMPTY = '#DAD8D0';

/** Colours for a six-segment score bar, filled up to `score`. */
export function segmentColors(score: number, empty = RAMP_EMPTY): string[] {
  return RAMP.map((color, i) => (i < score ? color : empty));
}

/** Plain-language openness level for a score out of 6. */
export function levelLabel(score: number): string {
  if (score >= 6) return 'Fully open';
  if (score >= 4) return 'Mostly open';
  if (score >= 2) return 'Partially open';
  return 'Minimally open';
}

export type Answer = 'yes' | 'partly' | 'no';

const ANSWERS: Record<'green' | 'yellow' | 'red', Answer> = {
  green: 'yes',
  yellow: 'partly',
  red: 'no',
};

export const ANSWER_LABELS: Record<Answer, string> = { yes: 'Yes', partly: 'Partly', no: 'No' };

type Dimension = keyof OpennessAssessment['dimensions'];

export interface OpennessQuestion {
  question: string;
  short: string;
  explainer: string;
  /** Stored dimension that answers this question, or null when the data has no answer yet. */
  dimension: Dimension | null;
}

export const QUESTIONS: OpennessQuestion[] = [
  {
    question: 'Can I use it without an account?',
    short: 'Acct',
    explainer: 'No sign-up, login wall or API key just to look at the map.',
    dimension: null,
  },
  {
    question: 'Can I get the data?',
    short: 'Data',
    explainer: 'A download, an API or open services — COG, STAC, OGC, GeoJSON — that other tools can read.',
    dimension: 'Data Standards',
  },
  {
    question: 'Can I reuse the data?',
    short: 'Reuse',
    explainer: 'An open data licence, without a commercial agreement.',
    dimension: 'Data Licensing',
  },
  {
    question: 'Can I see or fork the code?',
    short: 'Code',
    explainer: 'Public source under an open licence such as MIT, Apache 2.0 or BSD.',
    dimension: 'Software Licensing',
  },
  {
    question: 'Can I link to or embed a view?',
    short: 'Share',
    explainer: 'Can you send someone a link that opens the exact map you’re looking at, or place it in your own page?',
    dimension: 'Technical Accessibility',
  },
  {
    question: 'Can I run it myself?',
    short: 'Host',
    explainer: 'Could you host your own copy, or does it only run on the publisher’s servers?',
    dimension: 'Infrastructure',
  },
];

export interface QuestionAnswer {
  question: string;
  short: string;
  answer: Answer | null;
  note: string;
}

/** A tool's openness assessment read as the six visitor questions. */
export function answersFor(tool: Pick<Tool, 'openness'>): QuestionAnswer[] {
  return QUESTIONS.map(({ question, short, dimension }) => {
    const stored = dimension ? tool.openness.dimensions[dimension] : null;
    return {
      question,
      short,
      answer: stored ? ANSWERS[stored.score] : null,
      note: stored ? stored.note : 'Not assessed yet.',
    };
  });
}

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export interface MapPin {
  /** Horizontal position inside the card's map tile, as a CSS percentage. */
  x: string;
  y: string;
  /** Decorative coordinate label matching the pin's position. */
  coord: string;
}

/** A stable, decorative pin position and coordinate label for a tool's map tile. */
export function pinFor(name: string): MapPin {
  const h = hash(name);
  const fx = 0.22 + ((h % 1000) / 1000) * 0.6;
  const fy = 0.32 + (((h >>> 10) % 1000) / 1000) * 0.46;
  const lat = 90 - fy * 180;
  const lon = -180 + fx * 360;
  return {
    x: `${Math.round(fx * 100)}%`,
    y: `${Math.round(fy * 100)}%`,
    coord: `${Math.abs(lat).toFixed(1)}°${lat >= 0 ? 'N' : 'S'} ${Math.abs(lon).toFixed(1)}°${lon >= 0 ? 'E' : 'W'}`,
  };
}

/** Number of tools at each score from 1 to 6. */
export function scoreHistogram(tools: Pick<Tool, 'openness'>[]): number[] {
  return [1, 2, 3, 4, 5, 6].map(n => tools.filter(tool => tool.openness.score === n).length);
}
