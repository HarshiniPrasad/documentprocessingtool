'use client';

import React, { useState } from 'react';
import SimpleFileUpload from '@/components/simple-file-upload';
import DocumentReview from '@/components/document-review';
import { Brain } from 'lucide-react';

interface Document {
  file: File;
  data: any;
}

export default function Home() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcessingComplete = (docs: Document[]) => {
    setDocuments(docs);
    setCurrentIndex(0);
    setIsProcessing(false);
  };

  const handleDocumentUpdate = (updatedData: any) => {
    const updatedDocuments = [...documents];
    updatedDocuments[currentIndex].data = updatedData;
    setDocuments(updatedDocuments);
  };

  const resetProcess = () => {
    setDocuments([]);
    setCurrentIndex(0);
    setIsProcessing(false);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Samantha</h1>
          </div>
          <p className="text-xl text-gray-600 mb-2">Medical Document Processing AI</p>
          <p className="text-gray-500">Intelligent document extraction and filing system</p>
        </div>

        {documents.length === 0 ? (
          <SimpleFileUpload
            onProcessingStart={() => setIsProcessing(true)}
            onProcessingComplete={handleProcessingComplete}
          />
        ) : (
          <div className="flex min-h-[600px] bg-white rounded-xl shadow-lg p-8">
            {/* Sidebar */}
            <aside className="w-64 border-r border-gray-200 pr-4 overflow-y-auto" style={{ maxHeight: '600px' }}>
              <h3 className="text-lg font-semibold mb-4 text-black">Documents</h3>
              <ul>
                {documents.map((doc, i) => (
                  <li key={doc.file.name}>
                    <button
                      className={`w-full text-left px-3 py-2 rounded mb-1 ${
                        i === currentIndex
                          ? 'bg-blue-100 font-semibold text-black'
                          : 'hover:bg-gray-100 text-black'
                      }`}
                      onClick={() => setCurrentIndex(i)}
                    >
                      {doc.file.name} <br />
                      <small className="text-gray-500">{doc.data.category || 'No Category'}</small>
                    </button>
                  </li>
                ))}
              </ul>

              <button
                onClick={resetProcess}
                className="mt-6 w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Upload More Documents
              </button>
            </aside>

            {/* Preview + Edit */}
            <main className="flex-1 pl-8 overflow-auto">
              <DocumentReview
                key={documents[currentIndex].file.name}
                file={documents[currentIndex].file}
                data={documents[currentIndex].data}
                onComplete={handleDocumentUpdate}
                onBack={resetProcess}
              />
            </main>
          </div>
        )}
      </div>
    </main>
  );
}
