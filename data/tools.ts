import { Tool } from '../lib/types';

export const tools: Tool[] = [
  {
    id: "kepler-gl-demo",
    name: "Kepler.gl Geospatial Analysis",
    organization: "Uber Open Source",
    description: "High-performance web-based application for visual exploration of large-scale geolocation data sets. Analyze and visualize geospatial data.",
    url: "https://kepler.gl/demo",
    embedUrl: "https://kepler.gl/demo",
    license: "MIT",
    category: "Data Visualization",
    features: ["Large dataset support", "3D visualization", "Real-time rendering"],
    icon: "🗺️",
    status: "Production",
    embedSupported: true,
    embedNote: "Kepler.gl supports embedding with full functionality",
    openness: {
      score: 6,
      level: "Fully Open",
      dimensions: {
        "Software Licensing": { score: "green", note: "MIT License, full source available" },
        "Data Licensing": { score: "green", note: "Supports any open data formats" },
        "Technical Accessibility": { score: "green", note: "Full embedding, iframe support" },
        "Data Standards": { score: "green", note: "Multiple formats (GeoJSON, CSV, etc.)" },
        "Infrastructure": { score: "green", note: "Self-hostable, Docker support" },
        "Community Governance": { score: "green", note: "Open source community-driven" }
      }
    }
  },
  {
    id: "global-food-twin",
    name: "Global Food Twin",
    organization: "The Plotline / CU Boulder",
    description: "Global digital twin of the world's food system showing international food production, consumption, and supply chain flows. Expanded version covering food security and climate impacts worldwide.",
    url: "https://foodtwin.theplotline.org/",
    embedUrl: "https://foodtwin.theplotline.org/",
    license: "Open Source",
    category: "Food Systems",
    features: ["Global food flows", "International trade tracking", "Climate resilience modeling"],
    icon: "🌍",
    status: "Production",
    embedSupported: true,
    embedNote: "Global Food Twin supports embedding with interactive global mapping",
    openness: {
      score: 5,
      level: "Mostly Open",
      dimensions: {
        "Software Licensing": { score: "green", note: "Open source codebase, part of Plotline project" },
        "Data Licensing": { score: "green", note: "Uses global agricultural and trade data from public sources" },
        "Technical Accessibility": { score: "green", note: "Web-based platform with embedding support" },
        "Data Standards": { score: "green", note: "International food and agriculture data standards" },
        "Infrastructure": { score: "yellow", note: "Scalable but requires significant data infrastructure" },
        "Community Governance": { score: "yellow", note: "Research collaboration with limited community governance" }
      }
    }
  },
  {
    id: "food-twin",
    name: "Food Twin",
    organization: "The Plotline / Development Seed",
    description: "Digital twin of the US food system showing how food moves from production to consumption. Visualizes supply chain resilience and climate impacts on food security.",
    url: "https://food.theplotline.org/",
    embedUrl: "https://food.theplotline.org/",
    license: "Open Source",
    category: "Food Systems",
    features: ["Food supply chains", "Climate impact modeling", "Interactive food flows"],
    icon: "🌾",
    status: "Production",
    embedSupported: true,
    embedNote: "Food Twin supports embedding with modern web architecture",
    openness: {
      score: 5,
      level: "Mostly Open",
      dimensions: {
        "Software Licensing": { score: "green", note: "Open source codebase available on GitHub" },
        "Data Licensing": { score: "green", note: "Uses satellite data and public survey statistics" },
        "Technical Accessibility": { score: "green", note: "Modern web app with embedding capabilities" },
        "Data Standards": { score: "green", note: "Uses standard geospatial and agricultural data formats" },
        "Infrastructure": { score: "yellow", note: "Self-hostable but requires data processing setup" },
        "Community Governance": { score: "yellow", note: "Collaborative project with limited community input" }
      }
    }
  },
  {
    id: "observable-earth",
    name: "Observable Earth",
    organization: "Observable",
    description: "Interactive Earth science data visualizations and explorations. Demonstrates modern web-based data storytelling techniques.",
    url: "https://observablehq.com/@observablehq/plot-earthquakes",
    embedUrl: "https://observablehq.com/embed/@observablehq/plot-earthquakes?cells=chart",
    license: "MIT",
    category: "Data Visualization",
    features: ["Interactive charts", "Real-time data", "Embeddable widgets"],
    icon: "📊",
    status: "Production",
    embedSupported: true,
    openness: {
      score: 5,
      level: "Mostly Open",
      dimensions: {
        "Software Licensing": { score: "green", note: "MIT License, source available" },
        "Data Licensing": { score: "green", note: "Public data (USGS earthquakes)" },
        "Technical Accessibility": { score: "green", note: "Full embedding support, CORS enabled" },
        "Data Standards": { score: "yellow", note: "GeoJSON standard but limited formats" },
        "Infrastructure": { score: "green", note: "Self-hostable platform" },
        "Community Governance": { score: "yellow", note: "Observable-led but open contributions" }
      }
    }
  },
  {
    id: "fire-event-explorer",
    name: "Fire Event Explorer",
    organization: "Development Seed",
    description: "Explore wildfire perimeters, track fire progression over time, and analyze burn severity. Perfect for emergency management and fire risk communication.",
    url: "https://www.earthdata.nasa.gov/dashboard/tools/fire-event-explorer",
    embedUrl: "https://www.earthdata.nasa.gov/dashboard/tools/fire-event-explorer",
    license: "MIT",
    category: "Disasters",
    features: ["Real-time fire tracking", "Burn severity analysis", "Interactive timelines"],
    icon: "🔥",
    status: "Production",
    embedSupported: true,
    embedNote: "Requires domain whitelisting for iframe embedding",
    openness: {
      score: 4,
      level: "Mostly Open",
      dimensions: {
        "Software Licensing": { score: "green", note: "MIT License, open source" },
        "Data Licensing": { score: "green", note: "NASA public domain data" },
        "Technical Accessibility": { score: "yellow", note: "Embeddable but requires whitelisting" },
        "Data Standards": { score: "green", note: "STAC/COG compliant" },
        "Infrastructure": { score: "yellow", note: "Can self-host but complex setup" },
        "Community Governance": { score: "yellow", note: "Development Seed led, limited community" }
      }
    }
  },
  {
    id: "nasa-worldview",
    name: "NASA Worldview",
    organization: "NASA GIBS",
    description: "Browse 1,200+ global satellite imagery layers with near real-time data from NASA's Global Imagery Browse Services.",
    url: "https://worldview.earthdata.nasa.gov/",
    embedUrl: "https://worldview.earthdata.nasa.gov/?v=-0.1,35.7,51.9,71.5&t=2024-01-15-T00%3A00%3A00Z&l=Reference_Labels_15m,Reference_Features_15m,Coastlines_15m,VIIRS_SNPP_DayNightBand_ENCC,MODIS_Aqua_CorrectedReflectance_TrueColor&lg=true&s=-12,-20,-12,-20",
    license: "Apache 2.0",
    category: "Satellite Imagery",
    features: ["1,200+ data layers", "Near real-time data", "Animation tools"],
    icon: "🌍",
    status: "Production",
    embedSupported: false,
    embedNote: "Requires whitelisted domains in CSP frame-ancestors",
    openness: {
      score: 4,
      level: "Mostly Open",
      dimensions: {
        "Software Licensing": { score: "green", note: "Apache 2.0, full source available" },
        "Data Licensing": { score: "green", note: "NASA public domain" },
        "Technical Accessibility": { score: "red", note: "CSP restrictions prevent embedding" },
        "Data Standards": { score: "green", note: "OGC standards, GIBS services" },
        "Infrastructure": { score: "yellow", note: "Self-hostable but very complex" },
        "Community Governance": { score: "yellow", note: "NASA-led, limited external input" }
      }
    }
  },
  {
    id: "usgs-water-data",
    name: "USGS Water Data Dashboard",
    organization: "U.S. Geological Survey",
    description: "Real-time water monitoring including stream flow and groundwater levels across the United States from USGS monitoring stations.",
    url: "https://dashboard.waterdata.usgs.gov/",
    embedUrl: "https://dashboard.waterdata.usgs.gov/app/nwd/?region=lower48&aoi=default",
    license: "Public Domain",
    category: "Water Resources",
    features: ["Stream flow data", "Groundwater levels", "Station networks"],
    icon: "🌊",
    status: "Production",
    embedSupported: true,
    embedNote: "USGS Water Data supports embedding with some restrictions",
    openness: {
      score: 3,
      level: "Partially Open",
      dimensions: {
        "Software Licensing": { score: "yellow", note: "Government platform, limited source access" },
        "Data Licensing": { score: "green", note: "Public domain data" },
        "Technical Accessibility": { score: "green", note: "Embedding works (tested successfully)" },
        "Data Standards": { score: "green", note: "Standard water data formats" },
        "Infrastructure": { score: "red", note: "Government hosting only" },
        "Community Governance": { score: "red", note: "USGS institutional control" }
      }
    }
  },
  {
    id: "nasa-ocean-color",
    name: "NASA Ocean Color Web",
    organization: "NASA Ocean Biology",
    description: "Marine ecosystem and climate indicators showing ocean color and temperature data from satellite observations.",
    url: "https://oceancolor.gsfc.nasa.gov/",
    embedUrl: "https://oceancolor.gsfc.nasa.gov/cgi/browse.pl",
    license: "Open Source",
    category: "Ocean & Climate",
    features: ["Ocean color data", "Temperature maps", "Climate indicators"],
    icon: "🌊",
    status: "Production",
    embedSupported: true,
    embedNote: "NASA Ocean Color may require specific embedding parameters",
    openness: {
      score: 3,
      level: "Partially Open",
      dimensions: {
        "Software Licensing": { score: "yellow", note: "NASA platform, partial open source" },
        "Data Licensing": { score: "green", note: "NASA public domain" },
        "Technical Accessibility": { score: "green", note: "Embedding supported" },
        "Data Standards": { score: "green", note: "Scientific data standards" },
        "Infrastructure": { score: "red", note: "NASA hosting only" },
        "Community Governance": { score: "red", note: "NASA institutional control" }
      }
    }
  },
  {
    id: "windy-weather",
    name: "Windy Weather Visualization",
    organization: "Windy",
    description: "Real-time weather visualization showing wind patterns, temperature, precipitation and other meteorological data with beautiful animations.",
    url: "https://www.windy.com/",
    embedUrl: "https://embed.windy.com/embed2.html?lat=40.724&lon=-73.996&detailLat=40.724&detailLon=-73.996&width=650&height=450&zoom=8&level=surface&overlay=wind&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1",
    license: "Freemium",
    category: "Weather",
    features: ["Real-time weather", "Wind animations", "Multiple data layers"],
    icon: "🌬️",
    status: "Production",
    embedSupported: true,
    embedNote: "Windy provides official embed widgets",
    openness: {
      score: 2,
      level: "Partially Open",
      dimensions: {
        "Software Licensing": { score: "red", note: "Proprietary platform" },
        "Data Licensing": { score: "yellow", note: "Some open data, some proprietary" },
        "Technical Accessibility": { score: "green", note: "Official embed widgets" },
        "Data Standards": { score: "yellow", note: "Standard formats but limited API" },
        "Infrastructure": { score: "red", note: "SaaS-only, no self-hosting" },
        "Community Governance": { score: "red", note: "Commercial company control" }
      }
    }
  },
  {
    id: "usgs-earthquakes",
    name: "USGS Real-time Earthquakes",
    organization: "U.S. Geological Survey",
    description: "Global earthquake monitoring with magnitude and location data updated in real-time from seismic monitoring stations worldwide.",
    url: "https://earthquake.usgs.gov/earthquakes/map/",
    embedUrl: "https://earthquake.usgs.gov/earthquakes/map/?extent=-85.60929,-358.59375&extent=85.60929,358.59375&range=search&timeZone=utc&search=%7B%22name%22:%22Search%20Results%22,%22params%22:%7B%22starttime%22:%222024-01-01%2000:00:00%22,%22endtime%22:%222024-12-31%2023:59:59%22,%22maxlatitude%22:90,%22minlatitude%22:-90,%22maxlongitude%22:180,%22minlongitude%22:-180,%22minmagnitude%22:2.5,%22orderby%22:%22time%22%7D%7D",
    license: "Public Domain",
    category: "Disasters",
    features: ["Real-time updates", "Global coverage", "Magnitude filtering"],
    icon: "🌍",
    status: "Production",
    embedSupported: false,
    embedNote: "USGS allows embedding but may have iframe restrictions",
    openness: {
      score: 2,
      level: "Partially Open",
      dimensions: {
        "Software Licensing": { score: "yellow", note: "Government software, source not fully available" },
        "Data Licensing": { score: "green", note: "Public domain data" },
        "Technical Accessibility": { score: "red", note: "X-Frame-Options restrictions" },
        "Data Standards": { score: "green", note: "GeoJSON, standard formats" },
        "Infrastructure": { score: "red", note: "Government-only hosting" },
        "Community Governance": { score: "red", note: "USGS institutional control" }
      }
    }
  },
  {
    id: "noaa-climate-explorer",
    name: "NOAA Climate Explorer",
    organization: "NOAA",
    description: "Local climate projections and trend analysis showing historical trends and future projections for temperature and precipitation.",
    url: "https://toolkit.climate.gov/climate-explorer2/",
    embedUrl: "https://toolkit.climate.gov/climate-explorer2/",
    license: "Public Domain",
    category: "Climate",
    features: ["Climate projections", "Historical trends", "Local data"],
    icon: "🌡️",
    status: "Production",
    embedSupported: false,
    embedNote: "NOAA tools may have government domain restrictions",
    openness: {
      score: 2,
      level: "Partially Open",
      dimensions: {
        "Software Licensing": { score: "yellow", note: "Government platform, limited source" },
        "Data Licensing": { score: "green", note: "Public domain climate data" },
        "Technical Accessibility": { score: "red", note: "Government domain restrictions" },
        "Data Standards": { score: "green", note: "Climate data standards" },
        "Infrastructure": { score: "red", note: "NOAA hosting only" },
        "Community Governance": { score: "red", note: "NOAA institutional control" }
      }
    }
  }
];
