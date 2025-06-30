import { Tool, OpennessAssessment } from '@/types';
import { generateIdFromName } from '@/lib/utils';

// Mappings based on the automation documentation
const CATEGORY_MAPPING: Record<string, string> = {
  'climate': 'Climate',
  'temperature': 'Climate',
  'precipitation': 'Climate',
  'weather': 'Weather',
  'air quality': 'Environmental Monitoring',
  'emissions': 'Climate',
  'carbon': 'Climate',
  'water quality': 'Water Resources',
  'ocean': 'Ocean & Climate',
  'marine': 'Ocean & Climate',
  'satellite imagery': 'Satellite Imagery',
  'earthquakes': 'Disasters',
  'disasters': 'Disasters',
  'wildfire': 'Disasters',
  'floods': 'Disasters',
  'agriculture': 'Food Systems',
  'food security': 'Food Systems',
  'biodiversity': 'Environmental Monitoring',
  'pollution': 'Environmental Monitoring'
};

const ICON_MAPPING: Record<string, string> = {
  'Climate': '🌡️',
  'Weather': '🌡️',
  'Environmental Monitoring': '🌱',
  'Water Resources': '🌊',
  'Ocean & Climate': '🌊',
  'Satellite Imagery': '🛰️',
  'Disasters': '🔥',
  'Food Systems': '🌾',
  'Data Visualization': '📊'
};

const ORGANIZATION_PATTERNS = [
  { pattern: /nasa\.gov|earthdata\.nasa\.gov|earth\.gov/, org: 'NASA' },
  { pattern: /usgs\.gov/, org: 'USGS' },
  { pattern: /noaa\.gov/, org: 'NOAA' },
  { pattern: /epa\.gov/, org: 'EPA' },
  { pattern: /carbonplan\.org/, org: 'CarbonPlan' },
  { pattern: /\.edu/, org: 'Academic Institution' },
  { pattern: /\.org/, org: 'Non-profit Organization' },
];

const LICENSE_MAPPING: Record<string, string> = {
  'nasa': 'Public Domain',
  'usgs': 'Public Domain',
  'noaa': 'Public Domain',
  'epa': 'Public Domain',
  'academic': 'MIT',
  'nonprofit': 'MIT',
  'default': 'Not Specified'
};

const EMBEDDING_RULES = [
  { pattern: /nasa\.gov|usgs\.gov|noaa\.gov|epa\.gov/, canEmbed: false, reason: 'Government domain restrictions' },
  { pattern: /github\.io|netlify\.app|vercel\.app/, canEmbed: true, reason: 'Static hosting platforms typically allow embedding' },
  { pattern: /observable\.com/, canEmbed: true, reason: 'Observable notebooks designed for embedding' },
  { pattern: /codesandbox\.io|codepen\.io/, canEmbed: true, reason: 'Code sharing platforms support embedding' },
  { pattern: /tableau\.com/, canEmbed: true, reason: 'Tableau provides official embed functionality' },
  // Conservative approach: most sites don't allow embedding
];

interface RawToolData {
  name: string;
  url: string;
  description: string;
  dataTypes: string[];
  functionality: string[];
}

export class ToolAutomation {
  
  /**
   * Convert raw tool data into a complete Tool object with automated assessment
   */
  async processRawTool(rawData: RawToolData): Promise<Omit<Tool, 'id'>> {
    const organization = this.detectOrganization(rawData.url);
    const category = this.inferCategory(rawData.dataTypes, rawData.functionality);
    const icon = this.selectIcon(category);
    const license = this.inferLicense(organization, rawData.url);
    const embedSupported = this.checkEmbedSupport(rawData.url);
    const embedNote = this.generateEmbedNote(rawData.url, embedSupported);
    const features = this.generateFeatures(rawData.functionality, rawData.dataTypes);
    const openness = this.assessOpenness(rawData, organization, license, embedSupported);

    return {
      name: rawData.name,
      organization,
      description: rawData.description,
      url: rawData.url,
      embedUrl: rawData.url, // Default to same URL, could be enhanced
      license,
      category,
      features,
      icon,
      status: 'Production',
      embedSupported,
      embedNote,
      openness
    };
  }

