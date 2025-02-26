"use client";

import { useState, useEffect, useRef } from "react";
import {
    FileUploader,
    FileUploaderContent,
    FileUploaderItem,
    FileInput,
} from "@/components/ui/file-upload";
import { Paperclip, Sparkles, FileText, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { uploadFile } from "@/app/api/upload_api";
import { CircularProgress } from "@/components/ui/circular-progress";

const FileUploaderTest = () => {
    const [files, setFiles] = useState<File[] | null>(null);
    const [markdownContent, setMarkdownContent] = useState<string | null>(null);
    const [aiSummary, setAiSummary] = useState<string | null>(null);
    const [displayedSummary, setDisplayedSummary] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const summaryRef = useRef<HTMLDivElement>(null);

    // Handle text generation animation effect
    useEffect(() => {
        if (aiSummary && isAnimating) {
            let currentIndex = 0;
            const speed = 10; // Adjust typing speed

            const typingInterval = setInterval(() => {
                setDisplayedSummary(aiSummary.substring(0, currentIndex));
                currentIndex++;

                // Scroll to bottom of content as it's typing
                if (summaryRef.current) {
                    summaryRef.current.scrollTop = summaryRef.current.scrollHeight;
                }

                if (currentIndex > aiSummary.length) {
                    clearInterval(typingInterval);
                    setIsAnimating(false);
                }
            }, speed);

            return () => clearInterval(typingInterval);
        }
    }, [aiSummary, isAnimating]);

    const handleUpload = async () => {
        if (!files || files.length === 0) {
            alert("No files selected");
            return;
        }

        setIsLoading(true);
        try {
            const { markdownContent, aiSummary } = await uploadFile(files[0]);
            setMarkdownContent(markdownContent);
            setAiSummary(aiSummary);
            setIsAnimating(true); // Start animation after data is loaded
        } catch (error) {
            alert(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetAnimation = () => {
        setDisplayedSummary("");
        setIsAnimating(true);
    };

    return (
        <div className="mx-auto max-w-4xl">
            {!markdownContent && !aiSummary ? (
                <div className="space-y-4">
                    <FileUploader
                        value={files}
                        onValueChange={setFiles}
                        dropzoneOptions={{ maxFiles: 1, maxSize: 4 * 1024 * 1024 }}
                        className="relative bg-background rounded-lg p-6 border border-dashed transition-colors"
                    >
                        <FileInput className="outline-none">
                            <div className="flex items-center justify-center flex-col pt-6 pb-8 w-full">
                                <Paperclip className="h-12 w-12  mb-4" />
                                <p className="mb-2 text-lg font-medium">
                                    <span className="font-bold ">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-sm ">Only PDF files are converted to Markdown</p>
                            </div>
                        </FileInput>
                        <FileUploaderContent>
                            {files?.map((file, i) => (
                                <FileUploaderItem key={i} index={i} className=" p-3 rounded-md">
                                    <Paperclip className="h-5 w-5 " />
                                    <span className="font-medium">{file.name}</span>
                                </FileUploaderItem>
                            ))}
                        </FileUploaderContent>
                    </FileUploader>

                    <Button
                        variant="default"
                        className="w-full py-3 text-lg bg-gradient-to-r   transition-all shadow-md"
                        onClick={handleUpload}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-3">
                                <CircularProgress className="h-5 w-5 " />
                                <span>Processing document...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5" />
                                <span>Upload & Convert File</span>
                            </div>
                        )}
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6">
                    {/* Card for Extracted Markdown Content */}
                    <Card className="shadow-lg ">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b ">
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 " />
                                <h3 className="text-xl font-bold ">Extracted Markdown Content</h3>
                            </div>
                        </CardHeader>
                        <CardContent className="max-h-64 overflow-y-auto p-4 ">
                            <pre className="whitespace-pre-wrap text-sm font-mono  p-4 rounded-md border  shadow-inner">
                                {markdownContent}
                            </pre>
                        </CardContent>
                    </Card>

               
                    <Card className="shadow-lg border-indigo-200 overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white border-b border-indigo-600">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Bot className="h-6 w-6 text-white" />
                                    <h3 className="text-xl font-bold">Frida Summary</h3>
                                </div>
                                {!isAnimating && aiSummary && (
                                    <Button
                                        size="sm"
                                        variant="default"
                                        onClick={handleResetAnimation}
                                        className=" border-none"
                                    >
                                        <Sparkles className="h-4 w-4 mr-1" /> Replay
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent
                            className="max-h-96 overflow-y-auto p-6 bg-gradient-to-b from-indigo-50 to-white"
                            ref={summaryRef}
                        >
                            <div className="relative">
                                {isAnimating && (
                                    <div className="absolute right-0 top-0">
                                        <CircularProgress className="h-5 w-5 text-indigo-500" />
                                    </div>
                                )}
                                <div className="font-medium text-gray-800 leading-relaxed">
                                    {displayedSummary}
                                    {isAnimating && <span className="inline-block w-2 h-4 ml-1 bg-indigo-600 animate-pulse" />}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-indigo-50 border-t border-indigo-100 py-3 px-6">
                            <div className="text-xs text-indigo-600 flex items-center gap-1">
                                <Sparkles className="h-3 w-3" />
                                <span>AI-powered summary by Frida</span>
                            </div>
                        </CardFooter>
                    </Card>

                    <Button
                        variant="default"
                        className="w-full"
                        onClick={() => {
                            setFiles(null);
                            setMarkdownContent(null);
                            setAiSummary(null);
                            setDisplayedSummary("");
                        }}
                    >
                        Process Another Document
                    </Button>
                </div>
            )}
        </div>
    );
};

export default FileUploaderTest;