import React, { useState } from 'react';
import { Copy, Check, FileText } from 'lucide-react';

interface TranscriptionDisplayProps {
  transcription: string;
}

const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({ transcription }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transcription);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Transcription</h3>
            <p className="text-sm text-gray-600">AI-generated transcript</p>
          </div>
        </div>
        
        <button
          onClick={copyToClipboard}
          className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="bg-gray-50 rounded-xl p-4 max-h-96 overflow-y-auto">
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
            {transcription}
          </p>
        </div>
        
        {/* Word Count */}
        <div className="mt-4 text-xs text-gray-500">
          {transcription.split(' ').length} words · {transcription.length} characters
        </div>
      </div>
    </div>
  );
};

export default TranscriptionDisplay;