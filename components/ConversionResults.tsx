// ConversionResults.tsx
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { FileText, FileImage, Table, Paperclip, Copy, Check, Download } from "lucide-react";
import { getFileIcon, formatBytes } from "@/utils/constants";

interface FileMetadata {
    filename: string;
    content_type: string;
    size: number;
}

interface ConversionResultsProps {
    fileMetadata: FileMetadata;
    markdownContent: string;
    aiSummary: string;
    activeTab: string;
    setActiveTab: (value: string) => void;
    copySuccess: boolean;
    setCopySuccess: (value: boolean) => void;
    setError: (message: string) => void;
}

const ConversionResults: React.FC<ConversionResultsProps> = ({
    fileMetadata,
    markdownContent,
    aiSummary,
    activeTab,
    setActiveTab,
    copySuccess,
    setCopySuccess,
    setError
}) => {
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

    return (
        <div className="space-y-4">
            {fileMetadata && (
                <div className="mb-4 flex items-center justify-between p-3 rounded-md text-sm">
                    <div className="flex items-center gap-2 overflow-hidden">
                        {getFileIcon(fileMetadata.content_type)}
                        <span className="font-medium truncate">{fileMetadata.filename}</span>
                    </div>
                    <div className="shrink-0">
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
                        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between flex-wrap gap-2">
                            <h3 className="text-sm sm:text-md font-medium">Extracted Markdown</h3>
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
                                                    <Check className="h-4 w-4" />
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
                        <CardContent className="max-h-60 sm:max-h-96 overflow-y-auto bg-gray-50 p-2 sm:p-4 rounded-md">
                            <pre className="whitespace-pre-wrap text-xs sm:text-sm font-mono">
                                {markdownContent}
                            </pre>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="summary" className="mt-0">
                    <Card className="shadow-sm border">
                        <CardHeader className="py-3 px-4">
                            <h3 className="text-sm sm:text-md font-medium">AI-Generated Summary</h3>
                        </CardHeader>
                        <CardContent className="max-h-60 sm:max-h-96 overflow-y-auto p-2 sm:p-4 rounded-md">
                            <div className="prose max-w-none text-xs sm:text-sm">
                                {aiSummary}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ConversionResults;