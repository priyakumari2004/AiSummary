import React from 'react';
import { Loader2, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { ProcessingStep } from '../App';

interface ProcessingStatusProps {
  steps: ProcessingStep[];
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ steps }) => {
  const getStepIcon = (status: ProcessingStep['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-gray-400" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStepColor = (status: ProcessingStep['status']) => {
    switch (status) {
      case 'pending':
        return 'text-gray-500';
      case 'processing':
        return 'text-blue-600 font-medium';
      case 'completed':
        return 'text-green-600 font-medium';
      case 'error':
        return 'text-red-600 font-medium';
    }
  };

  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Processing Status</h3>
          <span className="text-sm text-gray-600">
            {completedSteps} of {steps.length} completed
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Processing Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center space-x-4">
            {/* Step Number/Icon */}
            <div className="flex-shrink-0">
              {getStepIcon(step.status)}
            </div>

            {/* Step Content */}
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${getStepColor(step.status)}`}>
                {step.label}
              </p>
              
              {step.status === 'processing' && (
                <div className="mt-1">
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div className="bg-blue-500 h-1 rounded-full animate-pulse w-2/3"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Status Badge */}
            <div className="flex-shrink-0">
              {step.status === 'completed' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Done
                </span>
              )}
              {step.status === 'processing' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Processing
                </span>
              )}
              {step.status === 'error' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Error
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Overall Status Message */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        {completedSteps === steps.length ? (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Processing completed successfully!</span>
          </div>
        ) : steps.some(step => step.status === 'error') ? (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Processing encountered an error</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Processing your meeting file...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessingStatus;