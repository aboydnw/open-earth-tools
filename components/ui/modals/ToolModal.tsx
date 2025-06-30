import Link from "next/link";
import { useState } from "react";
import { Tool } from '@/types';
import { opennessLevels } from '@/lib/constants';
import { OpennessScore } from '@/components/features/tools/OpennessScore';

interface ToolModalProps {
  tool: Tool;
  isOpen: boolean;
  onClose: () => void;
}

export function ToolModal({ tool, isOpen, onClose }: ToolModalProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'assessment'>('preview');
  const [iframeError, setIframeError] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  if (!isOpen) return null;

  const config = opennessLevels[tool.openness.level];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-semibold">{tool.icon}</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
                <p className="text-sm text-gray-500">{tool.organization}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <OpennessScore score={tool.openness.score} level={tool.openness.level} size="lg" />
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'preview' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Tool Preview
            </button>
            <button
              onClick={() => setActiveTab('assessment')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'assessment' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Openness Assessment
            </button>
          </div>

          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {activeTab === 'preview' ? (
              <>
                <p className="text-gray-600 mb-4">{tool.description}</p>
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                  <div className="bg-white rounded border-2 border-dashed border-gray-300 h-96 flex items-center justify-center relative">
                    {tool.embedSupported && !iframeError ? (
                      <div className="w-full h-full relative">
                        {!iframeLoaded && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded">
                            <div className="text-center">
                              <div className="animate-spin w-8 h-8 border-2 border-ds-orange-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                              <p className="text-sm text-gray-600">Loading preview...</p>
                            </div>
                          </div>
                        )}
                        <iframe
                          src={tool.embedUrl}
                          className="w-full h-full rounded"
                          title={`${tool.name} - ${tool.organization}`}
                          sandbox="allow-scripts allow-forms allow-popups allow-same-origin allow-top-navigation-by-user-activation allow-modals"
                          allow="camera 'none'; microphone 'none'; geolocation 'none'; payment 'none'; usb 'none'; bluetooth 'none'"
                          referrerPolicy="strict-origin-when-cross-origin"
                          loading="lazy"
                          onLoad={() => {
                            setIframeLoaded(true);
                            setIframeError(false);
                          }}
                          onError={() => {
                            console.warn('Iframe failed to load:', tool.name);
                            setIframeError(true);
                            setIframeLoaded(false);
                          }}
                        />
                        {iframeLoaded && (
                          <div className="mt-2 text-center space-y-2">
                            <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded inline-block">
                              🔒 Camera, microphone, and location access blocked for security
                            </div>
                            <div>
                              <Link 
                                href={tool.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                Open in new tab for full features
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-4xl mb-4">{tool.icon}</div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {iframeError ? 'Preview Blocked' : 'Preview Not Available'}
                        </h4>
                        <p className="text-gray-600 text-sm mb-3 max-w-md mx-auto">
                          {iframeError 
                            ? 'This tool cannot be embedded due to security policies. The site may block framing or require special permissions.'
                            : (tool.embedNote || 'This tool does not support iframe embedding.')
                          }
                        </p>
                        {iframeError && (
                          <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-left max-w-md mx-auto">
                            <p className="text-yellow-800 text-xs">
                              <strong>Common causes:</strong> Content Security Policy restrictions, 
                              X-Frame-Options headers, or HTTPS mixed content issues.
                            </p>
                          </div>
                        )}
                        <div className="space-y-2">
                          <Link 
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-4 py-2 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition-colors"
                          >
                            Open Tool Directly
                          </Link>
                          {iframeError && (
                            <div>
                              <button
                                onClick={() => {
                                  setIframeError(false);
                                  setIframeLoaded(false);
                                }}
                                className="ml-2 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                              >
                                Try Again
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 mb-6`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Overall Openness Score</h4>
                    <OpennessScore score={tool.openness.score} level={tool.openness.level} size="lg" />
                  </div>
                  <p className={`text-sm ${config.textColor}`}>
                    This tool scores {tool.openness.score} out of 6 across our assessment dimensions, 
                    making it <strong>{tool.openness.level}</strong> according to our framework.
                  </p>
                </div>

                <h4 className="font-semibold text-gray-900 mb-4">Assessment Breakdown</h4>
                <div className="space-y-4">
                  {Object.entries(tool.openness.dimensions).map(([dimension, data]) => {
                    const getScoreColor = (score: string) => {
                      switch (score) {
                        case 'green': return 'bg-green-500';
                        case 'yellow': return 'bg-yellow-500';
                        case 'red': return 'bg-red-500';
                        default: return 'bg-gray-300';
                      }
                    };

                    const getScoreBg = (score: string) => {
                      switch (score) {
                        case 'green': return 'bg-green-50 border-green-200';
                        case 'yellow': return 'bg-yellow-50 border-yellow-200';
                        case 'red': return 'bg-red-50 border-red-200';
                        default: return 'bg-gray-50 border-gray-200';
                      }
                    };

                    return (
                      <div key={dimension} className={`border rounded-lg p-4 ${getScoreBg(data.score)}`}>
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-4 h-4 rounded-full ${getScoreColor(data.score)}`}></div>
                          <h5 className="font-medium text-gray-900">{dimension}</h5>
                        </div>
                        <p className="text-sm text-gray-600 ml-7">{data.note}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="font-medium text-blue-800 mb-2">About Our Assessment Framework</h5>
                  <p className="text-sm text-blue-700">
                    We evaluate tools across six dimensions of openness to help you understand 
                    licensing, technical accessibility, and community governance before embedding 
                    tools in your projects.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
