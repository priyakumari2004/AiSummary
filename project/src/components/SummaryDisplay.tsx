import React, { useState } from 'react';
import { Download, Copy, Check, BookOpen } from 'lucide-react';

interface SummaryDisplayProps {
  summary: string;
  onDownload: () => void;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summary, onDownload }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Convert markdown-style summary to HTML for better display
  const formatSummary = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('##')) {
          return <h3 key={index} className="text-lg font-semibold text-gray-900 mt-6 mb-3">{line.replace('##', '').trim()}</h3>;
        }
        if (line.startsWith('###')) {
          return <h4 key={index} className="text-base font-medium text-gray-800 mt-4 mb-2">{line.replace('###', '').trim()}</h4>;
        }
        
        // Bold text
        if (line.includes('**')) {
          const parts = line.split('**');
          return (
            <p key={index} className="text-sm text-gray-700 mb-2">
              {parts.map((part, i) => 
                i % 2 === 1 ? <strong key={i}>{part}</strong> : part
              )}
            </p>
          );
        }
        
        // List items
        if (line.trim().startsWith('-')) {
          return <li key={index} className="text-sm text-gray-700 ml-4 mb-1">{line.replace('-', '').trim()}</li>;
        }
        
        // Numbers (for numbered items)
        if (line.match(/^\d+\./)) {
          return <li key={index} className="text-sm text-gray-700 ml-4 mb-1 list-decimal">{line.replace(/^\d+\./, '').trim()}</li>;
        }
        
        // Regular paragraphs
        if (line.trim()) {
          return <p key={index} className="text-sm text-gray-700 mb-2">{line}</p>;
        }
        
        // Empty lines for spacing
        return <div key={index} className="h-2"></div>;
      });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Meeting Summary</h3>
            <p className="text-sm text-gray-600">AI-generated summary</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
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
          
          <button
            onClick={onDownload}
            className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="bg-gray-50 rounded-xl p-6 max-h-96 overflow-y-auto">
          <div className="prose prose-sm max-w-none">
            {formatSummary(summary)}
          </div>
        </div>
        
        {/* Summary Stats */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <span>{summary.split(' ').length} words · {summary.length} characters</span>
          <span>Generated with GPT-4o</span>
        </div>
      </div>
    </div>
  );
};

export default SummaryDisplay;