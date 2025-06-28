import Link from "next/link";
import { Tool } from '../lib/types';
import { OpennessScore } from './OpennessScore';

interface ToolCardProps {
  tool: Tool;
  onOpenModal: (tool: Tool) => void;
  onGenerateEmbed?: (tool: Tool) => void;
}

export function ToolCard({ tool, onOpenModal, onGenerateEmbed }: ToolCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-xl font-semibold">{tool.icon}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{tool.name}</h3>
              <p className="text-sm text-gray-500">{tool.organization}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <OpennessScore score={tool.openness.score} level={tool.openness.level} />
            {tool.embedSupported ? (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                ✓ Embeddable
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                ⚠ Embed Limited
              </span>
            )}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{tool.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {tool.features.slice(0, 3).map((feature, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
            >
              {feature}
            </span>
          ))}
          {tool.features.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
              +{tool.features.length - 3} more
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onOpenModal(tool)}
            className="flex-1 px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded hover:bg-orange-600 transition-colors"
          >
            Preview Tool
          </button>
          <Link
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors"
          >
            Open Direct
          </Link>
          {onGenerateEmbed && (
            <button
              onClick={() => onGenerateEmbed(tool)}
              className="px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors"
              title="Generate Embed Code"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
