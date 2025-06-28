import { RawToolData } from '../schemas/tool.schema';

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

interface AssessmentRule {
  condition: (tool: RawToolData) => boolean;
  score: "green" | "yellow" | "red";
  note: string;
}

interface AssessmentRules {
  softwareLicensing: AssessmentRule[];
  dataLicensing: AssessmentRule[];
  technicalAccessibility: AssessmentRule[];
  dataStandards: AssessmentRule[];
  infrastructure: AssessmentRule[];
  communityGovernance: AssessmentRule[];
}

export class OpennessAssessor {
  private rules: AssessmentRules = {
    softwareLicensing: [
      {
        condition: (tool) => this.hasKeywords(tool, ["open source", "mit", "apache", "github"]),
        score: "green",
        note: "Open source codebase available"
      },
      {
        condition: (tool) => this.isGovernmentDomain(tool.url),
        score: "yellow",
        note: "Government platform, some open source components"
      },
      {
        condition: (tool) => this.isAcademicDomain(tool.url),
        score: "yellow",
        note: "Academic project, licensing unclear"
      },
      {
        condition: (tool) => this.hasKeywords(tool, ["commercial", "freemium", "proprietary"]),
        score: "red",
        note: "Commercial platform"
      },
    ],

    dataLicensing: [
      {
        condition: (tool) => this.isGovernmentDomain(tool.url) || this.hasKeywords(tool, ["nasa", "usgs", "noaa", "public domain"]),
        score: "green",
        note: "Public domain data"
      },
      {
        condition: (tool) => this.hasKeywords(tool, ["open data", "creative commons", "open source"]),
        score: "green",
        note: "Open data licensing"
      },
      {
        condition: (tool) => this.hasKeywords(tool, ["mixed", "some proprietary", "limited access"]),
        score: "yellow",
        note: "Mix of public and proprietary data"
      },
      {
        condition: (tool) => this.hasKeywords(tool, ["proprietary", "commercial", "restricted"]),
        score: "red",
        note: "Proprietary or restricted data"
      },
    ],

    technicalAccessibility: [
      {
        condition: (tool) => this.hasKeywords(tool, ["embed", "api", "web-based", "browser"]),
        score: "green",
        note: "Web-based with embedding support"
      },
      {
        condition: (tool) => this.hasKeywords(tool, ["whitelisting", "domain restrictions", "some restrictions"]),
        score: "yellow",
        note: "Embeddable but with restrictions"
      },
      {
        condition: (tool) => this.isGovernmentDomain(tool.url),
        score: "red",
        note: "Government domain restrictions may prevent embedding"
      },
    ],

    dataStandards: [
      {
        condition: (tool) => this.hasKeywords(tool, ["standard", "ogc", "stac", "cog", "geojson", "netcdf"]),
        score: "green",
        note: "Uses standard data formats"
      },
      {
        condition: (tool) => this.hasKeywords(tool, ["scientific", "research", "peer-reviewed"]),
        score: "green",
        note: "Scientific data standards"
      },
      {
        condition: (tool) => this.hasKeywords(tool, ["limited api", "custom format"]),
        score: "yellow",
        note: "Limited standardization"
      },
    ],

    infrastructure: [
      {
        condition: (tool) => this.hasKeywords(tool, ["self-host", "docker", "open source", "github"]),
        score: "green",
        note: "Self-hostable infrastructure"
      },
      {
        condition: (tool) => this.hasKeywords(tool, ["complex setup", "requires infrastructure"]),
        score: "yellow",
        note: "Self-hostable but complex setup"
      },
      {
        condition: (tool) => this.isGovernmentDomain(tool.url),
        score: "red",
        note: "Government hosting only"
      },
      {
        condition: (tool) => this.hasKeywords(tool, ["saas", "commercial", "proprietary"]),
        score: "red",
        note: "Commercial hosting only"
      },
    ],

    communityGovernance: [
      {
        condition: (tool) => this.hasKeywords(tool, ["collaborative", "multi-stakeholder", "community", "open science"]),
        score: "green",
        note: "Multi-stakeholder governance"
      },
      {
        condition: (tool) => this.hasKeywords(tool, ["research collaboration", "scientific community"]),
        score: "yellow",
        note: "Research collaboration with limited community governance"
      },
      {
        condition: (tool) => this.isGovernmentDomain(tool.url) || this.hasKeywords(tool, ["institutional", "government"]),
        score: "red",
        note: "Institutional control"
      },
      {
        condition: (tool) => this.hasKeywords(tool, ["commercial", "company"]),
        score: "red",
        note: "Commercial company control"
      },
    ],
  };

  assess(tool: RawToolData): OpennessAssessment {
    const dimensions = {
      "Software Licensing": this.assessDimension(tool, this.rules.softwareLicensing),
      "Data Licensing": this.assessDimension(tool, this.rules.dataLicensing),
      "Technical Accessibility": this.assessDimension(tool, this.rules.technicalAccessibility),
      "Data Standards": this.assessDimension(tool, this.rules.dataStandards),
      "Infrastructure": this.assessDimension(tool, this.rules.infrastructure),
      "Community Governance": this.assessDimension(tool, this.rules.communityGovernance),
    };

    const score = this.calculateOverallScore(dimensions);
    const level = this.determineLevel(score);

    return {
      score,
      level,
      dimensions,
    };
  }

  private assessDimension(tool: RawToolData, rules: AssessmentRule[]): OpennessScore {
    // Find the first matching rule
    for (const rule of rules) {
      if (rule.condition(tool)) {
        return {
          score: rule.score,
          note: rule.note,
        };
      }
    }

    // Default to yellow if no rules match
    return {
      score: "yellow",
      note: "Assessment unclear, manual review needed",
    };
  }

  private calculateOverallScore(dimensions: Record<string, OpennessScore>): number {
    const scores = Object.values(dimensions);
    let total = 0;

    scores.forEach(score => {
      switch (score.score) {
        case "green":
          total += 1;
          break;
        case "yellow":
          total += 0.5;
          break;
        case "red":
          total += 0;
          break;
      }
    });

    return Math.round(total);
  }

  private determineLevel(score: number): "Fully Open" | "Mostly Open" | "Partially Open" | "Minimally Open" {
    if (score >= 6) return "Fully Open";
    if (score >= 4) return "Mostly Open";
    if (score >= 2) return "Partially Open";
    return "Minimally Open";
  }

  private hasKeywords(tool: RawToolData, keywords: string[]): boolean {
    const searchText = [
      tool.name,
      tool.notes,
      tool.url,
      ...(tool.functionality || []),
      ...(tool.standout_features || []),
    ].join(" ").toLowerCase();

    return keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
  }

  private isGovernmentDomain(url: string): boolean {
    const govDomains = ['.gov', 'nasa.', 'usgs.', 'noaa.', 'earth.gov'];
    return govDomains.some(domain => url.includes(domain));
  }

  private isAcademicDomain(url: string): boolean {
    return url.includes('.edu');
  }
}
