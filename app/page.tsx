'use client';

import { useSnackbar } from '@/components/SnackBar-context';
import { compressAndConvertToWebP } from '@/lib/compress';
import { useState } from 'react';

export default function FileUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<Blob | null>(null);
  const [originalSizeKB, setOriginalSizeKB] = useState<string | null>(null);
  const [compressedSizeKB, setCompressedSizeKB] = useState<string | null>(null);
  const [maxSizeMB, setMaxSizeMB] = useState<number>(1); 
  const { snackbar } = useSnackbar(); 

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      resetState();
      setFile(droppedFiles[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      resetState();
      setFile(selectedFiles[0]);
    }
  };

  const resetState = () => {
    setCompressedFile(null);
    setOriginalSizeKB(null);
    setCompressedSizeKB(null);
  };

  const processFile = async () => {
    if (!file) return;

    

    snackbar.promise( (async ()=> {
      const originalKB = (file.size / 1024).toFixed(2);
      setOriginalSizeKB(originalKB);

      const processed = await compressAndConvertToWebP(file, maxSizeMB);
      const compressedKB = (processed.size / 1024).toFixed(2);

      setCompressedFile(processed);
    setCompressedSizeKB(compressedKB);
    })(), {
      loading: { message: 'Compressing your picture...' },
      success: {
        message: 'Your Image has been compressed',
        options: { icon: <img src='/tick.svg' alt='Success'/>, duration: 3000 },
      },
      error: { message: 'The cruiser got a flat tire!' },
    });

    
  };

  const downloadCompressedImage = () => {
    if (!compressedFile) return;
    const url = URL.createObjectURL(compressedFile);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'compressed-image.webp';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Upload a File</h1>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-4 border-dashed border-gray-300 rounded-2xl p-12 text-center text-gray-500 hover:border-blue-500 transition"
        >
          Drag & Drop a file here or click the button below
        </div>

        <div className="text-center">
          <label className="inline-block cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition">
            Select File
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <div className="text-center">
          <label className="block text-sm font-medium text-gray-700 mt-4">Max Size (MB)</label>
          <input
            type="number"
            value={maxSizeMB}
            onChange={(e) => setMaxSizeMB(Number(e.target.value))}
            min={0.1}
            step={0.1}
            className="mt-1 px-4 py-2 rounded-xl border border-gray-300 focus:ring-blue-500 focus:border-blue-500 w-32 text-center"
          />
        </div>

        {file && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">Selected File:</h2>
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl shadow-sm">
              <span className="truncate max-w-xs">{file.name}</span>
              <span className="text-sm text-gray-400">{(file.size / 1024).toFixed(2)} KB</span>
            </div>
          </div>
        )}

        {compressedFile && (
          <div className="mt-6 space-y-2">
            <h2 className="text-lg font-semibold">Compression Result:</h2>
            <div className="bg-green-50 p-3 rounded-xl shadow-sm text-sm space-y-1">
              <div>Original Size: <strong>{originalSizeKB} KB</strong></div>
              <div>Compressed Size: <strong>{compressedSizeKB} KB</strong></div>
            </div>
            <button
              onClick={downloadCompressedImage}
              className="mt-3 bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition"
            >
              Download Compressed Image
            </button>
          </div>
        )}

        <div className="text-center pt-4">
          <button
            onClick={processFile}
            className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition disabled:bg-gray-400"
            disabled={!file}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
