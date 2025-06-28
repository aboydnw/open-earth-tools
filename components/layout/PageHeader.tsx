export function PageHeader() {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Open Earth Tools Directory
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
        Curated open source Earth science visualization tools ready for safe embedding and storytelling. 
        Quality-vetted tools from NASA, USGS, NOAA and the community.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Open Source & Open Data</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Safe for Embedding</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span>Production Ready</span>
        </div>
      </div>
    </div>
  );
}
