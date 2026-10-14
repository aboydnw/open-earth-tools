"use client";

import React, { useState } from 'react';
import { Tool } from '@/types';
import { useApiRequest } from '@/components/ui/forms/useApiRequest';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: Tool;
}

export function DeleteConfirmationModal({ isOpen, onClose, tool }: DeleteConfirmationModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const { loading, error, setError, send } = useApiRequest(onClose);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (confirmText.toLowerCase() !== 'delete') {
      setError('Please type "delete" to confirm');
      return;
    }

    await send(`/api/admin/tools/${tool.id}`, 'DELETE');
  };

  const handleClose = () => {
    if (!loading) {
      setConfirmText('');
      setError(null);
      onClose();
    }
  };

  const isValidInput = confirmText.toLowerCase() === 'delete';

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-sheet max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-wide text-2xl font-[520] tracking-[-0.02em] text-[#9B2C1F]">Delete Tool</h2>
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex h-11 w-11 items-center justify-center border border-ink text-ink transition-colors hover:bg-ink hover:text-sheet disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Warning Message */}
            <div className="notice-error mb-6">
              <div className="flex">
                <div>
                  <h4 className="font-semibold">Permanent Deletion</h4>
                  <p className="mt-1">
                    The tool disappears from the directory immediately. The nightly backup in the repository still has the last saved copy.
                  </p>
                </div>
              </div>
            </div>

            {/* Tool Info */}
            <div className="notice mb-6">
              <h4 className="marginalia mb-2">Tool to delete:</h4>
              <div className="flex items-center">
                <div>
                  <p className="font-semibold">{tool.name}</p>
                  <p className="font-mono text-xs text-graphite">{tool.organization}</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="notice-error mb-4 p-3">
                <div className="flex items-center">
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Confirmation Input */}
            <div className="mb-6">
              <label htmlFor="confirmText" className="field-label">
                Type <span className="bg-paper px-1 font-mono normal-case">delete</span> to confirm:
              </label>
              <input
                type="text"
                id="confirmText"
                value={confirmText}
                onChange={(e) => {
                  setConfirmText(e.target.value);
                  if (error) setError(null); // Clear error when user starts typing
                }}
                className={`field transition-colors ${
                  error 
                    ? 'border-[#9B2C1F]' 
                    : confirmText && isValidInput
                    ? 'border-deep'
                    : ''
                }`}
                placeholder="Type 'delete' here"
                disabled={loading}
                autoComplete="off"
              />
              {confirmText && !isValidInput && !error && (
                <p className="mt-1 text-sm text-slate">
                  Please type exactly "delete" to confirm
                </p>
              )}
              {confirmText && isValidInput && (
                <p className="mt-1 text-sm text-deep">
                  Confirmation text matches
                </p>
              )}
            </div>

          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="btn-secondary min-h-[44px] px-[18px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isValidInput}
              className="btn-danger"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Deleting...' : 'Delete Tool'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
