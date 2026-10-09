"use client";

import React, { useState, useEffect } from 'react';
import { Tool, OpennessAssessment } from '@/types';
import { TurnstileWidget } from '@/components/ui/forms/TurnstileWidget';
import { useSubmission } from '@/components/ui/forms/useSubmission';
import { SubmissionReceived } from './SubmissionReceived';

interface EditToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: Tool;
  categories: string[];
  siteKey: string;
}

interface EditFormData {
  name: string;
  url: string;
  description: string;
  organization: string;
  license: string;
  category: string;
  embedUrl: string;
  features: string[];
  icon: string;
  status: string;
  embedSupported: boolean;
  embedNote: string;
  openness: OpennessAssessment;
}

const LICENSES = [
  'MIT',
  'Apache 2.0',
  'BSD',
  'GPL',
  'Public Domain',
  'CC BY 4.0',
  'Not Specified'
];

const STATUS_OPTIONS = [
  'Production',
  'Beta',
  'Alpha',
  'Development',
  'Deprecated'
];

const ICONS = [
  '🌍', '🌡️', '🌊', '🛰️', '🔥', '🌾', '🌱', '📊', '⚡', '🌀',
  '🏔️', '🌋', '❄️', '☀️', '🌙', '⭐', '🌈', '⚖️', '🔬', '📈'
];

const OPENNESS_LEVELS: OpennessAssessment['level'][] = [
  'Fully Open',
  'Mostly Open', 
  'Partially Open',
  'Minimally Open'
];

const DIMENSION_SCORES: Array<'green' | 'yellow' | 'red'> = ['green', 'yellow', 'red'];

function withCurrent(options: string[], current: string): string[] {
  return current && !options.includes(current) ? [...options, current] : options;
}

