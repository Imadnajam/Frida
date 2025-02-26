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
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { uploadFile } from "@/app/api/upload_api";
import { CircularProgress } from "@/components/ui/circular-progress";

const FileUploaderTest = () => {
    const [files, setFiles] = useState<File[] | null>(null);
    const [markdownContent, setMarkdownContent] = useState<string | null>(null);
    const [aiSummary, setAiSummary] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false); // State for loading

    const handleUpload = async () => {
        if (!files || files.length === 0) {
            alert("No files selected");
            return;
        }

        setIsLoading(true); // Start loading
        try {
            const { markdownContent, aiSummary } = await uploadFile(files[0]);
            setMarkdownContent(markdownContent);
            setAiSummary(aiSummary);
        } catch (error) {
            alert(error);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <div className="mx-auto ">
            {!markdownContent && !aiSummary ? (
                <div className="space-y-4">
                    <FileUploader
                        value={files}
                        onValueChange={setFiles}
                        dropzoneOptions={{ maxFiles: 1, maxSize: 4 * 1024 * 1024 }}
                        className="relative bg-background rounded-lg p-4 border border-dashed "
                    >
                        <FileInput className="outline-none">
                            <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full">
                                <Paperclip className="h-8 w-8  mb-2" />
                                <p className="mb-1 text-sm ">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs ">Only PDF files are converted to Markdown</p>
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
                        className="w-full py-2 "
                        onClick={handleUpload}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <CircularProgress className="h-4 w-4" /> 
                                <span>Processing...</span>
                            </div>
                        ) : (
                            "Upload & Convert File"
                        )}
                    </Button>
                </div>
            ) : (
                <div className="">
                    {/* Card for Extracted Markdown Content */}
                    <Card className="shadow-lg flex-1">
                        <CardHeader>
                            <h3 className="text-lg font-bold ">Extracted Markdown Content</h3>
                        </CardHeader>
                        <CardContent className="max-h-64 overflow-y-auto">
                            <pre className="whitespace-pre-wrap text-sm ">
                                {markdownContent}
                            </pre>
                        </CardContent>
                        </Card>
                        <br />

                    {/* Card for AI Summary */}
                    <Card className="shadow-lg flex-1">
                        <CardHeader>
                            <h3 className="text-lg font-bold ">Frida Summary</h3>
                        </CardHeader>
                        <CardContent className="max-h-64 overflow-y-auto">
                            <pre className="whitespace-pre-wrap text-sm ">
                                {aiSummary}
                            </pre>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default FileUploaderTest;