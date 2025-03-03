// DocumentConverter.tsx
"use client";

import { useState, useEffect } from "react";
import FileUploadSection from "./FileUploadSection";
import ConversionResults from "./ConversionResults";
import { uploadFile } from "@/app/api/upload_api2";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { FileText, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const DocumentConverter = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [markdownContent, setMarkdownContent] = useState("");
    const [aiSummary, setAiSummary] = useState<string | null>(null);
    interface FileMetadata {
        filename: string;
        content_type: string;
        size: number;
    }

    const [fileMetadata, setFileMetadata] = useState<FileMetadata | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [activeTab, setActiveTab] = useState("preview");
    const [error, setError] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState(false);

    // Simulated progress during conversion
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isLoading) {
            setProgress(0);
            interval = setInterval(() => {
                setProgress(prev => {
                    const newProgress = prev + (100 - prev) * 0.1;
                    return newProgress > 95 ? 95 : newProgress;
                });
            }, 300);
        } else {
            setProgress(isLoading ? 95 : 0);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    // Complete progress when content arrives
    useEffect(() => {
        if (markdownContent && !isLoading) {
            setProgress(100);
            setTimeout(() => setProgress(0), 1000);
        }
    }, [markdownContent, isLoading]);

    const handleUpload = async () => {
        if (files.length === 0) {
            alert("Please select a file to convert");
            return;
        }

        setIsLoading(true);
        setError(null);
        setCopySuccess(false);

        try {
            const { markdownContent, aiSummary } = await uploadFile(files[0]);
            const metadata = {
                filename: files[0].name,
                content_type: files[0].type,
                size: files[0].size
            };
            setMarkdownContent(markdownContent);
            setAiSummary(aiSummary);
            setFileMetadata(metadata);
            setActiveTab("preview");
        } catch (error) {
            console.error("Error uploading file:", error);
            setError(typeof error === "string" ? error : "Failed to convert file. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setFiles([]);
        setMarkdownContent("");
        setAiSummary(null);
        setFileMetadata(null);
        setError(null);
        setCopySuccess(false);
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-4 sm:p-6">
            <Card className="shadow-lg border-t-4">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                            <FileText className="h-6 w-6" />
                            <span>Smart Document Converter</span>
                        </div>
                        {markdownContent && (
                            <Button variant="default" size="sm" onClick={handleReset}>
                                <RefreshCw className="h-4 w-4 mr-1" />
                                New Conversion
                            </Button>
                        )}
                    </CardTitle>
                </CardHeader>

                {progress > 0 && (
                    <div className="px-6">
                        <Progress value={progress} className="h-1 mb-2" />
                    </div>
                )}

                <CardContent className="pt-4">
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {!markdownContent ? (
                        <FileUploadSection
                            files={files}
                            setFiles={setFiles}
                            isLoading={isLoading}
                            handleUpload={handleUpload}
                        />
                    ) : (
                        fileMetadata && (
                            <ConversionResults
                                fileMetadata={fileMetadata}
                                markdownContent={markdownContent}
                                aiSummary={aiSummary || ""}
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                                copySuccess={copySuccess}
                                setCopySuccess={setCopySuccess}
                                setError={setError}
                            />
                        )
                    )}
                </CardContent>

                <CardFooter className="text-center text-xs pt-2 pb-4">
                    Supports multiple file formats • Up to 20MB • Instant conversion
                </CardFooter>
            </Card>
        </div>
    );
};

export default DocumentConverter;