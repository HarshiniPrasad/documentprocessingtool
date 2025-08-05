'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface SimpleFileUploadProps {
  onProcessingStart: () => void;
  onProcessingComplete: (documents: { file: File; data: any }[]) => void;
}

export default function SimpleFileUpload({ onProcessingStart, onProcessingComplete }: SimpleFileUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(Array.from(files));
      setError(null);
      setDebugInfo(`${files.length} file(s) selected`);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError('Please select file(s) first');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setDebugInfo(`Processing ${selectedFiles.length} file(s)...`);
    onProcessingStart();

    const processedDocs: { file: File; data: any }[] = [];

    try {
      for (const file of selectedFiles) {
        setDebugInfo(`Uploading and processing ${file.name}...`);

        // Upload file to /api/upload
        const formData = new FormData();
        formData.append('file', file);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(`Upload failed for ${file.name}: ${errorData.error || 'Unknown error'}`);
        }

        const uploadData = await uploadResponse.json();
        if (!uploadData.text) {
          throw new Error(`No text extracted from ${file.name}`);
        }

        // Extract fields
        setDebugInfo(`Extracting fields for ${file.name}...`);
        const extractResponse = await fetch('/api/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: uploadData.text }),
        });

        if (!extractResponse.ok) {
          const errorData = await extractResponse.json();
          throw new Error(`Extraction failed for ${file.name}: ${errorData.error || 'Unknown error'}`);
        }

        const extractData = await extractResponse.json();

        processedDocs.push({
          file,
          data: extractData.fields,
        });
      }

      setIsProcessing(false);
      setDebugInfo(`Processed ${processedDocs.length} file(s) successfully!`);
      onProcessingComplete(processedDocs);
    } catch (err: any) {
      setIsProcessing(false);
      setError(err.message || 'Processing failed');
      setDebugInfo(`Error: ${err.message}`);
    }
  };

  const resetFiles = () => {
    setSelectedFiles([]);
    setError(null);
    setDebugInfo('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Upload className="w-8 h-8 text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Upload Medical Documents</h2>
        </div>
        <p className="text-gray-600">
          Upload one or more PDF medical documents for AI-powered extraction and filing
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <div>
              <span className="text-red-700 font-medium">Upload Error:</span>
              <span className="text-red-700 ml-2">{error}</span>
            </div>
          </div>
        </div>
      )}

      {debugInfo && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-blue-700 text-sm">
            <strong>Debug Info:</strong> {debugInfo}
          </div>
        </div>
      )}

      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8">
        <div className="text-center">
          {!selectedFiles.length ? (
            <div>
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Drag and drop PDF files here, or click to browse</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                <FileText className="w-4 h-4 mr-2" />
                Choose PDF File(s)
              </label>
            </div>
          ) : (
            <div>
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-900 font-medium mb-2">{selectedFiles.length} file(s) selected</p>
              <ul className="mb-4 list-disc list-inside text-gray-700">
                {selectedFiles.map((f) => (
                  <li key={f.name}>{f.name} ({(f.size / 1024 / 1024).toFixed(2)} MB)</li>
                ))}
              </ul>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={handleUpload}
                  disabled={isProcessing}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Processing...' : 'Process Documents'}
                </button>
                <button
                  onClick={resetFiles}
                  disabled={isProcessing}
                  className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Choose Different Files
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isProcessing && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Processing documents with AI...
          </div>
        </div>
      )}

      <div className="mt-8 text-sm text-gray-500 text-center">
        <p>Supported formats: PDF only</p>
        <p>Maximum file size: 10MB each</p>
        <p className="mt-2 text-xs">Server running on: http://localhost:3000</p>
      </div>
    </div>
  );
}
