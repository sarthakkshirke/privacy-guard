
import React, { ChangeEvent } from 'react';
import { Upload } from 'lucide-react';

interface DropZoneProps {
  onFileChange: (file: File) => void;
}

const DropZone: React.FC<DropZoneProps> = ({ onFileChange }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileChange(selectedFile);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50 hover:bg-gray-100 cursor-pointer">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleChange}
        accept=".txt,.pdf,.doc,.docx"
      />
      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
        <Upload className="h-12 w-12 text-gray-400 mb-2" />
        <p className="text-sm font-medium">Click to upload or drag and drop</p>
        <p className="text-xs text-gray-500 mt-1">TXT, PDF, DOC up to 10MB</p>
      </label>
    </div>
  );
};

export default DropZone;
