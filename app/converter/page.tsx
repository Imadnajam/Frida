"use client";

import { useState, useEffect } from "react";
import {
    FileUploader,
    FileUploaderContent,
    FileUploaderItem,
    FileInput,
} from "@/components/ui/file-upload";
import {
    Paperclip,
    FileText,
    FileImage,
    Table,
    RefreshCw,
    Check,
    AlertCircle,
    Copy,
    Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { uploadFile } from "@/app/api/upload_api2";

const DocumentConverter = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [markdownContent, setMarkdownContent] = useState<string>("");
    const [aiSummary, setAiSummary] = useState<string | null>(null);
    const [fileMetadata, setFileMetadata] = useState<{ filename: string; content_type: string; size: number } | null>(null);
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

    const getFileIcon = (file: { type: string }) => {
        if (!file) return <Paperclip />;
        const type = file.type;

        if (type.includes('pdf')) return <FileText className="text-red-500" />;
        if (type.includes('word')) return <FileText className="text-blue-500" />;
        if (type.includes('sheet') || type.includes('csv')) return <Table className="text-green-500" />;
        if (type.includes('image')) return <FileImage className="text-purple-500" />;
        return <Paperclip />;
    };

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
            setFileMetadata(metadata || {
                filename: files[0].name,
                content_type: files[0].type,
                size: files[0].size
            });
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

    const copyToClipboard = (content: string) => {
        navigator.clipboard.writeText(content).then(
            () => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            },
            () => {
                setError("Failed to copy to clipboard");
            }
        );
    };

    const downloadMarkdown = () => {
        if (!markdownContent) return;

        const blob = new Blob([markdownContent], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileMetadata?.filename || 'document'}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const formatBytes = (bytes: number, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-4">
            <Card className="shadow-lg border-t-4 border-t-blue-500">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
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
                        <div className="space-y-4">
                            <FileUploader
                                value={files}
                                onValueChange={(value) => setFiles(value || [])}
                                dropzoneOptions={{
                                    maxFiles: 1,
                                    maxSize: 20 * 1024 * 1024
                                }}
                                className="relative bg-background rounded-lg p-6 border border-dashed transition-all hover:border-blue-400"
                            >
                                <FileInput className="default-none">
                                    <div className="flex items-center justify-center flex-col pt-4 pb-6 w-full">
                                        <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                                            <Paperclip className="h-8 w-8 text-blue-500" />
                                        </div>
                                        <p className="mb-1 text-lg font-medium">
                                            <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-sm text-gray-500 text-center max-w-md">
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
                                        <FileUploaderItem key={i} index={i} className="p-2 bg-blue-50 rounded-md">
                                            <div className="flex items-center gap-2">
                                                {getFileIcon(file)}
                                                <div className="flex-1 truncate">
                                                    <div className="font-medium">{file.name}</div>
                                                    <div className="text-xs text-gray-500">{formatBytes(file.size)}</div>
                                                </div>
                                            </div>
                                        </FileUploaderItem>
                                    ))}
                                </FileUploaderContent>
                            </FileUploader>

                            <Button
                                variant="default"
                                className="w-full py-6 text-md font-medium bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 transition-all"
                                onClick={handleUpload}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <RefreshCw className="h-5 w-5 animate-spin" />
                                        <span>Converting Document...</span>
                                    </div>
                                ) : (
                                    <>
                                        <FileText className="h-5 w-5 mr-2" />
                                        Convert to Markdown
                                    </>
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {fileMetadata && (
                                <div className="mb-4 flex items-center justify-between p-3 bg-gray-50 rounded-md text-sm">
                                    <div className="flex items-center gap-2">
                                        {getFileIcon({ type: fileMetadata.content_type })}
                                        <span className="font-medium">{fileMetadata.filename}</span>
                                    </div>
                                    <div className="text-gray-500">
                                        {formatBytes(fileMetadata.size)}
                                    </div>
                                </div>
                            )}

                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <TabsList className="grid grid-cols-2 mb-4">
                                    <TabsTrigger value="preview">Markdown Preview</TabsTrigger>
                                    <TabsTrigger value="summary">AI Summary</TabsTrigger>
                                </TabsList>

                                <TabsContent value="preview" className="mt-0">
                                    <Card className="shadow-sm border">
                                        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
                                            <h3 className="text-md font-medium">Extracted Markdown</h3>
                                            <div className="flex gap-2">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                variant="default"
                                                                onClick={() => copyToClipboard(markdownContent)}
                                                            >
                                                                {copySuccess ? (
                                                                    <Check className="h-4 w-4 text-green-500" />
                                                                ) : (
                                                                    <Copy className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{copySuccess ? "Copied!" : "Copy to clipboard"}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>

                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                variant="default"
                                                                onClick={downloadMarkdown}
                                                            >
                                                                <Download className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Download as .md file</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="max-h-96 overflow-y-auto bg-gray-50 p-4 rounded-md">
                                            <pre className="whitespace-pre-wrap text-sm font-mono">
                                                {markdownContent}
                                            </pre>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="summary" className="mt-0">
                                    <Card className="shadow-sm border">
                                        <CardHeader className="py-3 px-4">
                                            <h3 className="text-md font-medium">AI-Generated Summary</h3>
                                        </CardHeader>
                                        <CardContent className="max-h-96 overflow-y-auto bg-gray-50 p-4 rounded-md">
                                            <div className="prose max-w-none text-sm">
                                                {aiSummary}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="text-center text-xs text-gray-500 pt-2 pb-4">
                    Supports multiple file formats • Up to 20MB • Instant conversion
                </CardFooter>
            </Card>
        </div>
    );
};

export default DocumentConverter;