  private detectOrganization(url: string): string {
    for (const { pattern, org } of ORGANIZATION_PATTERNS) {
      if (pattern.test(url)) {
        return org;
      }
    }
    return 'Unknown Organization';
  }

  private inferCategory(dataTypes: string[], functionality: string[]): string {
    // Score each category based on data types
    const categoryScores: Record<string, number> = {};
    
    for (const dataType of dataTypes) {
      const category = CATEGORY_MAPPING[dataType.toLowerCase()];
      if (category) {
        categoryScores[category] = (categoryScores[category] || 0) + 1;
      }
    }

    // Default to Data Visualization if no specific category found
    if (Object.keys(categoryScores).length === 0) {
      return 'Data Visualization';
    }

    // Return category with highest score
    return Object.entries(categoryScores)
      .sort(([, a], [, b]) => b - a)[0][0];
  }

  private selectIcon(category: string): string {
    return ICON_MAPPING[category] || '📊';
  }

  private inferLicense(organization: string, url: string): string {
    const orgLower = organization.toLowerCase();
    
    if (orgLower.includes('nasa') || orgLower.includes('usgs') || 
        orgLower.includes('noaa') || orgLower.includes('epa')) {
      return LICENSE_MAPPING['nasa'];
    }
    
    if (orgLower.includes('academic') || url.includes('.edu')) {
      return LICENSE_MAPPING['academic'];
    }
    
    if (orgLower.includes('organization') || url.includes('.org')) {
      return LICENSE_MAPPING['nonprofit'];
    }
    
    return LICENSE_MAPPING['default'];
  }

  private checkEmbedSupport(url: string): boolean {
    for (const { pattern, canEmbed } of EMBEDDING_RULES) {
      if (pattern.test(url)) {
        return canEmbed;
      }
    }
    // Conservative default: assume NOT embeddable unless explicitly known
    return false;
  }

  private generateEmbedNote(url: string, embedSupported: boolean): string {
    for (const { pattern, reason } of EMBEDDING_RULES) {
      if (pattern.test(url)) {
        return reason;
      }
    }
    return embedSupported 
      ? 'Embedding capabilities need verification' 
      : 'Most modern sites block iframe embedding for security';
  }

  private generateFeatures(functionality: string[], dataTypes: string[]): string[] {
    const features: string[] = [];
    
    // Map functionality to features
    const functionalityMap: Record<string, string> = {
      'visualization': 'Interactive visualization',
      'analysis': 'Data analysis',
      'monitoring': 'Real-time monitoring',
      'tracking': 'Progress tracking',
      'forecasting': 'Predictive modeling',
      'mapping': 'Geographic mapping',
      'reporting': 'Report generation',
      'comparison': 'Comparative analysis',
      'exploration': 'Data exploration',
      'discovery': 'Pattern discovery',
      'assessment': 'Impact assessment',
      'modeling': 'Scenario modeling'
    };

    for (const func of functionality) {
      const feature = functionalityMap[func.toLowerCase()];
      if (feature) {
        features.push(feature);
      }
    }

    // Add data-specific features
    if (dataTypes.some(dt => ['climate', 'temperature', 'weather'].includes(dt))) {
      features.push('Climate data integration');
    }
    if (dataTypes.some(dt => ['satellite imagery', 'remote sensing'].includes(dt))) {
      features.push('Satellite imagery support');
    }

    // Ensure we have at least 2-3 features
    if (features.length === 0) {
      features.push('Data visualization', 'Web-based access');
    } else if (features.length === 1) {
      features.push('Web-based interface');
    }

    return features.slice(0, 4); // Limit to 4 features
  }

