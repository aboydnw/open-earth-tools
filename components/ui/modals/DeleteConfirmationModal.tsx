"use client";

import React, { useState } from 'react';
import { Tool } from '@/types';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tool: Tool;
}

export function DeleteConfirmationModal({ isOpen, onClose, onConfirm, tool }: DeleteConfirmationModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (confirmText.toLowerCase() !== 'delete') {
      setError('Please type "delete" to confirm');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onConfirm();
      // Reset form and close modal
      setConfirmText('');
      onClose();
    } catch (err) {
      console.error('Failed to delete tool:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete tool');
    } finally {
      setLoading(false);
    }
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-red-600">Delete Tool</h2>
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Warning Message */}
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="text-red-400 mr-3 mt-0.5">⚠️</div>
                <div>
                  <h4 className="text-red-800 font-medium text-sm">Permanent Deletion</h4>
                  <p className="text-red-700 text-sm mt-1">
                    This action cannot be undone. This will permanently delete the tool and all associated data.
                  </p>
                </div>
              </div>
            </div>

            {/* Tool Info */}
            <div className="bg-gray-50 rounded-md p-4 mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Tool to delete:</h4>
              <div className="flex items-center">
                <span className="text-lg mr-2">{tool.icon}</span>
                <div>
                  <p className="font-medium text-gray-900">{tool.name}</p>
                  <p className="text-sm text-gray-600">{tool.organization}</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center">
                  <div className="text-red-400 mr-2">⚠️</div>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Confirmation Input */}
            <div className="mb-6">
              <label htmlFor="confirmText" className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="font-mono bg-gray-100 px-1 rounded">delete</span> to confirm:
              </label>
              <input
                type="text"
                id="confirmText"
                value={confirmText}
                onChange={(e) => {
                  setConfirmText(e.target.value);
                  if (error) setError(null); // Clear error when user starts typing
                }}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
                  error 
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                    : confirmText && isValidInput
                    ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                    : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
                }`}
                placeholder="Type 'delete' here"
                disabled={loading}
                autoComplete="off"
              />
              {confirmText && !isValidInput && !error && (
                <p className="text-yellow-600 text-sm mt-1">
                  Please type exactly "delete" to confirm
                </p>
              )}
              {confirmText && isValidInput && (
                <p className="text-green-600 text-sm mt-1">
                  ✓ Confirmation text matches
                </p>
              )}
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isValidInput}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
