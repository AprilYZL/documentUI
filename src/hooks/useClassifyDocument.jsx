// Custom hook for file upload management
import { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import { toast } from "sonner";
import { BASE_URL, X_API_KEY } from "@/helpers/utils";

const FileStatus = {
    PROCESSING: 'Processing',
    COMPLETED: 'Completed',
    ERROR: 'Error'
};

const generateFileId = (file) => `${file.name}-${file.size}-${Date.now()}`;

// API service - separated for better testing and reusability
const documentService = {
    async classifyDocument(file, onProgress) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(
                `${BASE_URL}/documents/classify`,
                formData,
                {
                    headers: {
                        'x-api-key': X_API_KEY,
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        onProgress(percentCompleted);
                    },
                    timeout: 30000,
                }
            );
            return response.data;
        } catch (error) {
            console.error('Classification error:', error);
            throw new Error(
                error.response?.data?.message || 
                error.message || 
                'Failed to classify document'
            );
        }
    }
};

export const useClassifyDocument = () => {
    const [uploadedFiles, setUploadedFiles] = useState([]);

    // Memoized function to update specific file status
    const updateFileStatus = useCallback((fileId, updates) => {
        setUploadedFiles(prev => 
            prev.map(file => 
                file.id === fileId ? { ...file, ...updates } : file
            )
        );
    }, []);

    // Add new files to the state
    const addFiles = useCallback((files) => {
        const newFiles = files.map((file) => ({
            id: generateFileId(file),
            name: file.name,
            size: file.size,
            type: 'Processing...',
            confidence: null,
            status: FileStatus.PROCESSING,
            progress: 0,
            originalFile: file,
            error: null,
        }));

        setUploadedFiles(prev => [...prev, ...newFiles]);
        return newFiles;
    }, []);

    // Remove file from the list
    const removeFile = useCallback((fileId) => {
        setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    }, []);

    // Convert file to proper format if needed
    const convertToFile = useCallback(async (fileObj) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = () => {
                const arrayBuffer = reader.result;
                const newFile = new File([arrayBuffer], fileObj.name, { 
                    type: 'application/pdf' 
                });
                resolve(newFile);
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsArrayBuffer(fileObj);
        });
    }, []);

    // Process individual file
    const processFile = useCallback(async (fileData) => {
        try {
            // Convert file to proper format if needed
            const file = fileData.originalFile.type === 'application/pdf' 
                ? fileData.originalFile
                : await convertToFile(fileData.originalFile);

            const result = await documentService.classifyDocument(file, (progress) => {
                updateFileStatus(fileData.id, { 
                    progress,
                    status: progress === 100 ? FileStatus.PROCESSING : FileStatus.PROCESSING
                });
            });

            updateFileStatus(fileData.id, {
                status: FileStatus.COMPLETED,
                classification: result?.classification || 'Unknown',
                confidence: result?.confidence ? (result.confidence * 100).toFixed(1) : 'N/A',
                progress: 100,
                error: null,
            });

            toast?.success(`Successfully classified: ${fileData.name}`);
        } catch (error) {
            updateFileStatus(fileData.id, {
                status: FileStatus.ERROR,
                error: error.message,
                progress: 0,
            });

            toast?.error(`Failed to process ${fileData.name}: ${error.message}`);
        }
    }, [updateFileStatus, convertToFile]);

    // Computed property for checking if all files are processed
    const allFilesProcessed = uploadedFiles.length > 0 && 
        uploadedFiles.every(file => file.status === FileStatus.COMPLETED);

    return {
        uploadedFiles,
        addFiles,
        removeFile,
        processFile,
        allFilesProcessed
    };
};

export default useClassifyDocument