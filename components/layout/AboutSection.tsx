export function AboutSection() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Directory</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Our Mission</h3>
          <p className="text-gray-600 mb-4">
            We curate high-quality Earth science visualization tools that are open source, 
            embeddable, and production-ready. Every tool is evaluated across six dimensions 
            of openness to ensure you can trust them in your projects.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Quality Standards</h3>
          <ul className="text-gray-600 space-y-2">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Open source licensing (MIT, Apache 2.0, BSD)
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Open data with no API key requirements
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Production-ready and actively maintained
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Safe Embedding</h3>
          <p className="text-gray-600 mb-4">
            All tools are evaluated for safe iframe embedding with proper security headers, 
            HTTPS support, and Content Security Policy compatibility. We provide complete 
            implementation guides for each tool.
          </p>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Assessment Framework</h3>
          <p className="text-gray-600">
            Each tool receives a score from 1-6 across software licensing, data licensing, 
            technical accessibility, data standards, infrastructure, and community governance.
          </p>
        </div>
      </div>
    </div>
  );
}