export function EditToolModal({ isOpen, onClose, tool, categories, siteKey }: EditToolModalProps) {
  const [formData, setFormData] = useState<EditFormData>({
    name: '',
    url: '',
    description: '',
    organization: '',
    license: '',
    category: '',
    embedUrl: '',
    features: [],
    icon: '🌍',
    status: 'Production',
    embedSupported: false,
    embedNote: '',
    openness: {
      score: 0,
      level: 'Minimally Open',
      dimensions: {
        'Software Licensing': { score: 'red', note: '' },
        'Data Licensing': { score: 'red', note: '' },
        'Technical Accessibility': { score: 'red', note: '' },
        'Data Standards': { score: 'red', note: '' },
        'Infrastructure': { score: 'red', note: '' },
        'Community Governance': { score: 'red', note: '' }
      }
    }
  });
  
  const { loading, error, submitted, prUrl, setToken, setError, resetKey, submit } = useSubmission();
  const [showAssessmentDetails, setShowAssessmentDetails] = useState(false);
  const [newFeature, setNewFeature] = useState('');

  // Initialize form data when tool prop changes
  useEffect(() => {
    if (tool) {
      setFormData({
        name: tool.name,
        url: tool.url,
        description: tool.description,
        organization: tool.organization,
        license: tool.license,
        category: tool.category,
        embedUrl: tool.embedUrl,
        features: [...tool.features],
        icon: tool.icon,
        status: tool.status,
        embedSupported: tool.embedSupported,
        embedNote: tool.embedNote || '',
        openness: {
          score: tool.openness.score,
          level: tool.openness.level,
          dimensions: JSON.parse(JSON.stringify(tool.openness.dimensions))
        }
      });
    }
  }, [tool]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Basic validation
      if (!formData.name.trim()) {
        throw new Error('Tool name is required');
      }
      if (!formData.url.trim()) {
        throw new Error('Tool URL is required');
      }
      if (!formData.description.trim()) {
        throw new Error('Description is required');
      }

      // URL validation
      try {
        new URL(formData.url);
        new URL(formData.embedUrl);
      } catch {
        throw new Error('Please enter valid URLs');
      }

      await submit(`/api/tools/${tool.id}`, 'PUT', formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleDimensionChange = (
    dimensionName: keyof OpennessAssessment['dimensions'],
    field: 'score' | 'note',
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      openness: {
        ...prev.openness,
        dimensions: {
          ...prev.openness.dimensions,
          [dimensionName]: {
            ...prev.openness.dimensions[dimensionName],
            [field]: value
          }
        }
      }
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {submitted ? (
          <SubmissionReceived
            message="Thanks for the correction. The change will appear in the directory once it has been reviewed."
            prUrl={prUrl}
            onClose={onClose}
          />
        ) : (
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Edit Tool</h2>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <div className="text-red-400 mr-3">⚠️</div>
                  <div>
                    <h4 className="text-red-800 font-medium">Error</h4>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h3>
                
                {/* Tool Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Tool Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ds-orange-500 focus:border-ds-orange-500"
                    required
                  />
                </div>

                {/* Tool URL */}
                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                    Tool URL *
                  </label>
                  <input
                    type="url"
                    id="url"
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ds-orange-500 focus:border-ds-orange-500"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ds-orange-500 focus:border-ds-orange-500"
                    required
                  />
                </div>

                {/* Organization */}
                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
                    Organization
                  </label>
                  <input
                    type="text"
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ds-orange-500 focus:border-ds-orange-500"
                  />
                </div>

                {/* License */}
                <div>
                  <label htmlFor="license" className="block text-sm font-medium text-gray-700 mb-1">
                    License
                  </label>
                  <select
                    id="license"
                    value={formData.license}
                    onChange={(e) => setFormData(prev => ({ ...prev, license: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ds-orange-500 focus:border-ds-orange-500"
                  >
                    {withCurrent(LICENSES, formData.license).map(license => (
                      <option key={license} value={license}>{license}</option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ds-orange-500 focus:border-ds-orange-500"
                  >
                    {withCurrent(categories, formData.category).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Right Column - Additional Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Additional Details</h3>

                {/* Embed URL */}
                <div>
                  <label htmlFor="embedUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Embed URL
                  </label>
                  <input
                    type="url"
                    id="embedUrl"
                    value={formData.embedUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, embedUrl: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ds-orange-500 focus:border-ds-orange-500"
                  />
                </div>

                {/* Icon */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon
                  </label>
                  <div className="grid grid-cols-10 gap-2">
                    {ICONS.map(icon => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, icon }))}
                        className={`p-2 text-lg rounded border-2 transition-colors ${
                          formData.icon === icon
                            ? 'border-ds-orange-500 bg-ds-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ds-orange-500 focus:border-ds-orange-500"
                  >
                    {withCurrent(STATUS_OPTIONS, formData.status).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                {/* Embed Support */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.embedSupported}
                      onChange={(e) => setFormData(prev => ({ ...prev, embedSupported: e.target.checked }))}
                      className="rounded border-gray-300 text-ds-orange-500 focus:ring-ds-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Embedding Supported</span>
                  </label>
                </div>

                {/* Embed Note */}
                <div>
                  <label htmlFor="embedNote" className="block text-sm font-medium text-gray-700 mb-1">
                    Embed Note
                  </label>
                  <textarea
                    id="embedNote"
                    rows={2}
                    value={formData.embedNote}
                    onChange={(e) => setFormData(prev => ({ ...prev, embedNote: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ds-orange-500 focus:border-ds-orange-500"
                  />
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features
                  </label>
                  <div className="space-y-2 mb-3">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                        <span className="text-sm">{feature}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add new feature"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ds-orange-500 focus:border-ds-orange-500"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Assessment Details Accordion */}
            <div className="mt-8 border-t pt-6">
              <button
                type="button"
                onClick={() => setShowAssessmentDetails(!showAssessmentDetails)}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-lg font-medium text-gray-900">Assessment Details</h3>
                <svg 
                  className={`w-5 h-5 transition-transform ${showAssessmentDetails ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showAssessmentDetails && (
                <div className="mt-4 space-y-6">
                  {/* Overall Score and Level */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="score" className="block text-sm font-medium text-gray-700 mb-1">
                        Overall Score (0-6)
                      </label>
                      <input
                        type="number"
                        id="score"
                        min="0"
                        max="6"
                        value={formData.openness.score}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          openness: { ...prev.openness, score: parseInt(e.target.value) || 0 }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ds-orange-500 focus:border-ds-orange-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                        Openness Level
                      </label>
                      <select
                        id="level"
                        value={formData.openness.level}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          openness: { ...prev.openness, level: e.target.value as OpennessAssessment['level'] }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ds-orange-500 focus:border-ds-orange-500"
                      >
                        {OPENNESS_LEVELS.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Dimensions */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Assessment Dimensions</h4>
                    {Object.entries(formData.openness.dimensions).map(([dimensionName, dimension]) => (
                      <div key={dimensionName} className="border rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-3">{dimensionName}</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Score
                            </label>
                            <select
                              value={dimension.score}
                              onChange={(e) => handleDimensionChange(
                                dimensionName as keyof OpennessAssessment['dimensions'],
                                'score',
                                e.target.value
                              )}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ds-orange-500 focus:border-ds-orange-500"
                            >
                              {DIMENSION_SCORES.map(score => (
                                <option key={score} value={score}>
                                  {score.charAt(0).toUpperCase() + score.slice(1)}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Note
                            </label>
                            <input
                              type="text"
                              value={dimension.note}
                              onChange={(e) => handleDimensionChange(
                                dimensionName as keyof OpennessAssessment['dimensions'],
                                'note',
                                e.target.value
                              )}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ds-orange-500 focus:border-ds-orange-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              <TurnstileWidget siteKey={siteKey} onToken={setToken} resetKey={resetKey} />
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end space-x-3">
            {error && <p className="text-red-600 text-sm mr-auto">{error}</p>}
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-ds-orange-500 text-white rounded-md hover:bg-ds-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Submitting...' : 'Submit for Review'}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}
