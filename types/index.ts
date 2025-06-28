export interface OpennessScore {
  score: "green" | "yellow" | "red";
  note: string;
}

export interface OpennessAssessment {
  score: number;
  level: "Fully Open" | "Mostly Open" | "Partially Open" | "Minimally Open";
  dimensions: {
    "Software Licensing": OpennessScore;
    "Data Licensing": OpennessScore;
    "Technical Accessibility": OpennessScore;
    "Data Standards": OpennessScore;
    "Infrastructure": OpennessScore;
    "Community Governance": OpennessScore;
  };
}

export interface Tool {
  id: string;
  name: string;
  organization: string;
  description: string;
  url: string;
  embedUrl: string;
  license: string;
  category: string;
  features: string[];
  icon: string;
  status: string;
  embedSupported: boolean;
  embedNote?: string;
  openness: OpennessAssessment;
}

export interface OpennessLevelConfig {
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}
