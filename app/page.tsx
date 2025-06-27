import Link from "next/link";

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

          {/* Featured Tools Preview */}
          <div className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light text-ds-dark-gray mb-4">Featured Tools</h2>
              <p className="text-lg text-ds-light-gray max-w-2xl mx-auto">
                Explore our curated collection of open source Earth science visualization tools, 
                all vetted for quality, security, and ease of integration.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Tool Card 1 */}
              <div className="border border-gray-200 rounded-lg p-6 hover:border-ds-orange transition-colors">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-ds-orange rounded-lg flex items-center justify-center mr-4">
                    <span className="text-white font-semibold text-lg">🔥</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-ds-dark-gray">Fire Event Explorer</h3>
                    <p className="text-sm text-ds-light-gray">Development Seed</p>
                  </div>
                </div>
                <p className="text-ds-light-gray text-sm mb-4">
                  Explore wildfire perimeters, track fire progression over time, and analyze burn severity. 
                  Perfect for emergency management and fire risk communication.
                </p>
                <div className="flex gap-2">
                  <span className="text-xs px-3 py-1 bg-orange-50 text-orange-600 rounded-full">
                    Embed Ready
                  </span>
                  <span className="text-xs px-3 py-1 bg-green-50 text-green-600 rounded-full">
                    MIT License
                  </span>
                </div>
              </div>

              {/* Tool Card 2 */}
              <div className="border border-gray-200 rounded-lg p-6 hover:border-ds-orange transition-colors">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-ds-orange rounded-lg flex items-center justify-center mr-4">
                    <span className="text-white font-semibold text-lg">🌍</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-ds-dark-gray">NASA Worldview</h3>
                    <p className="text-sm text-ds-light-gray">NASA GIBS</p>
                  </div>
                </div>
                <p className="text-ds-light-gray text-sm mb-4">
                  Browse 1,200+ global satellite imagery layers with near real-time data from NASA's 
                  Global Imagery Browse Services.
                </p>
                <div className="flex gap-2">
                  <span className="text-xs px-3 py-1 bg-orange-50 text-orange-600 rounded-full">
                    Embed Ready
                  </span>
                  <span className="text-xs px-3 py-1 bg-green-50 text-green-600 rounded-full">
                    Open Source
                  </span>
                </div>
              </div>

              {/* Tool Card 3 */}
              <div className="border border-gray-200 rounded-lg p-6 hover:border-ds-orange transition-colors">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-ds-orange rounded-lg flex items-center justify-center mr-4">
                    <span className="text-white font-semibold text-lg">🌊</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-ds-dark-gray">USGS Water Data</h3>
                    <p className="text-sm text-ds-light-gray">U.S. Geological Survey</p>
                  </div>
                </div>
                <p className="text-ds-light-gray text-sm mb-4">
                  Real-time water monitoring including stream flow and groundwater levels across 
                  the United States from USGS monitoring stations.
                </p>
                <div className="flex gap-2">
                  <span className="text-xs px-3 py-1 bg-orange-50 text-orange-600 rounded-full">
                    Embed Ready
                  </span>
                  <span className="text-xs px-3 py-1 bg-green-50 text-green-600 rounded-full">
                    Public Domain
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link 
                href="#tools" 
                className="inline-flex items-center px-6 py-3 border border-ds-orange text-base font-medium text-ds-orange hover:bg-orange-50 transition-colors"
              >
                View All Tools
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
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