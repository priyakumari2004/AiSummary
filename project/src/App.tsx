import React, { useState } from 'react';
import { Upload, FileVideo, FileAudio, FileText, Download, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import FileUploader from './components/FileUploader';
import ProcessingStatus from './components/ProcessingStatus';
import TranscriptionDisplay from './components/TranscriptionDisplay';
import SummaryDisplay from './components/SummaryDisplay';

export interface ProcessingStep {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

export interface FileData {
  file: File;
  type: 'video' | 'audio' | 'text';
}

function App() {
  const [uploadedFile, setUploadedFile] = useState<FileData | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const initializeProcessing = (fileData: FileData) => {
    setUploadedFile(fileData);
    setTranscription('');
    setSummary('');
    
    const steps: ProcessingStep[] = [];
    
    if (fileData.type === 'video') {
      steps.push({ id: 'extract', label: 'Extracting audio from video', status: 'pending' });
    }
    
    if (fileData.type !== 'text') {
      steps.push({ id: 'transcribe', label: 'Transcribing audio with Whisper', status: 'pending' });
    }
    
    steps.push({ id: 'summarize', label: 'Generating summary with GPT-4o', status: 'pending' });
    
    setProcessingSteps(steps);
    startProcessing(fileData, steps);
  };

  const startProcessing = async (fileData: FileData, steps: ProcessingStep[]) => {
  setIsProcessing(true);

  try {
    let audioFile: File | null = null;
    let transcriptionText = '';

    for (const step of steps) {
      // Update step status to 'processing'
      setProcessingSteps(prev =>
        prev.map(s =>
          s.id === step.id ? { ...s, status: 'processing' } : s
        )
      );

      if (step.id === 'extract' && fileData.type === 'video') {
        // Extract audio by uploading video to backend
        const formData = new FormData();
        formData.append('video', fileData.file);

        const res = await fetch('http://localhost:5000/extract-audio', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Audio extraction failed');
        
        // Backend should ideally return audio as file blob or URL.
        // Here, let's assume it returns a URL to the audio file:
        const { audioUrl } = await res.json();

        // Fetch audio file as blob and convert to File
        const audioBlob = await fetch(audioUrl).then(r => r.blob());
        audioFile = new File([audioBlob], 'extracted-audio.mp3', { type: 'audio/mpeg' });

      } else if (step.id === 'transcribe' && fileData.type !== 'text') {
        // Transcribe audio or video (for video, we have audioFile)
        const formData = new FormData();

        if (fileData.type === 'video') {
          if (!audioFile) throw new Error('No extracted audio for transcription');
          formData.append('audio', audioFile);
        } else if (fileData.type === 'audio') {
          formData.append('audio', fileData.file);
        }

        const res = await fetch('http://localhost:5000/transcribe', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Transcription failed');

        const { transcription } = await res.json();
        transcriptionText = transcription;
        setTranscription(transcriptionText);

      } else if (step.id === 'summarize') {
        // Summarize text (transcription or text file content)

        // If text file, read text from file:
        if (fileData.type === 'text') {
          transcriptionText = await fileData.file.text();
          setTranscription(transcriptionText);
        }

        const res = await fetch('http://localhost:5000/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: transcriptionText }),
        });

        if (!res.ok) throw new Error('Summary generation failed');

        const { summary } = await res.json();
        setSummary(summary);
      }

      // Mark current step as completed
      setProcessingSteps(prev =>
        prev.map(s =>
          s.id === step.id ? { ...s, status: 'completed' } : s
        )
      );
    }
  } catch (error) {
    console.error(error);
    setProcessingSteps(prev =>
      prev.map(s =>
        s.status === 'processing' ? { ...s, status: 'error' } : s
      )
    );
  } finally {
    setIsProcessing(false);
  }
};



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FileVideo className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SummArize</h1>
                <p className="text-sm text-gray-600">AI-powered meeting transcription and summarization</p>
              </div>
            </div>
            {(uploadedFile || isProcessing) && (
              <button
                onClick={resetApp}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                New Meeting
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!uploadedFile && !isProcessing ? (
          <div className="max-w-3xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Transform Your Meetings into 
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Actionable Insights</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Upload your meeting recordings and get AI-generated transcriptions and summaries in minutes. 
                Supports video files, audio recordings, and text documents.
              </p>
              
              {/* Feature Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileVideo className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Video Processing</h3>
                  <p className="text-sm text-gray-600">Extract audio from MP4 meeting recordings automatically</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileAudio className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">AI Transcription</h3>
                  <p className="text-sm text-gray-600">Powered by OpenAI Whisper for accurate speech-to-text</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Smart Summaries</h3>
                  <p className="text-sm text-gray-600">Generate structured summaries with GPT-4o</p>
                </div>
              </div>
            </div>

            {/* File Uploader */}
            <FileUploader onFileSelect={initializeProcessing} />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Processing Status */}
            {processingSteps.length > 0 && (
              <ProcessingStatus steps={processingSteps} />
            )}

            {/* Results */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Transcription */}
              {transcription && (
                <TranscriptionDisplay transcription={transcription} />
              )}

              {/* Summary */}
              {summary && (
                <SummaryDisplay 
                  summary={summary} 
                  onDownload={downloadSummary}
                />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;