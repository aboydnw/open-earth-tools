// Configuration-driven approach for automated tool processing

export const CATEGORY_MAPPING: Record<string, string> = {
  // Environmental Justice
  "Environmental Justice": "Environmental Justice",
  "Community Health": "Environmental Justice",
  "Social Equity": "Environmental Justice",
  "Vulnerability Mapping": "Environmental Justice",
  
  // Environmental Monitoring
  "Environmental Monitoring": "Environmental Monitoring",
  "Air Quality": "Environmental Monitoring",
  "Pollution Tracking": "Environmental Monitoring",
  "Sensor Networks": "Environmental Monitoring",
  
  // Climate
  "Climate": "Climate",
  "Climate Change": "Climate",
  "Temperature": "Climate",
  "Climate Modeling": "Climate",
  "Climate Adaptation": "Climate",
  "Climate Projections": "Climate",
  
  // Weather
  "Weather": "Weather",
  "Meteorology": "Weather",
  "Weather Patterns": "Weather",
  "Atmospheric Conditions": "Weather",
  "Wind": "Weather",
  "Precipitation": "Weather",
  
  // Emissions
  "Emissions": "Emissions",
  "Carbon Emissions": "Emissions",
  "Greenhouse Gas": "Emissions",
  "GHG": "Emissions",
  "Carbon Tracking": "Emissions",
  "Methane": "Emissions",
  
  // Carbon
  "Carbon": "Carbon",
  "Carbon Cycle": "Carbon",
  "Carbon Storage": "Carbon",
  "Carbon Removal": "Carbon",
  "Carbon Offsets": "Carbon",
  "Forest Carbon": "Carbon",
  
  // Water Resources
  "Water Resources": "Water Resources",
  "Hydrology": "Water Resources",
  "Water Quality": "Water Resources",
  "Groundwater": "Water Resources",
  "Surface Water": "Water Resources",
  "Water Risk": "Water Resources",
  
  // Ocean & Climate
  "Ocean & Climate": "Ocean & Climate",
  "Ocean": "Ocean & Climate",
  "Marine": "Ocean & Climate",
  "Oceanography": "Ocean & Climate",
  "Sea Surface Temperature": "Ocean & Climate",
  "Ocean Color": "Ocean & Climate",
  
  // Satellite Imagery
  "Satellite Imagery": "Satellite Imagery",
  "Remote Sensing": "Satellite Imagery",
  "Earth Observation": "Satellite Imagery",
  "Imagery": "Satellite Imagery",
  "Satellite Data": "Satellite Imagery",
  
  // Disasters
  "Disasters": "Disasters",
  "Natural Disasters": "Disasters",
  "Emergency Management": "Disasters",
  "Fire": "Disasters",
  "Wildfire": "Disasters",
  "Earthquake": "Disasters",
  "Flood": "Disasters",
  
  // Food Systems
  "Food Systems": "Food Systems",
  "Agriculture": "Food Systems",
  "Food Security": "Food Systems",
  "Supply Chain": "Food Systems",
  "Food Production": "Food Systems",
  
  // Forests
  "Forests": "Forests",
  "Forest Monitoring": "Forests",
  "Deforestation": "Forests",
  "Forest Change": "Forests",
  "Tree Cover": "Forests",
  
  // Energy
  "Energy": "Energy",
  "Renewable Energy": "Energy",
  "Energy Infrastructure": "Energy",
  "Solar": "Energy",
  "Wind Energy": "Energy",
  
  // Marine Ecosystems
  "Marine Ecosystems": "Marine Ecosystems",
  "Marine Life": "Marine Ecosystems",
  "Coral Reefs": "Marine Ecosystems",
  "Fisheries": "Marine Ecosystems",
  "Kelp": "Marine Ecosystems",
  
  // Marine Monitoring
  "Marine Monitoring": "Marine Monitoring",
  "Fishing Activity": "Marine Monitoring",
  "Vessel Tracking": "Marine Monitoring",
  "AIS Data": "Marine Monitoring",
  
  // Atmospheric Science
  "Atmospheric Science": "Atmospheric Science",
  "Atmospheric Research": "Atmospheric Science",
  "Plume Detection": "Atmospheric Science",
  "Trace Gases": "Atmospheric Science",
  "Atmospheric Composition": "Atmospheric Science",
};

