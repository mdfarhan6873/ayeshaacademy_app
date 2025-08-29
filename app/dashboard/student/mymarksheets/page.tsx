'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SubjectMark {
  subject: string;
  fullMarks: number;
  passMarks: number;
  assignmentMarks: number;
  theoryMarks: number;
  obtainedMarks: number;
  grade: string;
  remark: string;
}

interface Marksheet {
  _id: string;
  studentName: string;
  rollNumber: string;
  class: string;
  section: string;
  examTitle: string;
  examType: string;
  examDate: string;
  subjects: SubjectMark[];
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  division: string;
  rank: string;
  principalSignature: string;
  classTeacherSignature: string;
  parentSignature: string;
  generatedBy: string;
  generatedDate: string;
  schoolName: string;
  schoolLogo: string;
  schoolAddress: string;
  schoolPhone: string;
}

const MyMarksheets = () => {
  const router = useRouter();
  const [marksheets, setMarksheets] = useState<Marksheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMarksheet, setSelectedMarksheet] = useState<Marksheet | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchMarksheets();
  }, []);

  const fetchMarksheets = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/students/marksheets');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch marksheets');
      }

      setMarksheets(data.marksheets);
    } catch (error) {
      console.error('Error fetching marksheets:', error);
      setError(error instanceof Error ? error.message : 'Failed to load marksheets');
    } finally {
      setLoading(false);
    }
  };

  const openMarksheetDetail = (marksheet: Marksheet) => {
    setSelectedMarksheet(marksheet);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedMarksheet(null);
    setShowModal(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          <span className="text-indigo-600 font-medium">Loading marksheets...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-stone-600 bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800 mb-2">My Marksheets</h1>
            </div>
            <button
              onClick={() => router.back()}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <span>←</span>
              Back
            </button>
          </div>
        </div>

        {/* Marksheets Grid */}
        {marksheets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Marksheets Found</h3>
            <p className="text-gray-500">Your examination results will appear here once they are published.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marksheets.map((marksheet) => (
              <div
                key={marksheet._id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-l-4 border-indigo-500"
                onClick={() => openMarksheetDetail(marksheet)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{marksheet.examTitle}</h3>
                    <p className="text-sm text-gray-600">{marksheet.examType}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    marksheet.grade === 'Diamond' ? 'bg-purple-100 text-purple-800' :
                    marksheet.grade === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                    marksheet.grade === 'Silver' ? 'bg-gray-100 text-gray-800' :
                    marksheet.grade === 'Bronze' ? 'bg-orange-100 text-orange-800' :
                    marksheet.grade === 'Iron' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {marksheet.grade}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Class:</span>
                    <span className="font-medium">{marksheet.class} - {marksheet.section}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Percentage:</span>
                    <span className="font-bold text-indigo-600">{marksheet.percentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Division:</span>
                    <span className="font-medium">{marksheet.division}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Exam Date:</span>
                    <span className="text-sm">{formatDate(marksheet.examDate)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {marksheet.subjects.length} subjects
                  </span>
                  <span className="text-indigo-600 font-medium hover:text-indigo-800">
                    View Details →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedMarksheet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedMarksheet.examTitle}</h2>
                <p className="text-gray-600">{selectedMarksheet.studentName} - {selectedMarksheet.rollNumber}</p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* School Info */}
              <div className="text-center mb-6 border-b pb-6">
                <h3 className="text-xl font-bold text-gray-800">{selectedMarksheet.schoolName}</h3>
                <p className="text-gray-600 text-sm">{selectedMarksheet.schoolAddress}</p>
                <p className="text-gray-600 text-sm">Phone: {selectedMarksheet.schoolPhone}</p>
              </div>

              {/* Student Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="text-sm text-gray-600">Student Name</label>
                  <p className="font-medium">{selectedMarksheet.studentName}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Roll Number</label>
                  <p className="font-medium">{selectedMarksheet.rollNumber}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Class</label>
                  <p className="font-medium">{selectedMarksheet.class} - {selectedMarksheet.section}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Exam Date</label>
                  <p className="font-medium">{formatDate(selectedMarksheet.examDate)}</p>
                </div>
              </div>

              {/* Subjects Table */}
              <div className="mb-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4">Subject-wise Marks</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-indigo-50">
                        <th className="border border-gray-300 px-4 py-2 text-left">Subject</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">Full Marks</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">Pass Marks</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">Assignment</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">Theory</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">Obtained</th>
                        <th className="border border-gray-300 px-4 py-2 text-center">Grade</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Remark</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedMarksheet.subjects.map((subject, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-300 px-4 py-2 font-medium">{subject.subject}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">{subject.fullMarks}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">{subject.passMarks}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">{subject.assignmentMarks}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center">{subject.theoryMarks}</td>
                          <td className="border border-gray-300 px-4 py-2 text-center font-bold text-indigo-600">
                            {subject.obtainedMarks}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-center">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              subject.grade === 'A+' || subject.grade === 'A' ? 'bg-green-100 text-green-800' :
                              subject.grade === 'B+' || subject.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                              subject.grade === 'C+' || subject.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {subject.grade}
                            </span>
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-sm">{subject.remark || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-indigo-50 p-6 rounded-lg">
                <h4 className="text-lg font-bold text-gray-800 mb-4">Result Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-indigo-600">{selectedMarksheet.totalMarks}</p>
                    <p className="text-sm text-gray-600">Total Marks</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{selectedMarksheet.obtainedMarks}</p>
                    <p className="text-sm text-gray-600">Obtained</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{selectedMarksheet.percentage}%</p>
                    <p className="text-sm text-gray-600">Percentage</p>
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${
                      selectedMarksheet.grade === 'Diamond' ? 'text-purple-600' :
                      selectedMarksheet.grade === 'Gold' ? 'text-yellow-600' :
                      selectedMarksheet.grade === 'Silver' ? 'text-gray-600' :
                      selectedMarksheet.grade === 'Bronze' ? 'text-orange-600' :
                      selectedMarksheet.grade === 'Iron' ? 'text-blue-600' :
                      'text-red-600'
                    }`}>
                      {selectedMarksheet.grade}
                    </p>
                    <p className="text-sm text-gray-600">Grade</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-indigo-600">{selectedMarksheet.division}</p>
                    <p className="text-sm text-gray-600">Division</p>
                  </div>
                </div>
                {selectedMarksheet.rank && (
                  <div className="mt-4 text-center">
                    <p className="text-lg">
                      <span className="text-gray-600">Rank:</span>
                      <span className="font-bold text-orange-600 ml-2">{selectedMarksheet.rank}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyMarksheets;