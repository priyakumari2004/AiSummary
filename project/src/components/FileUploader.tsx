import React, { useState, useRef } from 'react';
import { Upload, FileVideo, FileAudio, FileText, AlertCircle } from 'lucide-react';
import { FileData } from '../App';

interface FileUploaderProps {
  onFileSelect: (fileData: FileData) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedTypes = {
    'video/mp4': 'video',
    'audio/mp3': 'audio',
    'audio/wav': 'audio',
    'audio/m4a': 'audio',
    'audio/mpeg': 'audio',
    'text/plain': 'text',
  } as const;

  const validateFile = (file: File): { isValid: boolean; type?: 'video' | 'audio' | 'text'; error?: string } => {
    if (!file) {
      return { isValid: false, error: 'No file selected' };
    }

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      return { isValid: false, error: 'File size must be less than 100MB' };
    }

    const fileType = supportedTypes[file.type as keyof typeof supportedTypes];
    if (!fileType) {
      return { 
        isValid: false, 
        error: 'Unsupported file type. Please upload MP4 video, audio files (MP3, WAV, M4A), or text files.' 
      };
    }

    return { isValid: true, type: fileType };
  };

  const handleFile = (file: File) => {
    const validation = validateFile(file);
    
    if (!validation.isValid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setError('');
    onFileSelect({
      file,
      type: validation.type!
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 cursor-pointer ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${error ? 'border-red-300 bg-red-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={false}
          accept=".mp4,.mp3,.wav,.m4a,.txt"
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="space-y-6">
          {/* Upload Icon */}
          <div className="flex justify-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              error ? 'bg-red-100' : dragActive ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              {error ? (
                <AlertCircle className={`w-8 h-8 text-red-500`} />
              ) : (
                <Upload className={`w-8 h-8 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
              )}
            </div>
          </div>

          {/* Upload Text */}
          <div>
            <h3 className={`text-xl font-semibold mb-2 ${error ? 'text-red-700' : 'text-gray-900'}`}>
              {error ? 'Upload Error' : dragActive ? 'Drop your file here' : 'Upload your meeting file'}
            </h3>
            <p className={`text-sm ${error ? 'text-red-600' : 'text-gray-600'}`}>
              {error ? error : 'Drag and drop your file here, or click to browse'}
            </p>
          </div>

          {/* Action Button */}
          {!error && (
            <button
              type="button"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              Choose File
            </button>
          )}
        </div>
      </div>

      {/* Supported Formats */}
      <div className="mt-8">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Supported file formats:</h4>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
            <FileVideo className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Video Files</p>
              <p className="text-xs text-gray-500">MP4 format</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
            <FileAudio className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Audio Files</p>
              <p className="text-xs text-gray-500">MP3, WAV, M4A</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
            <FileText className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Text Files</p>
              <p className="text-xs text-gray-500">TXT format</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;