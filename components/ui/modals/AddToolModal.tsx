"use client";

import React, { useCallback, useState } from 'react';
import { DATA_TYPE_OPTIONS, FUNCTIONALITY_OPTIONS } from '@/lib/constants';
import { TurnstileWidget } from '@/components/ui/forms/TurnstileWidget';
import { useApiRequest } from '@/components/ui/forms/useApiRequest';

interface AddToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  /**
   * Turnstile site key. When set, the form is the public "suggest a tool" form,
   * which sends the tool for review instead of adding it.
   */
  turnstileSiteKey?: string;
}

interface FormData {
  name: string;
  url: string;
  description: string;
  dataTypes: string[];
  functionality: string[];
}

export function AddToolModal({ isOpen, onClose, turnstileSiteKey }: AddToolModalProps) {
  const isSuggestion = Boolean(turnstileSiteKey);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    url: '',
    description: '',
    dataTypes: [],
    functionality: []
  });
  const [submitted, setSubmitted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const onDone = useCallback(() => (isSuggestion ? setSubmitted(true) : onClose()), [isSuggestion, onClose]);
  const { loading, error, setError, send } = useApiRequest(onDone);

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

      const fields = {
        name: formData.name.trim(),
        url: formData.url.trim(),
        description: formData.description.trim(),
        dataTypes: formData.dataTypes,
        functionality: formData.functionality,
      };
      if (!isSuggestion) {
        await send('/api/admin/tools', 'POST', fields);
        return;
      }
      if (!token) {
        throw new Error('Please complete the verification check');
      }
      if (!(await send('/api/suggestions', 'POST', { ...fields, turnstileToken: token }))) {
        setToken(null);
        setResetKey(key => key + 1);
      }
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
    <div className="modal-backdrop">
      <div className="modal-sheet max-w-2xl">
        {submitted ? (
          <div className="p-6 text-center">
            <h2 className="font-wide mb-2 text-2xl font-[520] tracking-[-0.02em]">Thanks for the suggestion</h2>
            <p className="mb-6 text-sm text-slate">
              The tool will appear in the directory once it has been reviewed.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="btn-primary min-h-[44px] px-[18px]"
            >
              Close
            </button>
          </div>
        ) : (
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-wide text-2xl font-[520] tracking-[-0.02em]">{isSuggestion ? 'Suggest a Tool' : 'Add New Tool'}</h2>
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

            <div className="space-y-6">
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
                  placeholder="e.g., Climate Data Explorer"
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
                  placeholder="https://example.com/tool"
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
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="field"
                  placeholder="Brief description of what this tool does and who it's for..."
                  required
                />
              </div>

              {/* Data Types */}
              <div>
                <label className="field-label">
                  Data Types * (select all that apply)
                </label>
                <div className="grid max-h-40 grid-cols-2 gap-2 overflow-y-auto border border-rule bg-paper p-3 sm:grid-cols-3">
                  {DATA_TYPE_OPTIONS.map((dataType) => (
                    <label key={dataType} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.dataTypes.includes(dataType)}
                        onChange={() => handleDataTypeToggle(dataType)}
                        className="h-4 w-4 accent-[#B4532A]"
                      />
                      <span className="capitalize">{dataType}</span>
                    </label>
                  ))}
                </div>
                {formData.dataTypes.length > 0 && (
                  <p className="mt-2 text-sm text-slate">
                    Selected: {formData.dataTypes.join(', ')}
                  </p>
                )}
              </div>

              {/* Functionality */}
              <div>
                <label className="field-label">
                  Functionality * (select all that apply)
                </label>
                <div className="grid max-h-32 grid-cols-2 gap-2 overflow-y-auto border border-rule bg-paper p-3 sm:grid-cols-3">
                  {FUNCTIONALITY_OPTIONS.map((func) => (
                    <label key={func} className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.functionality.includes(func)}
                        onChange={() => handleFunctionalityToggle(func)}
                        className="h-4 w-4 accent-[#B4532A]"
                      />
                      <span className="capitalize">{func}</span>
                    </label>
                  ))}
                </div>
                {formData.functionality.length > 0 && (
                  <p className="mt-2 text-sm text-slate">
                    Selected: {formData.functionality.join(', ')}
                  </p>
                )}
              </div>

              {/* Info box about automation */}
              <div className="notice">
                <div className="flex items-start">
                  <div>
                    <h4 className="font-semibold text-ink">Automated Assessment</h4>
                    <p className="mt-1">
                      The remaining fields (organization, category, license, openness score, etc.) will be automatically determined based on the tool URL and your selections.{isSuggestion ? ' Every suggestion is reviewed before it appears in the directory.' : ' You can adjust them afterwards with Edit.'}
                    </p>
                  </div>
                </div>
              </div>

              {turnstileSiteKey && (
                <TurnstileWidget siteKey={turnstileSiteKey} onToken={setToken} resetKey={resetKey} />
              )}
            </div>
          </div>

          <div className="modal-footer">
            {error && <p className="mr-auto text-sm text-[#7A2016]">{error}</p>}
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary min-h-[44px] px-[18px]"
              disabled={loading}
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
              {isSuggestion ? (loading ? 'Sending...' : 'Send Suggestion') : (loading ? 'Adding...' : 'Add Tool')}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}
