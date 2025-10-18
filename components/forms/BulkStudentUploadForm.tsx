"use client";

import { useState, useRef } from "react";

interface BulkUploadResponse {
  message: string;
  totalRows: number;
  successfulUploads: number;
  errors: string[];
  duplicateMobiles: string[];
}

interface BulkStudentUploadFormProps {
  onSubmit: (data: BulkUploadResponse) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function BulkStudentUploadForm({ onSubmit, onCancel, isLoading }: BulkStudentUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<BulkUploadResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        alert('Please select a valid Excel file (.xlsx or .xls)');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/admin/students/bulk-upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadResult(result);
        onSubmit(result);
      } else {
        alert(result.error || 'Upload failed');
      }
    } catch (error) {
      alert('An error occurred while uploading');
    }
  };

  const downloadSample = () => {
    // Create sample data
    const sampleData = [
      {
        name: 'John Doe',
        class: '10th',
        section: 'A',
        rollNo: '1',
        mobileNo: '1234567890',
        password: 'password123',
        parentName: 'Jane Doe',
        parentMobileNo: '0987654321',
        address: '123 Main Street, City, State'
      },
      {
        name: 'Jane Smith',
        class: '9th',
        section: 'B',
        rollNo: '2',
        mobileNo: '1234567891',
        password: 'password123',
        parentName: 'Bob Smith',
        parentMobileNo: '0987654322',
        address: '456 Oak Avenue, City, State'
      }
    ];

    // Create workbook
    const XLSX = require('xlsx');
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');

    // Download file
    XLSX.writeFile(workbook, 'sample_students.xlsx');
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-emerald-700">
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Bulk Upload Students
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Instructions:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Download the sample Excel file to see the required format</li>
              <li>• Excel file must contain columns: name, class, section, rollNo, mobileNo, password, parentName, parentMobileNo, address</li>
              <li>• All fields are required</li>
              <li>• Mobile numbers must be unique and 10 digits</li>
              <li>• Supported formats: .xlsx and .xls</li>
            </ul>
            <button
              onClick={downloadSample}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Download Sample Excel
            </button>
          </div>

          {uploadResult && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Upload Results:</h3>
              <div className="text-sm text-green-700 space-y-1">
                <p><strong>Total Rows:</strong> {uploadResult.totalRows}</p>
                <p><strong>Successful Uploads:</strong> {uploadResult.successfulUploads}</p>
                {uploadResult.errors.length > 0 && (
                  <div>
                    <strong>Errors:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {uploadResult.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {uploadResult.duplicateMobiles.length > 0 && (
                  <div>
                    <strong>Duplicate Mobile Numbers:</strong>
                    <ul className="list-disc list-inside mt-1">
                      {uploadResult.duplicateMobiles.map((mobile, index) => (
                        <li key={index}>{mobile}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Excel File *
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
              {selectedFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !selectedFile}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Uploading..." : "Upload Students"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
