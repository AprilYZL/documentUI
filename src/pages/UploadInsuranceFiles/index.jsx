import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import {
  Dropzone,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { useClassifyDocument } from "../../hooks/useClassifyDocument";
import { formatSize } from "../../helpers/utils";

const MAX_FILES = 3;

// Enums for better type safety
const FileStatus = {
  PROCESSING: "Processing",
  COMPLETED: "Completed",
  ERROR: "Error",
};
// Separate component for file items - better for performance and readability
const FileItem = React.memo(({ file, onRemove }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {file.name}
        </h3>
        <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
      </div>
      <button
        onClick={() => onRemove(file.id)}
        className="ml-3 text-gray-400 hover:text-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        aria-label={`Remove ${file.name}`}
      >
        ×
      </button>
    </div>

    {/* Progress Bar */}
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-600">{file.status}</span>
        <span className="text-xs text-gray-600">{file.progress || 0}%</span>
      </div>
      <Progress value={file.progress || 0} className="h-2" />
    </div>

    {/* File Details */}
    {file.status === FileStatus.COMPLETED && (
      <div className="pt-2 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs text-gray-600">Type: </span>
            <span className="text-xs font-medium text-green-600">
              {file.classification}
            </span>
          </div>
          <div>
            <span className="text-xs text-gray-600">Confidence: </span>
            <span className="text-xs font-medium text-blue-600">
              {file.confidence}%
            </span>
          </div>
        </div>
      </div>
    )}

    {file.status === FileStatus.ERROR && (
      <div className="pt-2 border-t border-gray-100">
        <span className="text-xs text-red-600">Error: {file.error}</span>
      </div>
    )}
  </div>
));

FileItem.displayName = "FileItem";

const UploadInsuranceFiles = () => {
  const {
    uploadedFiles,
    addFiles,
    removeFile,
    processFile,
    allFilesProcessed,
  } = useClassifyDocument();

  // Handle file drop with validation
  const handleDrop = useCallback(
    async (files) => {
      if (files.length === 0) return;

      // Validate file count
      if (uploadedFiles.length + files.length > MAX_FILES) {
        toast?.error(`Maximum ${MAX_FILES} files allowed`);
        return;
      }

      // Validate file types (optional)
      const validFiles = files.filter((file) => {
        if (file.type && !file.type.includes("pdf")) {
          toast?.warning(`${file.name} is not a PDF file`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      const newFiles = addFiles(validFiles);

      // Process each file asynchronously
      newFiles.forEach((fileData) => {
        processFile(fileData);
      });
    },
    [uploadedFiles.length, addFiles, processFile]
  );

  // Handle dropzone errors
  const handleError = useCallback((error) => {
    console.error("Dropzone error:", error);
    toast?.error("Error handling file drop");
  }, []);
  console.log(uploadedFiles);
  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gray-50">
      <div className="max-w-7xl w-full p-10 h-full">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Insurance Document Classifier
          </h1>
          <p className="text-gray-600 text-base">
            Upload insurance documents to automatically classify them
          </p>
        </header>

        <main className="flex flex-col justify-between gap-4">
          {/* Dropzone */}
          <section aria-label="File upload area">
            <Dropzone
              maxFiles={MAX_FILES}
              onDrop={handleDrop}
              onError={handleError}
              accept={{ "application/pdf": [".pdf"] }}
              className="!bg-white h-[200px] shadow-md flex-col justify-center border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors"
            >
              <DropzoneEmptyState />
            </Dropzone>

            <p className="text-xs text-gray-500 mt-2 text-center">
              Maximum {MAX_FILES} files. PDF format recommended.
            </p>
          </section>

          {/* File List */}
          {uploadedFiles.length > 0 && (
            <section aria-label="Uploaded files">
              <h2 className="sr-only">Uploaded Files</h2>
              <div role="list">
                {uploadedFiles.map((file) => (
                  <div key={file.id} role="listitem">
                    <FileItem file={file} onRemove={removeFile} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* View All Documents Button */}
          <section className="mt-6 text-center">
            <Link
              to="/gallery"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              View All Processed Documents
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
};

export default UploadInsuranceFiles;
