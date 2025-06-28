import { Tool } from '../lib/types';

export const tools: Tool[] = [
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
,
  {
    id: "vacs",
    name: "VACS",
    organization: "The Plotline",
    description: "VACS overlays climate hazard and community vulnerability data in an interactive map. It balances clarity and nuance, uses color effectively, and supports insight-building for non-experts.",
    url: "https://vacs.theplotline.org/",
    embedUrl: "https://vacs.theplotline.org/",
    license: "Open Source",
    category: "Environmental Justice",
    features: ["Exploration", "Storytelling"],
    icon: "⚖️",
    status: "Production",
    embedSupported: true,
    embedNote: "Research platform supports embedding",
    openness: {
      score: 4,
      level: "Mostly Open",
      dimensions: {
        "Software Licensing": { score: "yellow", note: "Plotline project, likely open source but not confirmed" },
        "Data Licensing": { score: "green", note: "Uses public climate and vulnerability data" },
        "Technical Accessibility": { score: "green", note: "Web-based with embedding support indicated" },
        "Data Standards": { score: "green", note: "Standard environmental justice data formats" },
        "Infrastructure": { score: "yellow", note: "Self-hostable web application" },
        "Community Governance": { score: "green", note: "Part of collaborative Plotline project" }
      }
    }
  },
  {
    id: "cafo-explorer-map",
    name: "CAFO Explorer Map",
    organization: "The Plotline",
    description: "Static-feeling UI with clear points but minimal filtering or dynamic interaction. Designed for issue visibility rather than in-depth analysis.",
    url: "https://stories.theplotline.org/cafo-explorer/map/",
    embedUrl: "https://stories.theplotline.org/cafo-explorer/map/",
    license: "Open Source",
    category: "Environmental Monitoring",
    features: ["Exploration", "Awareness Raising"],
    icon: "🌡️",
    status: "Production",
    embedSupported: true,
    embedNote: "Research platform supports embedding",
    openness: {
      score: 4,
      level: "Mostly Open",
      dimensions: {
        "Software Licensing": { score: "yellow", note: "Plotline project, likely open source" },
        "Data Licensing": { score: "green", note: "Uses public agricultural and environmental data" },
        "Technical Accessibility": { score: "green", note: "Web-based map interface" },
        "Data Standards": { score: "green", note: "Standard geospatial formats" },
        "Infrastructure": { score: "yellow", note: "Hosted web application" },
        "Community Governance": { score: "green", note: "Environmental justice community focus" }
      }
    }
  },
  {
    id: "nasa-giovanni",
    name: "NASA Giovanni",
    organization: "NASA Giovanni",
    description: "Powerful tool for generating plots from gridded datasets. Assumes domain knowledge and has limited onboarding.",
    url: "https://giovanni.gsfc.nasa.gov/giovanni/",
    embedUrl: "https://giovanni.gsfc.nasa.gov/giovanni/",
    license: "Public Domain",
    category: "Atmospheric Science",
    features: ["Custom Data Queries", "Visualization", "Download"],
    icon: "🌫️",
    status: "Production",
    embedSupported: false,
    embedNote: "Government domain restrictions may prevent embedding",
    openness: {
      score: 4,
      level: "Mostly Open",
      dimensions: {
        "Software Licensing": { score: "yellow", note: "NASA platform, some open source components" },
        "Data Licensing": { score: "green", note: "NASA public domain data" },
        "Technical Accessibility": { score: "green", note: "Web interface with data download capabilities" },
        "Data Standards": { score: "green", note: "Standard atmospheric and oceanic data formats" },
        "Infrastructure": { score: "red", note: "NASA hosting only" },
        "Community Governance": { score: "yellow", note: "NASA-led with scientific community input" }
      }
    }
  },
  {
    id: "fluid-earth",
    name: "Fluid Earth",
    organization: "Ohio State University",
    description: "Browser-based Earth system visualizations with animations and overlays. Designed for conceptual understanding rather than precise analysis.",
    url: "https://fluid-earth.byrd.osu.edu/",
    embedUrl: "https://fluid-earth.byrd.osu.edu/",
    license: "Academic",
    category: "Ocean & Climate",
    features: ["Visualization", "Education", "Simulation"],
    icon: "🌊",
    status: "Production",
    embedSupported: true,
    embedNote: "Web-based platform supports embedding",
    openness: {
      score: 3,
      level: "Partially Open",
      dimensions: {
        "Software Licensing": { score: "yellow", note: "Academic project, licensing unclear" },
        "Data Licensing": { score: "green", note: "Uses public climate and ocean data" },
        "Technical Accessibility": { score: "green", note: "Browser-based visualization" },
        "Data Standards": { score: "green", note: "Standard Earth system data" },
        "Infrastructure": { score: "red", note: "University hosting only" },
        "Community Governance": { score: "red", note: "Academic institution control" }
      }
    }
  },
  {
    id: "nasa-earthdata-dashboard",
    name: "NASA Earthdata Dashboard",
    organization: "NASA",
    description: "Narrative format with curated global indicators showing pandemic impacts. Visuals are clean and comparable over time.",
    url: "https://www.earthdata.nasa.gov/dashboard/exploration",
    embedUrl: "https://www.earthdata.nasa.gov/dashboard/exploration",
    license: "Public Domain",
    category: "Environmental Monitoring",
    features: ["Storytelling", "Visual Summary"],
    icon: "🌡️",
    status: "Production",
    embedSupported: false,
    embedNote: "Government domain restrictions may prevent embedding",
    openness: {
      score: 4,
      level: "Mostly Open",
      dimensions: {
        "Software Licensing": { score: "yellow", note: "NASA platform with some open components" },
        "Data Licensing": { score: "green", note: "NASA public domain data" },
        "Technical Accessibility": { score: "green", note: "Web dashboard interface" },
        "Data Standards": { score: "green", note: "Earth science data standards" },
        "Infrastructure": { score: "red", note: "NASA hosting only" },
        "Community Governance": { score: "yellow", note: "NASA-led with community engagement" }
      }
    }
  },
  {
    id: "covid-19-earth-observing-dashboard",
    name: "COVID-19 Earth Observing Dashboard",
    organization: "ESA/NASA/JAXA",
    description: "Joint initiative (ESA, NASA, JAXA) tracking COVID-era environmental and economic shifts. Visually polished with toggles for temporal and geographic comparisons.",
    url: "https://eodashboard.org/explore/",
    embedUrl: "https://eodashboard.org/explore/",
    license: "Open Source",
    category: "Environmental Monitoring",
    features: ["Time Series Comparison", "Awareness"],
    icon: "🌡️",
    status: "Production",
    embedSupported: true,
    embedNote: "Web-based platform supports embedding",
    openness: {
      score: 5,
      level: "Mostly Open",
      dimensions: {
        "Software Licensing": { score: "green", note: "Open source collaborative project" },
        "Data Licensing": { score: "green", note: "Public domain satellite data" },
        "Technical Accessibility": { score: "green", note: "Web-based dashboard" },
        "Data Standards": { score: "green", note: "Standard Earth observation formats" },
        "Infrastructure": { score: "yellow", note: "Multi-agency hosting" },
        "Community Governance": { score: "green", note: "International collaboration (ESA, NASA, JAXA)" }
      }
    }
  },
  {
    id: "robin-hawkes-renewables-map",
    name: "Robin Hawkes Renewables Map",
    organization: "Robin Hawkes",
    description: "A hobby project showing UK renewable energy facilities. Simple filters and fly-to interactions.",
    url: "https://renewables-map.robinhawkes.com/",
    embedUrl: "https://renewables-map.robinhawkes.com/",
    license: "Open Source",
    category: "Energy",
    features: ["Exploration", "Education"],
    icon: "⚡",
    status: "Production",
    embedSupported: true,
    embedNote: "Web-based platform supports embedding",
    openness: {
      score: 5,
      level: "Mostly Open",
      dimensions: {
        "Software Licensing": { score: "green", note: "Individual project, likely open source" },
        "Data Licensing": { score: "green", note: "UK public energy infrastructure data" },
        "Technical Accessibility": { score: "green", note: "Web map interface" },
        "Data Standards": { score: "green", note: "Standard energy data formats" },
        "Infrastructure": { score: "green", note: "Self-hosted personal project" },
        "Community Governance": { score: "yellow", note: "Individual maintained" }
      }
    }
  },
  {
    id: "iqair-air-quality-map",
    name: "IQAir Air Quality Map",
    organization: "IQAir",
    description: "Dynamic global map of PM2.5 and AQI readings from ground sensors. High refresh rate and strong visual design.",
    url: "https://www.iqair.com/air-quality-map",
    embedUrl: "https://www.iqair.com/air-quality-map",
    license: "Freemium",
    category: "Environmental Monitoring",
    features: ["Monitoring", "Exploration"],
    icon: "🌬️",
    status: "Production",
    embedSupported: true,
    embedNote: "Commercial platform with embed widgets available",
    openness: {
      score: 2,
      level: "Partially Open",
      dimensions: {
        "Software Licensing": { score: "red", note: "Commercial platform" },
        "Data Licensing": { score: "yellow", note: "Mix of public and proprietary sensor data" },
        "Technical Accessibility": { score: "green", note: "Web interface with embed options" },
        "Data Standards": { score: "green", note: "Standard air quality formats" },
        "Infrastructure": { score: "red", note: "Commercial hosting only" },
        "Community Governance": { score: "red", note: "Commercial company control" }
      }
    }
  },
  {
    id: "iqair-earth",
    name: "IQAir Earth",
    organization: "IQAir",
    description: "Globe-based particle animation showing wind and pollution. Visually striking and accessible, but lacks clarity on data sources.",
    url: "https://www.iqair.com/earth?nav=",
    embedUrl: "https://www.iqair.com/earth?nav=",
    license: "Freemium",
    category: "Environmental Monitoring",
    features: ["Visualization", "Awareness"],
    icon: "🌬️",
    status: "Production",
    embedSupported: true,
    embedNote: "Commercial platform with embed widgets available",
    openness: {
      score: 2,
      level: "Partially Open",
      dimensions: {
        "Software Licensing": { score: "red", note: "Commercial platform" },
        "Data Licensing": { score: "yellow", note: "Mix of public and proprietary data" },
        "Technical Accessibility": { score: "green", note: "Globe visualization interface" },
        "Data Standards": { score: "yellow", note: "Limited data access" },
        "Infrastructure": { score: "red", note: "Commercial hosting only" },
        "Community Governance": { score: "red", note: "Commercial company control" }
      }
    }
  },
  {
    id: "weatherlayers-particle-globe",
    name: "WeatherLayers Particle Globe",
    organization: "WeatherLayers",
    description: "Open-source prototype visualizing wind fields on a globe with particle animations. Primarily aesthetic, with little direct interactivity.",
    url: "https://weatherlayers.github.io/deck.gl-particle/globe.html",
    embedUrl: "https://weatherlayers.github.io/deck.gl-particle/globe.html",
    license: "Open Source",
    category: "Weather",
    features: ["Visualization", "Prototype"],
    icon: "💨",
    status: "Production",
    embedSupported: true,
    embedNote: "Web-based platform supports embedding",
    openness: {
      score: 6,
      level: "Fully Open",
      dimensions: {
        "Software Licensing": { score: "green", note: "Open source prototype on GitHub" },
        "Data Licensing": { score: "green", note: "Uses public weather model data" },
        "Technical Accessibility": { score: "green", note: "Web-based with source code available" },
        "Data Standards": { score: "green", note: "Standard meteorological data formats" },
        "Infrastructure": { score: "green", note: "Self-hostable open source code" },
        "Community Governance": { score: "green", note: "Open source community project" }
      }
    }
  },
  {
    id: "zoom-earth",
    name: "Zoom Earth",
    organization: "Zoom Earth",
    description: "Public-facing tool for viewing satellite imagery, live weather, and tropical storm tracking. Performance is good, map is responsive.",
    url: "https://zoom.earth/",
    embedUrl: "https://zoom.earth/",
    license: "Freemium",
    category: "Satellite Imagery",
    features: ["Monitoring", "Exploration", "Real-Time Updates"],
    icon: "🛰️",
    status: "Production",
    embedSupported: true,
    embedNote: "Web-based platform supports embedding",
    openness: {
      score: 2,
      level: "Partially Open",
      dimensions: {
        "Software Licensing": { score: "red", note: "Commercial platform" },
        "Data Licensing": { score: "green", note: "Uses public satellite data" },
        "Technical Accessibility": { score: "green", note: "Web interface with good performance" },
        "Data Standards": { score: "yellow", note: "Standard formats but limited API access" },
        "Infrastructure": { score: "red", note: "Commercial hosting only" },
        "Community Governance": { score: "red", note: "Commercial company control" }
      }
    }
  },
  {
    id: "earth-nullschool",
    name: "Earth Nullschool",
    organization: "Cameron Beccario",
    description: "Animated globe showing weather patterns. Offers multiple layers and altitudes, with fast transitions.",
    url: "https://earth.nullschool.net/",
    embedUrl: "https://earth.nullschool.net/",
    license: "Open Source",
    category: "Weather",
    features: ["Visualization", "Exploration"],
    icon: "💨",
    status: "Production",
    embedSupported: true,
    embedNote: "Web-based platform supports embedding",
    openness: {
      score: 5,
      level: "Mostly Open",
      dimensions: {
        "Software Licensing": { score: "green", note: "Open source project on GitHub" },
        "Data Licensing": { score: "green", note: "Uses public weather and climate data" },
        "Technical Accessibility": { score: "green", note: "Web-based globe visualization" },
        "Data Standards": { score: "green", note: "Standard meteorological formats" },
        "Infrastructure": { score: "yellow", note: "Self-hostable but complex setup" },
        "Community Governance": { score: "yellow", note: "Individual maintainer with community contributions" }
      }
    }
  },
  {
    id: "carbonplan-dor-efficiency",
    name: "CarbonPlan DOR Efficiency",
    organization: "CarbonPlan",
    description: "Static visuals and interactive plots to communicate effectiveness of carbon removal offsets. Prioritizes clarity and transparency in methodology.",
    url: "https://carbonplan.org/research/dor-efficiency",
    embedUrl: "https://carbonplan.org/research/dor-efficiency",
    license: "MIT",
    category: "Carbon",
    features: ["Explanation", "Visualization", "Research Summary"],
    icon: "🌿",
    status: "Production",
    embedSupported: true,
    embedNote: "Open source tool supports embedding",
    openness: {
      score: 6,
      level: "Fully Open",
      dimensions: {
        "Software Licensing": { score: "green", note: "Open source project with MIT license" },
        "Data Licensing": { score: "green", note: "Open climate and carbon removal data" },
        "Technical Accessibility": { score: "green", note: "Web-based research tool" },
        "Data Standards": { score: "green", note: "Standard climate data formats" },
        "Infrastructure": { score: "green", note: "Self-hostable research platform" },
        "Community Governance": { score: "green", note: "Open science community governance" }
      }
    }
  },
  {
    id: "carbonplan-forest-offsets-fires",
    name: "CarbonPlan Forest Offsets & Fires",
    organization: "CarbonPlan",
    description: "Explains fire risk to forest carbon projects through mapped overlays and offset scoring. Strong integration of narrative and visuals.",
    url: "https://carbonplan.org/research/forest-offsets-fires",
    embedUrl: "https://carbonplan.org/research/forest-offsets-fires",
    license: "MIT",
    category: "Carbon",
    features: ["Analysis", "Visual Explanation", "Policy Insight"],
    icon: "🔥",
    status: "Production",
    embedSupported: true,
    embedNote: "Open source tool supports embedding",
    openness: {
      score: 6,
      level: "Fully Open",
      dimensions: {
        "Software Licensing": { score: "green", note: "Open source project with MIT license" },
        "Data Licensing": { score: "green", note: "Open forest and climate data" },
        "Technical Accessibility": { score: "green", note: "Web-based analysis tool" },
        "Data Standards": { score: "green", note: "Standard geospatial and climate formats" },
        "Infrastructure": { score: "green", note: "Self-hostable research platform" },
        "Community Governance": { score: "green", note: "Open science community governance" }
      }
    }
  },
  {
    id: "era-explorer",
    name: "ERA Explorer",
    organization: "Copernicus",
    description: "Tool for plotting ERA5 and ERA20C reanalysis data by point location. Functional but not polished.",
    url: "https://era-explorer.climate.copernicus.eu/?lat=50.86&lng=4.35&plot=0",
    embedUrl: "https://era-explorer.climate.copernicus.eu/?lat=50.86&lng=4.35&plot=0",
    license: "Open Data",
    category: "Climate",
    features: ["Time Series Plotting", "Data Comparison"],
    icon: "🌡️",
    status: "Production",
    embedSupported: false,
    embedNote: "EU platform may have embedding restrictions",
    openness: {
      score: 4,
      level: "Mostly Open",
      dimensions: {
        "Software Licensing": { score: "yellow", note: "EU platform, some open components" },
        "Data Licensing": { score: "green", note: "Public climate reanalysis data" },
        "Technical Accessibility": { score: "green", note: "Web interface for data plotting" },
        "Data Standards": { score: "green", note: "Standard climate data formats" },
        "Infrastructure": { score: "red", note: "EU agency hosting only" },
        "Community Governance": { score: "yellow", note: "EU-led with scientific community input" }
      }
    }
  },
  {
    id: "climate-trace",
    name: "Climate TRACE",
    organization: "Climate TRACE",
    description: "Tracks emissions at a fine spatial and sectoral scale. Map is performant, with filters for year, sector, and region.",
    url: "https://climatetrace.org/explore/",
    embedUrl: "https://climatetrace.org/explore/",
    license: "Open Source",
    category: "Emissions",
    features: ["Monitoring", "Accountability", "Exploration"],
    icon: "💨",
    status: "Production",
    embedSupported: true,
    embedNote: "Web-based platform supports embedding",
    openness: {
      score: 5,
      level: "Mostly Open",
      dimensions: {
        "Software Licensing": { score: "yellow", note: "Coalition project, mixed licensing" },
        "Data Licensing": { score: "green", note: "Open emissions data" },
        "Technical Accessibility": { score: "green", note: "Web platform with robust filtering" },
        "Data Standards": { score: "green", note: "Standard emissions data formats" },
        "Infrastructure": { score: "yellow", note: "Coalition hosting with data access" },
        "Community Governance": { score: "green", note: "Multi-stakeholder governance" }
      }
    }
  },
  {
    id: "ocean-wealth-mapping-tool",
    name: "Ocean Wealth Mapping Tool",
    organization: "Ocean Wealth",
    description: "Presents spatial data on coral reefs, mangroves, fisheries, etc. Map layers are accessible but interface is dated.",
    url: "https://maps.oceanwealth.org/#/data",
    embedUrl: "https://maps.oceanwealth.org/#/data",
    license: "Open Source",
    category: "Marine Ecosystems",
    features: ["Exploration", "Map Visualization"],
    icon: "🐠",
    status: "Production",
    embedSupported: true,
    embedNote: "Web-based platform supports embedding",
    openness: {
      score: 3,
      level: "Partially Open",
      dimensions: {
        "Software Licensing": { score: "yellow", note: "WRI platform, licensing unclear" },
        "Data Licensing": { score: "green", note: "Marine ecosystem data" },
        "Technical Accessibility": { score: "green", note: "Web mapping interface" },
        "Data Standards": { score: "green", note: "Standard marine data formats" },
        "Infrastructure": { score: "red", note: "WRI hosting only" },
        "Community Governance": { score: "red", note: "Institutional control" }
      }
    }
  },
  {
    id: "global-forest-watch",
    name: "Global Forest Watch",
    organization: "Global Forest Watch",
    description: "Sophisticated web mapping platform with up-to-date forest monitoring data. Includes alerts, time sliders, and download tools.",
    url: "https://www.globalforestwatch.org/map/",
    embedUrl: "https://www.globalforestwatch.org/map/",
    license: "Open Source",
    category: "Forests",
    features: ["Monitoring", "Alerts", "Analysis", "Export"],
    icon: "🌲",
    status: "Production",
    embedSupported: true,
    embedNote: "Web-based platform supports embedding",
    openness: {
      score: 5,
      level: "Mostly Open",
      dimensions: {
        "Software Licensing": { score: "green", note: "Open source platform" },
        "Data Licensing": { score: "green", note: "Open forest monitoring data" },
        "Technical Accessibility": { score: "green", note: "Web platform with extensive features" },
        "Data Standards": { score: "green", note: "Standard geospatial formats" },
        "Infrastructure": { score: "yellow", note: "WRI hosting but open source" },
        "Community Governance": { score: "green", note: "Multi-stakeholder governance" }
      }
    }
  },
  {
    id: "global-fishing-watch",
    name: "Global Fishing Watch",
    organization: "Global Fishing Watch",
    description: "Tracks fishing vessel movements using AIS and machine learning. Features time filtering, EEZ overlays, and behavior classification.",
    url: "https://globalfishingwatch.org/map",
    embedUrl: "https://globalfishingwatch.org/map",
    license: "Open Source",
    category: "Marine Monitoring",
    features: ["Monitoring", "Analysis", "Investigation"],
    icon: "🐟",
    status: "Production",
    embedSupported: true,
    embedNote: "Web-based platform supports embedding",
    openness: {
      score: 5,
      level: "Mostly Open",
      dimensions: {
        "Software Licensing": { score: "green", note: "Open source platform" },
        "Data Licensing": { score: "green", note: "Open vessel tracking data" },
        "Technical Accessibility": { score: "green", note: "Web platform with analysis tools" },
        "Data Standards": { score: "green", note: "Standard maritime data formats" },
        "Infrastructure": { score: "yellow", note: "Organization hosting but open platform" },
        "Community Governance": { score: "green", note: "Multi-stakeholder governance" }
      }
    }
  },
  {
    id: "aqueduct-water-risk-atlas",
    name: "Aqueduct Water Risk Atlas",
    organization: "World Resources Institute",
    description: "Used to assess and benchmark water-related risks by sector and region. Allows dynamic scenario testing and data downloads.",
    url: "https://www.wri.org/applications/aqueduct/water-risk-atlas/",
    embedUrl: "https://www.wri.org/applications/aqueduct/water-risk-atlas/",
    license: "Open Source",
    category: "Water Resources",
    features: ["Risk Analysis", "Download", "Scenario Exploration"],
    icon: "⚠️",
    status: "Production",
    embedSupported: true,
    embedNote: "Web-based platform supports embedding",
    openness: {
      score: 3,
      level: "Partially Open",
      dimensions: {
        "Software Licensing": { score: "yellow", note: "WRI platform, licensing unclear" },
        "Data Licensing": { score: "green", note: "Water risk data available" },
        "Technical Accessibility": { score: "green", note: "Web platform with scenario analysis" },
        "Data Standards": { score: "green", note: "Standard water data formats" },
        "Infrastructure": { score: "red", note: "WRI hosting only" },
        "Community Governance": { score: "red", note: "Institutional control" }
      }
    }
  },
  {
    id: "kelpwatch",
    name: "KelpWatch",
    organization: "KelpWatch",
    description: "Time-series viewer for kelp canopy area based on Landsat. Provides context and scientific citations.",
    url: "https://kelpwatch.org/map",
    embedUrl: "https://kelpwatch.org/map",
    license: "Open Source",
    category: "Marine Ecosystems",
    features: ["Monitoring", "Time Series Visualization"],
    icon: "🐠",
    status: "Production",
    embedSupported: true,
    embedNote: "Web-based platform supports embedding",
    openness: {
      score: 4,
      level: "Mostly Open",
      dimensions: {
        "Software Licensing": { score: "yellow", note: "Academic project, licensing unclear" },
        "Data Licensing": { score: "green", note: "Satellite-derived kelp data" },
        "Technical Accessibility": { score: "green", note: "Web interface for time series" },
        "Data Standards": { score: "green", note: "Standard satellite data formats" },
        "Infrastructure": { score: "yellow", note: "Academic hosting" },
        "Community Governance": { score: "green", note: "Marine science community focus" }
      }
    }
  },
  {
    id: "goes-plume-viewer",
    name: "GOES Plume Viewer",
    organization: "NASA",
    description: "Shows methane plumes detected by GOES satellites. Focused and technical, with fixed imagery and time sliders.",
    url: "https://earth.gov/ghgcenter/custom-interfaces/goes-plume-viewer/",
    embedUrl: "https://earth.gov/ghgcenter/custom-interfaces/goes-plume-viewer/",
    license: "Public Domain",
    category: "Atmospheric Science",
    features: ["Event Review", "Visual Analysis"],
    icon: "📊",
    status: "Production",
    embedSupported: false,
    embedNote: "Government domain restrictions may prevent embedding",
    openness: {
      score: 4,
      level: "Mostly Open",
      dimensions: {
        "Software Licensing": { score: "yellow", note: "NASA platform, some open components" },
        "Data Licensing": { score: "green", note: "NASA public domain data" },
        "Technical Accessibility": { score: "green", note: "Web interface for plume analysis" },
        "Data Standards": { score: "green", note: "Standard remote sensing formats" },
        "Infrastructure": { score: "red", note: "NASA hosting only" },
        "Community Governance": { score: "yellow", note: "NASA-led scientific tool" }
      }
    }
  },
  {
    id: "emit-ch4-plume-viewer",
    name: "EMIT CH₄ Plume Viewer",
    organization: "NASA",
    description: "Similar to the GOES tool but using EMIT data. Static overlays with minimal UI. Designed for verification and expert review.",
    url: "https://earth.gov/ghgcenter/custom-interfaces/emit-ch4plume-v1",
    embedUrl: "https://earth.gov/ghgcenter/custom-interfaces/emit-ch4plume-v1",
    license: "Public Domain",
    category: "Atmospheric Science",
    features: ["Event Detection", "Remote Sensing QA"],
    icon: "📊",
    status: "Production",
    embedSupported: false,
    embedNote: "Government domain restrictions may prevent embedding",
    openness: {
      score: 4,
      level: "Mostly Open",
      dimensions: {
        "Software Licensing": { score: "yellow", note: "NASA platform, some open components" },
        "Data Licensing": { score: "green", note: "NASA public domain data" },
        "Technical Accessibility": { score: "green", note: "Web interface for hyperspectral analysis" },
        "Data Standards": { score: "green", note: "Standard remote sensing formats" },
        "Infrastructure": { score: "red", note: "NASA hosting only" },
        "Community Governance": { score: "yellow", note: "NASA-led scientific tool" }
      }
    }
  },
  {
    id: "mobile-climate-mapper",
    name: "Mobile Climate Mapper",
    organization: "NASA",
    description: "Mobile-first tool for viewing localized climate trends in US cities. Clear graphs and clean design.",
    url: "https://earth.gov/mobile-climate-mapper/",
    embedUrl: "https://earth.gov/mobile-climate-mapper/",
    license: "Public Domain",
    category: "Climate",
    features: ["Education", "Mobile Exploration"],
    icon: "🌡️",
    status: "Production",
    embedSupported: false,
    embedNote: "Government domain restrictions may prevent embedding",
    openness: {
      score: 4,
      level: "Mostly Open",
      dimensions: {
        "Software Licensing": { score: "yellow", note: "NASA platform, some open components" },
        "Data Licensing": { score: "green", note: "Public climate data" },
        "Technical Accessibility": { score: "green", note: "Mobile-first web interface" },
        "Data Standards": { score: "green", note: "Standard climate data formats" },
        "Infrastructure": { score: "red", note: "NASA hosting only" },
        "Community Governance": { score: "yellow", note: "NASA educational tool" }
      }
    }
  }
];
