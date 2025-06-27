import Link from "next/link";

// Tool data structure
const tools = [
  {
    id: "fire-event-explorer",
    name: "Fire Event Explorer",
    organization: "Development Seed",
    description: "Explore wildfire perimeters, track fire progression over time, and analyze burn severity. Perfect for emergency management and fire risk communication.",
    url: "https://www.earthdata.nasa.gov/dashboard/tools/fire-event-explorer",
    embedUrl: "https://fire-event-explorer.dev-seed.org/embed",
    license: "MIT",
    category: "Disasters",
    features: ["Real-time fire tracking", "Burn severity analysis", "Interactive timelines"],
    icon: "🔥",
    status: "Production"
  },
  {
    id: "nasa-worldview",
    name: "NASA Worldview",
    organization: "NASA GIBS",
    description: "Browse 1,200+ global satellite imagery layers with near real-time data from NASA's Global Imagery Browse Services.",
    url: "https://worldview.earthdata.nasa.gov/",
    embedUrl: "https://worldview.earthdata.nasa.gov/?embed=true",
    license: "Apache 2.0",
    category: "Satellite Imagery",
    features: ["1,200+ data layers", "Near real-time data", "Animation tools"],
    icon: "🌍",
    status: "Production"
  },
  {
    id: "usgs-earthquakes",
    name: "USGS Real-time Earthquakes",
    organization: "U.S. Geological Survey",
    description: "Global earthquake monitoring with magnitude and location data updated in real-time from seismic monitoring stations worldwide.",
    url: "https://earthquake.usgs.gov/earthquakes/map/",
    embedUrl: "https://earthquake.usgs.gov/earthquakes/map/?embed=true",
    license: "Public Domain",
    category: "Disasters",
    features: ["Real-time updates", "Global coverage", "Magnitude filtering"],
    icon: "🌍",
    status: "Production"
  },
  {
    id: "usgs-water-data",
    name: "USGS Water Data Dashboard",
    organization: "U.S. Geological Survey",
    description: "Real-time water monitoring including stream flow and groundwater levels across the United States from USGS monitoring stations.",
    url: "https://dashboard.waterdata.usgs.gov/",
    embedUrl: "https://dashboard.waterdata.usgs.gov/embed",
    license: "Public Domain",
    category: "Water Resources",
    features: ["Stream flow data", "Groundwater levels", "Station networks"],
    icon: "🌊",
    status: "Production"
  },
  {
    id: "nasa-ocean-color",
    name: "NASA Ocean Color Web",
    organization: "NASA Ocean Biology",
    description: "Marine ecosystem and climate indicators showing ocean color and temperature data from satellite observations.",
    url: "https://oceancolor.gsfc.nasa.gov/",
    embedUrl: "https://oceancolor.gsfc.nasa.gov/cgi/browse.pl?embed=1",
    license: "Open Source",
    category: "Ocean & Climate",
    features: ["Ocean color data", "Temperature maps", "Climate indicators"],
    icon: "🌊",
    status: "Production"
  },
  {
    id: "noaa-climate-explorer",
    name: "NOAA Climate Explorer",
    organization: "NOAA",
    description: "Local climate projections and trend analysis showing historical trends and future projections for temperature and precipitation.",
    url: "https://toolkit.climate.gov/climate-explorer2/",
    embedUrl: "https://toolkit.climate.gov/climate-explorer2/?embed=true",
    license: "Public Domain",
    category: "Climate",
    features: ["Climate projections", "Historical trends", "Local data"],
    icon: "🌡️",
    status: "Production"
  }
];

