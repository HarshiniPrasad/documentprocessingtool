'use client';

import React, { useState, useEffect } from 'react';

interface Props {
  data: Record<string, any>;
  file: File;
  onComplete: () => void;
  onBack: () => void;
}

const CATEGORY_OPTIONS = [
  'Admissions summary', 'Advance care planning', 'Allied health letter',
  'Certificate', 'Clinical notes', 'Clinical photograph', 'Consent form',
  'DAS21', 'Discharge summary', 'ECG', 'Email', 'Form', 'Immunisation',
  'Indigenous PIP', 'Letter', 'Medical imaging report', 'MyHealth registration',
  'New PT registration form', 'Pathology results', 'Patient consent',
  'Record request', 'Referral letter', 'Workcover', 'Workcover consent'
];

export default function DocumentReview({ data, file, onComplete, onBack }: Props) {
  const [formData, setFormData] = useState(data);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setBlobUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderInput = (field: string) => {
    const value = formData[field] || '';
    const normalized = field.toLowerCase();

    if (normalized.includes('patient name') || normalized.includes('contact of source') || normalized.includes('user') || normalized.includes('doctor') || normalized.includes('gp')) {
      return (
        <select
          value={value}
          onChange={(e) => handleChange(field, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
        >
          <option value={value}>{value}</option>
          
        </select>
      );
    }

    if (normalized.includes('store')) {
      return (
        <select
          value={value}
          onChange={(e) => handleChange(field, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
        >
          
          <option value="Correspondence">Correspondence</option>
          <option value="Investigations">Investigations</option>
        </select>
      );
    }

    if (normalized.includes('category')) {
      return (
        <select
          value={value}
          onChange={(e) => handleChange(field, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
        >
          <option value={value}>{value}</option>
          {CATEGORY_OPTIONS.filter(opt => opt !== value).map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }

    return (
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(field, e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800"
      />
    );
  };

  const handleSubmit = () => {
    onComplete(formData);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* File Preview */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">Document Preview</h2>
        {blobUrl ? (
          <iframe
            src={blobUrl}
            style={{ width: '100%', height: '600px', border: '1px solid #ccc' }}
            title="Document Preview"
          />
        ) : (
          <p className="text-red-600">No file selected.</p>
        )}
      </div>

      {/* Editable Fields */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Review & Edit Extracted Fields</h2>
        <form className="space-y-4">
          {Object.keys(formData).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field}</label>
              {renderInput(field)}
            </div>
          ))}
        </form>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Confirm & File
          </button>
        </div>
      </div>
    </div>
  );
}
