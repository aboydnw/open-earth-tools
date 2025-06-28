import { Tool } from '../lib/types';

interface StatsSectionProps {
  tools: Tool[];
}

export function StatsSection({ tools }: StatsSectionProps) {
  // Calculate real statistics from the tools data
  const totalTools = tools.length;
  const embeddableTools = tools.filter(tool => tool.embedSupported).length;
  const uniqueCategories = new Set(tools.map(tool => tool.category)).size;
  const uniqueOrganizations = new Set(tools.map(tool => tool.organization)).size;
  
  // Calculate openness distribution
  const openTools = tools.filter(tool => 
    tool.openness.level === 'Fully Open' || tool.openness.level === 'Mostly Open'
  ).length;
  const openPercentage = totalTools > 0 ? Math.round((openTools / totalTools) * 100) : 0;

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-8 text-white mb-8">
      <h2 className="text-2xl font-bold mb-6">Directory Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold mb-2">{totalTools}</div>
          <div className="text-orange-100">Curated Tools</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold mb-2">{embeddableTools}</div>
          <div className="text-orange-100">Embeddable Tools</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold mb-2">{openPercentage}%</div>
          <div className="text-orange-100">Open Tools</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold mb-2">{uniqueCategories}</div>
          <div className="text-orange-100">Categories</div>
        </div>
      </div>
      
      {/* Additional stats row */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-orange-400">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">{uniqueOrganizations}</div>
          <div className="text-orange-100">Organizations</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold mb-2">
            {tools.filter(tool => tool.openness.level === 'Fully Open').length}
          </div>
          <div className="text-orange-100">Fully Open</div>
        </div>
      </div>
    </div>
  );
}
