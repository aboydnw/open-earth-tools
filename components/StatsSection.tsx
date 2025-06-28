export function StatsSection() {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-8 text-white mb-8">
      <h2 className="text-2xl font-bold mb-6">Directory Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold mb-2">9</div>
          <div className="text-orange-100">Curated Tools</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold mb-2">6</div>
          <div className="text-orange-100">Embeddable Tools</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold mb-2">100%</div>
          <div className="text-orange-100">Open Data</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold mb-2">9</div>
          <div className="text-orange-100">Categories</div>
        </div>
      </div>
    </div>
  );
}
