import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Dropzone,
  DropzoneEmptyState,
} from "@/Components/ui/shadcn-io/dropzone";
import { useClassifyDocument } from "@/hooks/useClassifyDocument";
import UploadedFileItem from "./UploadedFileItem";

const MAX_FILES = 3;

const UploadInsuranceFiles = () => {
  const {
    uploadedFiles,
    addFiles,
    removeFile,
    processFile,
  } = useClassifyDocument();

  const handleDrop = useCallback(
    async (files) => {
      if (files.length === 0) return;
      const validFiles = files.filter((file) => {
        if (file.type && !file.type.includes("pdf")) {
          toast.warning(`${file.name} is not a PDF file`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;
      const newFiles = addFiles(validFiles);
      newFiles.forEach((fileData) => {
        processFile(fileData);
      });
    },
    [uploadedFiles.length, addFiles, processFile]
  );

  const handleError = useCallback((error) => {
    console.error("Dropzone error:", error);
    toast?.error(error.message || "Something went wrong");
  }, []);

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
              Maximum {MAX_FILES} files. PDF files only.
            </p>
          </section>

          {/* File List */}
          {uploadedFiles.length > 0 && (
            <section aria-label="Uploaded files">
              <h2 className="sr-only">Uploaded Files</h2>
              <div role="list">
                {uploadedFiles.map((file) => (
                  <div key={file.id} role="listitem">
                    <UploadedFileItem file={file} onRemove={removeFile} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* View All Documents Button */}
          <section className="mt-6 text-center">
            <Link
              to="/gallery"
              className="inline-block transform hover:-translate-y-0.5 active:translate-y-0 bg-blue-400 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
