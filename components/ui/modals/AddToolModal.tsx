"use client";

import React, { useState } from 'react';
import { DATA_TYPE_OPTIONS, FUNCTIONALITY_OPTIONS } from '@/lib/constants';
import { useAdminRequest } from '@/components/ui/forms/useAdminRequest';

interface AddToolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  url: string;
  description: string;
  dataTypes: string[];
  functionality: string[];
}

export function AddToolModal({ isOpen, onClose }: AddToolModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    url: '',
    description: '',
    dataTypes: [],
    functionality: []
  });
  const { loading, error, setError, send } = useAdminRequest(onClose);

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
      if (formData.dataTypes.length === 0) {
        throw new Error('Please select at least one data type');
      }
      if (formData.functionality.length === 0) {
        throw new Error('Please select at least one functionality');
      }

      // URL validation
      try {
        new URL(formData.url);
      } catch {
        throw new Error('Please enter a valid URL');
      }

      await send('/api/admin/tools', 'POST', {
        name: formData.name.trim(),
        url: formData.url.trim(),
        description: formData.description.trim(),
        dataTypes: formData.dataTypes,
        functionality: formData.functionality,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDataTypeToggle = (dataType: string) => {
    setFormData(prev => ({
      ...prev,
      dataTypes: prev.dataTypes.includes(dataType)
        ? prev.dataTypes.filter(dt => dt !== dataType)
        : [...prev.dataTypes, dataType]
    }));
  };

  const handleFunctionalityToggle = (func: string) => {
    setFormData(prev => ({
      ...prev,
      functionality: prev.functionality.includes(func)
        ? prev.functionality.filter(f => f !== func)
        : [...prev.functionality, func]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Add New Tool</h2>
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

            <div className="space-y-6">
              {/* Tool Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Tool Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ds-orange-500 focus:border-ds-orange-500"
                  placeholder="e.g., Climate Data Explorer"
                  required
                />
              </div>

              {/* Tool URL */}
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                  Tool URL *
                </label>
                <input
                  type="url"
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ds-orange-500 focus:border-ds-orange-500"
                  placeholder="https://example.com/tool"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ds-orange-500 focus:border-ds-orange-500"
                  placeholder="Brief description of what this tool does and who it's for..."
                  required
                />
              </div>

              {/* Data Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Types * (select all that apply)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3">
                  {DATA_TYPE_OPTIONS.map((dataType) => (
                    <label key={dataType} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.dataTypes.includes(dataType)}
                        onChange={() => handleDataTypeToggle(dataType)}
                        className="rounded border-gray-300 text-ds-orange-500 focus:ring-ds-orange-500"
                      />
                      <span className="capitalize">{dataType}</span>
                    </label>
                  ))}
                </div>
                {formData.dataTypes.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    Selected: {formData.dataTypes.join(', ')}
                  </p>
                )}
              </div>

              {/* Functionality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Functionality * (select all that apply)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-3">
                  {FUNCTIONALITY_OPTIONS.map((func) => (
                    <label key={func} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.functionality.includes(func)}
                        onChange={() => handleFunctionalityToggle(func)}
                        className="rounded border-gray-300 text-ds-orange-500 focus:ring-ds-orange-500"
                      />
                      <span className="capitalize">{func}</span>
                    </label>
                  ))}
                </div>
                {formData.functionality.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    Selected: {formData.functionality.join(', ')}
                  </p>
                )}
              </div>

              {/* Info box about automation */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex items-start">
                  <div className="text-blue-400 mr-3 mt-0.5">ℹ️</div>
                  <div>
                    <h4 className="text-blue-800 font-medium text-sm">Automated Assessment</h4>
                    <p className="text-blue-700 text-sm mt-1">
                      The remaining fields (organization, category, license, openness score, etc.) will be automatically determined based on the tool URL and your selections. You can adjust them afterwards with Edit.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end space-x-3">
            {error && <p className="text-red-600 text-sm mr-auto">{error}</p>}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              disabled={loading}
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
              {loading ? 'Adding...' : 'Add Tool'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
