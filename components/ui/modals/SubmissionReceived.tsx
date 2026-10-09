import React from 'react';

interface SubmissionReceivedProps {
  message: string;
  prUrl: string | null;
  onClose: () => void;
}

/** Confirmation shown once a submission has been turned into a pull request. */
export function SubmissionReceived({ message, prUrl, onClose }: SubmissionReceivedProps) {
  return (
    <div className="p-6 text-center">
      <div className="text-4xl mb-4">✅</div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Submitted for review</h2>
      <p className="text-gray-600 text-sm mb-4">{message}</p>
      {prUrl && (
        <p className="mb-6">
          <a
            href={prUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ds-orange-600 hover:text-ds-orange-700 text-sm font-medium"
          >
            Follow the review on GitHub
          </a>
        </p>
      )}
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 bg-ds-orange-500 text-white rounded-md hover:bg-ds-orange-600 transition-colors"
      >
        Close
      </button>
    </div>
  );
}
