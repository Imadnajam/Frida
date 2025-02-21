"use client";

import { useState } from "react";
import {
    FileUploader,
    FileUploaderContent,
    FileUploaderItem,
    FileInput,
} from "@/components/ui/file-upload";
import { Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";

const FileUploaderTest = () => {
    const [files, setFiles] = useState<File[] | null>(null);
    const [markdownContent, setMarkdownContent] = useState<string | null>(null);

    const handleUpload = async () => {
        if (!files || files.length === 0) {
            alert("No files selected");
            return;
        }

        const formData = new FormData();
        formData.append("file", files[0]);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log("API Response:", data);

                if (data.markdownContent) {
                    setMarkdownContent(data.markdownContent);
                } else {
                    console.error("Markdown content not found in response");
                    alert("Failed to extract markdown content.");
                }
            } else {
                alert("File upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Error uploading file");
        }
    };

    return (
        <div>
            <FileUploader
                value={files}
                onValueChange={setFiles}
                dropzoneOptions={{ maxFiles: 1, maxSize: 4 * 1024 * 1024 }}
                className="relative bg-background rounded-lg p-2"
            >
                <FileInput className="outline-dashed outline-1">
                    <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full">
                        <p className="mb-1 text-sm">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs">Only PDF files are converted to Markdown</p>
                    </div>
                </FileInput>
                <FileUploaderContent>
                    {files?.map((file, i) => (
                        <FileUploaderItem key={i} index={i}>
                            <Paperclip className="h-4 w-4 stroke-current" />
                            <span>{file.name}</span>
                        </FileUploaderItem>
                    ))}
                </FileUploaderContent>
            </FileUploader>

            <Button
                variant="default"
                className="w-full py-2 mt-4"
                onClick={handleUpload}
            >
                Upload & Convert File
            </Button>

            {markdownContent ? (
                <div className="mt-4 p-4 bg-gray-100 rounded-md max-h-64 overflow-y-auto">
                    <h3 className="text-lg font-bold mb-2">📄 Extracted Markdown Content:</h3>
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">
                        {markdownContent}
                    </pre>
                </div>
            ) : (
                <p className="mt-3 text-gray-500">No markdown content generated yet.</p>
            )}
        </div>
    );
};

export default FileUploaderTest;
