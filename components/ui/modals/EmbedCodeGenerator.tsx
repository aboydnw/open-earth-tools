import { useState } from 'react'

interface EmbedCodeGeneratorProps {
  tool: {
    name: string
    embedUrl: string
    embedSupported: boolean
  }
  isOpen: boolean
  onClose: () => void
}

interface EmbedOptions {
  width: string
  height: string
  responsive: boolean
  showTitle: boolean
  customAttributes: string
}

export function EmbedCodeGenerator({ tool, isOpen, onClose }: EmbedCodeGeneratorProps) {
  const [options, setOptions] = useState<EmbedOptions>({
    width: '100%',
    height: '500',
    responsive: true,
    showTitle: true,
    customAttributes: ''
  })

  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const generateEmbedCode = () => {
    const widthAttr = options.responsive ? '100%' : options.width
    const heightAttr = options.height
    
    let iframeAttributes = [
      `src="${tool.embedUrl}"`,
      `width="${widthAttr}"`,
      `height="${heightAttr}"`,
      'frameborder="0"',
      'sandbox="allow-scripts allow-forms allow-popups allow-same-origin allow-top-navigation-by-user-activation"',
      'allow="camera \'none\'; microphone \'none\'; geolocation \'none\'; payment \'none\'"',
      'referrerpolicy="strict-origin-when-cross-origin"',
      'loading="lazy"'
    ]

    if (options.showTitle) {
      iframeAttributes.push(`title="${tool.name}"`)
    }

    if (options.customAttributes.trim()) {
      iframeAttributes.push(options.customAttributes.trim())
    }

    let embedCode = `<iframe ${iframeAttributes.join(' ')}></iframe>`

    if (options.responsive) {
      embedCode = `<!-- Responsive wrapper for ${tool.name} -->
<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe 
    ${iframeAttributes.join('\n    ')}
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
  </iframe>
</div>`
    }

    return embedCode
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateEmbedCode())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = generateEmbedCode()
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!tool.embedSupported) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Embedding Not Supported</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <p className="text-gray-600 mb-4">
                {tool.name} does not support iframe embedding due to security restrictions or technical limitations.
              </p>
              <a
                href={tool.embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-ds-orange-500 text-white rounded hover:bg-ds-orange-600 transition-colors"
              >
                Open Tool Directly
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Embed Code Generator</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Options Panel */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Embedding Options</h4>
                
                <div className="space-y-4">
                  {/* Responsive Toggle */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={options.responsive}
                        onChange={(e) => setOptions(prev => ({ ...prev, responsive: e.target.checked }))}
                        className="h-4 w-4 text-ds-orange-600 focus:ring-ds-orange-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Responsive (recommended)</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Automatically adjusts size for different screen sizes
                    </p>
                  </div>

                  {/* Width */}
                  {!options.responsive && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
                      <input
                        type="text"
                        value={options.width}
                        onChange={(e) => setOptions(prev => ({ ...prev, width: e.target.value }))}
                        placeholder="800px or 100%"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-ds-orange-500 focus:border-ds-orange-500"
                      />
                    </div>
                  )}

                  {/* Height */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                    <input
                      type="text"
                      value={options.height}
                      onChange={(e) => setOptions(prev => ({ ...prev, height: e.target.value }))}
                      placeholder="500px"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-ds-orange-500 focus:border-ds-orange-500"
                    />
                  </div>

                  {/* Show Title */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={options.showTitle}
                        onChange={(e) => setOptions(prev => ({ ...prev, showTitle: e.target.checked }))}
                        className="h-4 w-4 text-ds-orange-600 focus:ring-ds-orange-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Include title attribute</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Improves accessibility and SEO
                    </p>
                  </div>

                  {/* Custom Attributes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Custom Attributes</label>
                    <textarea
                      value={options.customAttributes}
                      onChange={(e) => setOptions(prev => ({ ...prev, customAttributes: e.target.value }))}
                      placeholder='id="my-tool" class="custom-iframe"'
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-ds-orange-500 focus:border-ds-orange-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Additional HTML attributes for the iframe
                    </p>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="text-sm font-medium text-blue-800 mb-2">🔒 Security Features</h5>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Sandbox attributes prevent malicious actions</li>
                    <li>• Restricted permissions for camera, microphone, etc.</li>
                    <li>• Secure referrer policy</li>
                    <li>• Lazy loading for better performance</li>
                  </ul>
                </div>
              </div>

              {/* Code Output */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-gray-900">Generated Code</h4>
                  <button
                    onClick={copyToClipboard}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      copied 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-ds-orange-100 text-ds-orange-800 hover:bg-ds-orange-200'
                    }`}
                  >
                    {copied ? '✓ Copied!' : 'Copy Code'}
                  </button>
                </div>
                
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-auto max-h-64 font-mono">
                  <code>{generateEmbedCode()}</code>
                </pre>

                {/* Usage Instructions */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">📋 Usage Instructions</h5>
                  <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                    <li>Copy the generated code above</li>
                    <li>Paste it into your HTML document where you want the tool to appear</li>
                    <li>The tool will load automatically when the page is visited</li>
                    <li>Test the embed on different screen sizes if using responsive mode</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}