// FileUploadSection.tsx
import React from "react";
import {
    FileUploader,
    FileUploaderContent,
    FileUploaderItem,
    FileInput,
} from "@/components/ui/file-upload";
import { Paperclip, FileText, FileImage, Table, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getFileIcon, formatBytes } from "@/utils/constants";

interface FileUploadSectionProps {
    files: File[];
    setFiles: (files: File[]) => void;
    isLoading: boolean;
    handleUpload: () => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({ files, setFiles, isLoading, handleUpload }) => {
    return (
        <div className="space-y-4">
            <FileUploader
                value={files}
                onValueChange={(value) => setFiles(value || [])}
                dropzoneOptions={{
                    maxFiles: 1,
                    maxSize: 20 * 1024 * 1024
                }}
                className="relative rounded-lg p-3 sm:p-6 border border-dashed transition-all"
            >
                <FileInput className="default-none">
                    <div className="flex items-center justify-center flex-col pt-4 pb-6 w-full">
                        <div className="h-12 sm:h-16 w-12 sm:w-16 rounded-full flex items-center justify-center mb-4">
                            <Paperclip className="h-6 w-6 sm:h-8 sm:w-8" />
                        </div>
                        <p className="mb-1 text-base sm:text-lg font-medium text-center">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs sm:text-sm text-center max-w-md">
                            Convert PDF, Word, Excel, CSV, Images, HTML and more to Markdown format
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
                            <Badge variant="default">PDF</Badge>
                            <Badge variant="default">DOCX</Badge>
                            <Badge variant="default">XLSX</Badge>
                            <Badge variant="default">CSV</Badge>
                            <Badge variant="default">HTML</Badge>
                            <Badge variant="default">Images</Badge>
                            <Badge variant="default">JSON</Badge>
                        </div>
                    </div>
                </FileInput>

                <FileUploaderContent>
                    {files?.map((file, i) => (
                        <FileUploaderItem key={i} index={i} className="p-2 rounded-md">
                            <div className="flex items-center gap-2">
                                {getFileIcon(file.type)}
                                <div className="flex-1 truncate">
                                    <div className="font-medium">{file.name}</div>
                                    <div className="text-xs">{formatBytes(file.size)}</div>
                                </div>
                            </div>
                        </FileUploaderItem>
                    ))}
                </FileUploaderContent>
            </FileUploader>

            <Button
                variant="default"
                className="w-full py-4 sm:py-6 text-sm sm:text-md font-medium transition-all"
                onClick={handleUpload}
                disabled={isLoading}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                        <span>Converting Document...</span>
                    </div>
                ) : (
                    <>
                        <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                        Convert to Markdown
                    </>
                )}
            </Button>
        </div>
    );
};

export default FileUploadSection;