export const ICON_MAPPING: Record<string, string> = {
  "Environmental Justice": "⚖️",
  "Environmental Monitoring": "🌡️",
  "Climate": "🌡️",
  "Weather": "🌬️",
  "Emissions": "💨",
  "Carbon": "🌿",
  "Water Resources": "🌊",
  "Ocean & Climate": "🌊",
  "Satellite Imagery": "🛰️",
  "Disasters": "🔥",
  "Food Systems": "🌾",
  "Forests": "🌲",
  "Energy": "⚡",
  "Marine Ecosystems": "🐠",
  "Marine Monitoring": "🐟",
  "Atmospheric Science": "🌫️",
};

export const ORGANIZATION_PATTERNS = [
  { pattern: /nasa\.gov|earthdata\.nasa\.gov|earth\.gov/, org: "NASA" },
  { pattern: /carbonplan\.org/, org: "CarbonPlan" },
  { pattern: /theplotline\.org/, org: "The Plotline" },
  { pattern: /usgs\.gov/, org: "U.S. Geological Survey" },
  { pattern: /noaa\.gov/, org: "NOAA" },
  { pattern: /esa\.int|copernicus\.eu/, org: "ESA/Copernicus" },
  { pattern: /windy\.com/, org: "Windy" },
  { pattern: /iqair\.com/, org: "IQAir" },
  { pattern: /zoom\.earth/, org: "Zoom Earth" },
  { pattern: /nullschool\.net/, org: "Cameron Beccario" },
  { pattern: /globalforestwatch\.org/, org: "Global Forest Watch" },
  { pattern: /globalfishingwatch\.org/, org: "Global Fishing Watch" },
  { pattern: /wri\.org/, org: "World Resources Institute" },
  { pattern: /oceanwealth\.org/, org: "Ocean Wealth" },
  { pattern: /climatetrace\.org/, org: "Climate TRACE" },
  { pattern: /kelpwatch\.org/, org: "KelpWatch" },
  { pattern: /github\.io/, org: "Open Source Project" },
  { pattern: /\.edu/, org: "Academic Institution" },
];

export const LICENSE_MAPPING: Record<string, string> = {
  "mit": "MIT",
  "apache": "Apache 2.0",
  "open source": "Open Source",
  "public domain": "Public Domain",
  "academic": "Academic",
  "freemium": "Freemium",
  "commercial": "Commercial",
  "government": "Public Domain",
  "nasa": "Public Domain",
  "usgs": "Public Domain",
  "noaa": "Public Domain",
  "esa": "Open Data",
};

export const EMBEDDING_RULES = [
  { 
    pattern: /nasa\.gov|earth\.gov|usgs\.gov|noaa\.gov/, 
    canEmbed: false, 
    reason: "Government domain restrictions may prevent embedding" 
  },
  { 
    pattern: /carbonplan\.org|theplotline\.org/, 
    canEmbed: true, 
    reason: "Open source tool supports embedding" 
  },
  { 
    pattern: /github\.io/, 
    canEmbed: true, 
    reason: "Web-based platform supports embedding" 
  },
  { 
    pattern: /windy\.com|iqair\.com/, 
    canEmbed: true, 
    reason: "Commercial platform with embed widgets available" 
  },
  { 
    pattern: /globalforestwatch\.org|globalfishingwatch\.org/, 
    canEmbed: true, 
    reason: "Web-based platform supports embedding" 
  },
  { 
    pattern: /wri\.org/, 
    canEmbed: true, 
    reason: "Web-based platform supports embedding" 
  },
];

// Features mapping based on functionality keywords
export const FEATURE_MAPPING: Record<string, string[]> = {
  "monitoring": ["Real-time monitoring", "Data tracking", "Status updates"],
  "exploration": ["Interactive exploration", "Data discovery", "Visual browsing"],
  "analysis": ["Data analysis", "Trend analysis", "Statistical analysis"],
  "visualization": ["Data visualization", "Interactive maps", "Charts and graphs"],
  "alerts": ["Real-time alerts", "Notification system", "Warning system"],
  "download": ["Data download", "Export capabilities", "Data access"],
  "time series": ["Time series analysis", "Historical data", "Temporal visualization"],
  "filtering": ["Data filtering", "Search capabilities", "Custom queries"],
  "comparison": ["Comparative analysis", "Benchmarking", "Side-by-side comparison"],
  "education": ["Educational content", "Learning resources", "Tutorials"],
  "research": ["Research tools", "Scientific analysis", "Academic resources"],
  "storytelling": ["Data storytelling", "Narrative visualization", "Explanatory content"],
};
