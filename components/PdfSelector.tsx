
import React, { useRef } from 'react';
import type { StoredPdf } from '../types';
import { DocumentPlusIcon, DocumentIcon, ArrowPathIcon } from './icons';

interface PdfSelectorProps {
  pdfs: StoredPdf[];
  selectedPdfId?: string | null;
  onSelectPdf: (id: string) => void;
  onFileUpload: (file: File) => void;
  isUploading: boolean;
}

export const PdfSelector: React.FC<PdfSelectorProps> = ({ pdfs, selectedPdfId, onSelectPdf, onFileUpload, isUploading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onFileUpload(event.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="font-bold text-lg mb-3 text-gray-800 dark:text-gray-200">My Coursebooks</h3>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf"
        disabled={isUploading}
      />
      <button
        onClick={handleUploadClick}
        disabled={isUploading}
        className="w-full flex items-center justify-center gap-2 bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-600 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
      >
        {isUploading ? <ArrowPathIcon className="animate-spin h-5 w-5" /> : <DocumentPlusIcon />}
        <span>{isUploading ? 'Processing...' : 'Upload PDF'}</span>
      </button>
      <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
        {pdfs.map((pdf) => (
          <button
            key={pdf.id}
            onClick={() => onSelectPdf(pdf.id)}
            className={`w-full text-left p-2 rounded-md flex items-center gap-2 transition-colors ${
              selectedPdfId === pdf.id
                ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <DocumentIcon className="flex-shrink-0" />
            <span className="truncate text-sm font-medium">{pdf.name}</span>
          </button>
        ))}
        {pdfs.length === 0 && !isUploading && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No PDFs uploaded yet.</p>
        )}
      </div>
    </div>
  );
};
