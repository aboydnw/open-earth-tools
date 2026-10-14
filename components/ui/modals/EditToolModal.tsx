"use client";

import React, { useState, useEffect } from 'react';
import { Tool, OpennessAssessment } from '@/types';
import { useApiRequest } from '@/components/ui/forms/useApiRequest';

interface EditToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: Tool;
  categories: string[];
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

export function EditToolModal({ isOpen, onClose, tool, categories }: EditToolModalProps) {
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
  
  const { loading, error, setError, send } = useApiRequest(onClose);
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

      await send(`/api/admin/tools/${tool.id}`, 'PUT', formData);
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
    <div className="modal-backdrop">
      <div className="modal-sheet max-w-4xl">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-wide text-2xl font-[520] tracking-[-0.02em]">Edit Tool</h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-11 w-11 items-center justify-center border border-ink text-ink transition-colors hover:bg-ink hover:text-sheet"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="notice-error mb-4">
                <div className="flex">
                  <div>
                    <h4 className="font-semibold">Error</h4>
                    <p className="mt-1 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-4">
                <h3 className="border-b border-ink pb-2 font-mono text-xs font-medium uppercase tracking-[.1em] text-graphite">Basic Information</h3>
                
                {/* Tool Name */}
                <div>
                  <label htmlFor="name" className="field-label">
                    Tool Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="field"
                    required
                  />
                </div>

                {/* Tool URL */}
                <div>
                  <label htmlFor="url" className="field-label">
                    Tool URL *
                  </label>
                  <input
                    type="url"
                    id="url"
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    className="field"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="field-label">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="field"
                    required
                  />
                </div>

                {/* Organization */}
                <div>
                  <label htmlFor="organization" className="field-label">
                    Organization
                  </label>
                  <input
                    type="text"
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                    className="field"
                  />
                </div>

                {/* License */}
                <div>
                  <label htmlFor="license" className="field-label">
                    License
                  </label>
                  <select
                    id="license"
                    value={formData.license}
                    onChange={(e) => setFormData(prev => ({ ...prev, license: e.target.value }))}
                    className="field"
                  >
                    {withCurrent(LICENSES, formData.license).map(license => (
                      <option key={license} value={license}>{license}</option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="field-label">
                    Category
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="field"
                  >
                    {withCurrent(categories, formData.category).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Right Column - Additional Details */}
              <div className="space-y-4">
                <h3 className="border-b border-ink pb-2 font-mono text-xs font-medium uppercase tracking-[.1em] text-graphite">Additional Details</h3>

                {/* Embed URL */}
                <div>
                  <label htmlFor="embedUrl" className="field-label">
                    Embed URL
                  </label>
                  <input
                    type="url"
                    id="embedUrl"
                    value={formData.embedUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, embedUrl: e.target.value }))}
                    className="field"
                  />
                </div>

                {/* Icon */}
                <div>
                  <label className="field-label">
                    Icon
                  </label>
                  <div className="grid grid-cols-10 gap-2">
                    {ICONS.map(icon => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, icon }))}
                        className={`p-2 text-lg border transition-colors ${
                          formData.icon === icon
                            ? 'border-ink bg-paper'
                            : 'border-rule hover:border-ink'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label htmlFor="status" className="field-label">
                    Status
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="field"
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
                      className="h-4 w-4 accent-[#B4532A]"
                    />
                    <span className="ml-2 text-sm text-slate">Embedding Supported</span>
                  </label>
                </div>

                {/* Embed Note */}
                <div>
                  <label htmlFor="embedNote" className="field-label">
                    Embed Note
                  </label>
                  <textarea
                    id="embedNote"
                    rows={2}
                    value={formData.embedNote}
                    onChange={(e) => setFormData(prev => ({ ...prev, embedNote: e.target.value }))}
                    className="field"
                  />
                </div>

                {/* Features */}
                <div>
                  <label className="field-label">
                    Features
                  </label>
                  <div className="space-y-2 mb-3">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between border border-rule bg-paper px-3 py-2">
                        <span className="text-sm">{feature}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
                          className="text-sm text-[#9B2C1F] underline underline-offset-[3px]"
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
                      className="field flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="btn-secondary min-h-[44px] px-4"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Assessment Details Accordion */}
            <div className="mt-8 border-t border-ink pt-6">
              <button
                type="button"
                onClick={() => setShowAssessmentDetails(!showAssessmentDetails)}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="font-mono text-xs font-medium uppercase tracking-[.1em] text-graphite">Assessment Details</h3>
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
                      <label htmlFor="score" className="field-label">
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
                        className="field"
                      />
                    </div>
                    <div>
                      <label htmlFor="level" className="field-label">
                        Openness Level
                      </label>
                      <select
                        id="level"
                        value={formData.openness.level}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          openness: { ...prev.openness, level: e.target.value as OpennessAssessment['level'] }
                        }))}
                        className="field"
                      >
                        {OPENNESS_LEVELS.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Dimensions */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Assessment Dimensions</h4>
                    {Object.entries(formData.openness.dimensions).map(([dimensionName, dimension]) => (
                      <div key={dimensionName} className="border border-rule bg-paper p-4">
                        <h5 className="mb-3 font-semibold">{dimensionName}</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="field-label">
                              Score
                            </label>
                            <select
                              value={dimension.score}
                              onChange={(e) => handleDimensionChange(
                                dimensionName as keyof OpennessAssessment['dimensions'],
                                'score',
                                e.target.value
                              )}
                              className="field"
                            >
                              {DIMENSION_SCORES.map(score => (
                                <option key={score} value={score}>
                                  {score.charAt(0).toUpperCase() + score.slice(1)}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="md:col-span-2">
                            <label className="field-label">
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
                              className="field"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            {error && <p className="mr-auto text-sm text-[#7A2016]">{error}</p>}
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn-secondary min-h-[44px] px-[18px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary min-h-[44px] px-[18px]"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
