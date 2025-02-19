"use client";

import { useState } from "react";
import {
    FileUploader,
    FileUploaderContent,
    FileUploaderItem,
    FileInput,
} from "@/components/ui/file-upload";
import { Paperclip } from "lucide-react";
import {Button} from "@/components/ui/button";
const FileUploaderTest = () => {
    const [files, setFiles] = useState<File[] | null>(null);
    const [markdownUrl, setMarkdownUrl] = useState<string | null>(null);

    const handleUpload = async () => {
        if (!files || files.length === 0) return;

        const formData = new FormData();
        formData.append("file", files[0]);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                alert(`File uploaded successfully!`);

                if (data.markdownFile) {
                    setMarkdownUrl(data.markdownFile);
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
                dropzoneOptions={{ maxFiles: 5, maxSize: 4 * 1024 * 1024, multiple: true }}
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
                    {files &&
                        files.length > 0 &&
                        files.map((file, i) => (
                            <FileUploaderItem key={i} index={i}>
                                <Paperclip className="h-4 w-4 stroke-current" />
                                <span>{file.name}</span>
                            </FileUploaderItem>
                        ))}
                </FileUploaderContent>
            </FileUploader>
         <Button variant="default" className="w-full py-2 ">
                Upload & Convert Files
              </Button>
            {markdownUrl && (
                <p className="mt-3">
                    ✅ Markdown file:{" "}
                    <a href={markdownUrl} target="_blank" className="text-blue-500 underline">
                        {markdownUrl}
                    </a>
                </p>
            )}
        </div>
    );
};

export default FileUploaderTest;