  private assessOpenness(
    rawData: RawToolData, 
    organization: string, 
    license: string, 
    embedSupported: boolean
  ): OpennessAssessment {
    const dimensions = {
      'Software Licensing': this.assessSoftwareLicensing(license, organization),
      'Data Licensing': this.assessDataLicensing(organization, rawData.dataTypes),
      'Technical Accessibility': this.assessTechnicalAccessibility(embedSupported, rawData.url),
      'Data Standards': this.assessDataStandards(rawData.functionality, rawData.dataTypes),
      'Infrastructure': this.assessInfrastructure(organization, rawData.url),
      'Community Governance': this.assessCommunityGovernance(organization, rawData.url)
    };

    // Calculate overall score
    const score = Object.values(dimensions).reduce((sum, dim) => {
      return sum + (dim.score === 'green' ? 1 : dim.score === 'yellow' ? 0.5 : 0);
    }, 0);

    // Round score to nearest integer for database compatibility
    const roundedScore = Math.round(score);

    // Determine level
    let level: OpennessAssessment['level'];
    if (score >= 5.5) level = 'Fully Open';
    else if (score >= 4) level = 'Mostly Open';
    else if (score >= 2) level = 'Partially Open';
    else level = 'Minimally Open';

    return { score: roundedScore, level, dimensions };
  }

  private assessSoftwareLicensing(license: string, organization: string) {
    if (license === 'Public Domain' || license === 'MIT' || license === 'Apache 2.0') {
      return { score: 'green' as const, note: `${license} license provides full openness` };
    }
    if (organization.toLowerCase().includes('government')) {
      return { score: 'yellow' as const, note: 'Government software with limited source access' };
    }
    return { score: 'red' as const, note: 'Proprietary or license not specified' };
  }

  private assessDataLicensing(organization: string, dataTypes: string[]) {
    if (organization.toLowerCase().includes('nasa') || 
        organization.toLowerCase().includes('usgs') ||
        organization.toLowerCase().includes('noaa')) {
      return { score: 'green' as const, note: 'Government open data policy ensures public access' };
    }
    if (dataTypes.some(dt => ['climate', 'weather', 'satellite'].includes(dt))) {
      return { score: 'green' as const, note: 'Environmental data typically in public domain' };
    }
    return { score: 'yellow' as const, note: 'Data licensing needs verification' };
  }

  private assessTechnicalAccessibility(embedSupported: boolean, url: string) {
    if (embedSupported && !url.includes('.gov')) {
      return { score: 'green' as const, note: 'Full iframe embedding and API access' };
    }
    if (embedSupported) {
      return { score: 'yellow' as const, note: 'Embedding supported with some restrictions' };
    }
    return { score: 'red' as const, note: 'Limited embedding due to security policies' };
  }

  private assessDataStandards(functionality: string[], dataTypes: string[]) {
    if (functionality.includes('analysis') || dataTypes.some(dt => ['satellite', 'climate'].includes(dt))) {
      return { score: 'green' as const, note: 'Uses standard scientific data formats' };
    }
    return { score: 'yellow' as const, note: 'Standard format compliance needs verification' };
  }

  private assessInfrastructure(organization: string, url: string) {
    if (url.includes('.gov')) {
      return { score: 'red' as const, note: 'Government hosting only, no self-hosting options' };
    }
    if (organization.toLowerCase().includes('academic') || url.includes('.org')) {
      return { score: 'yellow' as const, note: 'May be self-hostable but requires setup' };
    }
    return { score: 'yellow' as const, note: 'Self-hosting capabilities need assessment' };
  }

  private assessCommunityGovernance(organization: string, url: string) {
    if (url.includes('.gov')) {
      return { score: 'red' as const, note: 'Government institutional control' };
    }
    if (organization.toLowerCase().includes('academic') || url.includes('.edu')) {
      return { score: 'yellow' as const, note: 'Academic-led with potential for collaboration' };
    }
    if (url.includes('.org')) {
      return { score: 'yellow' as const, note: 'Organization-led but may accept contributions' };
    }
    return { score: 'yellow' as const, note: 'Governance structure needs evaluation' };
  }
}
