import React from "react";
import { Progress } from "@/Components/ui/progress";
import { formatSize } from "@/helpers/utils";

const FileStatus = {
  PROCESSING: "Processing",
  COMPLETED: "Completed",
  ERROR: "Error",
};

const UploadedFileItem = (({ file, onRemove }) => (
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
        className="ml-3 shadow-sm text-gray-400 hover:text-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        aria-label={`Remove ${file.name}`}
      >
        X
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
    {/* Error */}
    {file.status === FileStatus.ERROR && (
      <div className="pt-2 border-t border-gray-100">
        <span className="text-xs text-red-600">Error: {file.error}</span>
      </div>
    )}
  </div>
));

export default UploadedFileItem