const categories = ["All", "Disasters", "Climate", "Water Resources", "Ocean & Climate", "Satellite Imagery"];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b section-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-semibold text-ds-orange">
                Open Earth Tools Directory
              </Link>
            </div>
            <div className="flex items-center space-x-8">
              <Link href="#tools" className="nav-link">
                Tools
              </Link>
              <Link href="#guides" className="nav-link">
                Implementation Guides
              </Link>
              <Link href="#submit" className="nav-link">
                Submit a Tool
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-20 lg:py-32">
            <div className="max-w-4xl">
              {/* Main Headline - Development Seed style */}
              <h1 className="headline-large mb-8">
                Open Earth Tools Directory
              </h1>
              
              {/* Subheading */}
              <p className="headline-medium mb-12 max-w-3xl">
                Curated open source Earth science visualization tools ready for safe embedding and storytelling.
              </p>

              {/* Description */}
              <div className="mb-12">
                <p className="body-large mb-6 max-w-3xl">
                  Quality-vetted tools from NASA, USGS, NOAA and the community. All feature open licensing, 
                  excellent documentation, and modern security practices.
                </p>
              </div>

              {/* Call to Action */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="#tools"
                  className="btn-primary"
                >
                  Explore Tools
                </Link>
                <Link 
                  href="#guides"
                  className="btn-secondary"
                >
                  Implementation Guides
                </Link>
              </div>
            </div>
          </div>

          {/* Value Props Section */}
          <div className="py-16 border-t section-divider">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-ds-dark-gray mb-4">
                  Open Everything
                </h3>
                <p className="text-ds-light-gray leading-relaxed">
                  No API keys, no licensing fees, no vendor lock-in. Pure open source tools and data.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-ds-dark-gray mb-4">
                  Story-Ready
                </h3>
                <p className="text-ds-light-gray leading-relaxed">
                  Pre-tested for embedding in websites and narratives. Perfect for science communication.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-ds-dark-gray mb-4">
                  Security-First
                </h3>
                <p className="text-ds-light-gray leading-relaxed">
                  Safe embedding documentation and implementation guides for secure integration.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-ds-dark-gray mb-4">
                  Community-Driven
                </h3>
                <p className="text-ds-light-gray leading-relaxed">
                  Cross-institutional curation, not single-vendor promotion. Built for the community.
                </p>
              </div>
            </div>
          </div>

          {/* Tools Directory Section */}
          <div id="tools" className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light text-ds-dark-gray mb-4">Tools Directory</h2>
              <p className="text-lg text-ds-light-gray max-w-2xl mx-auto">
                Explore our curated collection of open source Earth science visualization tools, 
                all vetted for quality, security, and ease of integration.
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    category === "All" 
                      ? "bg-ds-orange text-white" 
                      : "bg-gray-100 text-ds-gray hover:bg-orange-50 hover:text-ds-orange"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            {/* Tools Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tools.map((tool) => (
                <div key={tool.id} className="border border-gray-200 rounded-lg p-6 hover:border-ds-orange transition-colors group">
                  {/* Tool Header */}
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-ds-orange rounded-lg flex items-center justify-center mr-4">
                      <span className="text-white font-semibold text-lg">{tool.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-ds-dark-gray group-hover:text-ds-orange transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-ds-light-gray">{tool.organization}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-ds-light-gray text-sm mb-4 leading-relaxed">
                    {tool.description}
                  </p>

                  {/* Features */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {tool.features.slice(0, 3).map((feature, index) => (
                        <span 
                          key={index}
                          className="text-xs px-2 py-1 bg-gray-100 text-ds-gray rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex gap-2 mb-4">
                    <span className="text-xs px-3 py-1 bg-orange-50 text-orange-600 rounded-full">
                      Embed Ready
                    </span>
                    <span className="text-xs px-3 py-1 bg-green-50 text-green-600 rounded-full">
                      {tool.license}
                    </span>
                    <span className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                      {tool.category}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link 
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center px-3 py-2 border border-ds-orange text-ds-orange text-sm font-medium hover:bg-orange-50 transition-colors"
                    >
                      View Tool
                    </Link>
                    <button className="px-3 py-2 bg-ds-orange text-white text-sm font-medium hover:bg-ds-dark-orange transition-colors">
                      Embed Code
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <button className="inline-flex items-center px-6 py-3 border border-ds-orange text-base font-medium text-ds-orange hover:bg-orange-50 transition-colors">
                Load More Tools
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Implementation Guides Section */}
          <div id="guides" className="py-16 border-t section-divider">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light text-ds-dark-gray mb-4">Implementation Guides</h2>
              <p className="text-lg text-ds-light-gray max-w-2xl mx-auto">
                Everything you need to safely embed and integrate these tools into your projects.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-ds-orange rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🔒</span>
                </div>
                <h3 className="text-lg font-semibold text-ds-dark-gray mb-3">Security Best Practices</h3>
                <p className="text-ds-light-gray mb-4">
                  Complete guide to safe iframe embedding with CSP headers, sandbox attributes, and HTTPS requirements.
                </p>
                <Link href="#security" className="text-ds-orange hover:text-ds-dark-orange font-medium">
                  Read Security Guide →
                </Link>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-ds-orange rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">⚡</span>
                </div>
                <h3 className="text-lg font-semibold text-ds-dark-gray mb-3">Quick Start Templates</h3>
                <p className="text-ds-light-gray mb-4">
                  Copy-paste ready code examples for popular platforms like WordPress, Drupal, and static sites.
                </p>
                <Link href="#templates" className="text-ds-orange hover:text-ds-dark-orange font-medium">
                  Get Templates →
                </Link>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-ds-orange rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">📋</span>
                </div>
                <h3 className="text-lg font-semibold text-ds-dark-gray mb-3">Quality Standards</h3>
                <p className="text-ds-light-gray mb-4">
                  Learn what makes a tool "directory-worthy" and how to submit your own tools for inclusion.
                </p>
                <Link href="#standards" className="text-ds-orange hover:text-ds-dark-orange font-medium">
                  View Standards →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t section-divider footer-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-6 md:mb-0">
              <p className="text-ds-light-gray">
                A project by{" "}
                <Link 
                  href="https://developmentseed.org" 
                  className="text-ds-orange hover:text-ds-dark-orange font-medium transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Development Seed
                </Link>
              </p>
            </div>
            <div className="flex space-x-6">
              <Link href="/about" className="nav-link">
                About
              </Link>
              <Link href="/contact" className="nav-link">
                Contact
              </Link>
              <Link 
                href="https://github.com/developmentseed" 
                className="nav-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}