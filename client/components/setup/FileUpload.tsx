"use client";

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
}

export const FileUpload = ({ onFileSelect }: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      onFileSelect(selectedFile);
      
      // Simulate upload progress
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 50);
    }
  }, [onFileSelect]);

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
    onFileSelect(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    },
    multiple: false
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full"
          >
            <div
              {...getRootProps()}
              className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-12 transition-all duration-300 flex flex-col items-center justify-center ${
                isDragActive 
                  ? 'border-cyan-500 bg-cyan-500/5' 
                  : 'border-slate-800 hover:border-slate-700 bg-slate-900/20'
              }`}
            >
              <input {...getInputProps()} />
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Upload className={`w-8 h-8 ${isDragActive ? 'text-cyan-500' : 'text-slate-500'}`} />
              </div>
              <h3 className="text-xl font-bold mb-2 font-mono uppercase tracking-tight text-slate-200">
                {isDragActive ? 'Drop your resume here' : 'Initialize Data Upload'}
              </h3>
              <p className="text-slate-500 text-sm text-center font-sans max-w-xs">
                Drag and drop your PDF or TXT resume, or click to browse. Our AI will analyze your profile.
              </p>
              <div className="mt-8 flex gap-4">
                <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded bg-slate-800 text-slate-500">PDF_ONLY</span>
                <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded bg-slate-800 text-slate-500">TXT_ONLY</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="file-info"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-8 border border-slate-800 rounded-2xl bg-slate-900/40 backdrop-blur-sm"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <FileText className="w-8 h-8 text-cyan-500" />
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-mono text-sm font-bold truncate text-slate-200">{file.name}</h4>
                  <button 
                    onClick={removeFile}
                    className="p-1 hover:bg-slate-800 rounded-md transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-500 hover:text-rose-500" />
                  </button>
                </div>
                <div className="text-xs text-slate-500 font-mono mb-4">
                  {(file.size / 1024).toFixed(1)} KB • DATA_STREAMS_ACTIVE
                </div>
                
                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-500">
                    {uploadProgress < 100 ? `PARSING_RESUME: ${uploadProgress}%` : 'COMPLETED_SUCCESSFULLY'}
                  </span>
                  {uploadProgress === 100 && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
