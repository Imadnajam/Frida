"use client";

import { useState, useEffect } from "react";
import FileUploaderTest from "@/components/uploader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, History, Settings, ChevronRight, Download, Trash2, CheckCircle, AlertCircle } from "lucide-react";

const FileUploadPage = () => {
    const [activeTab, setActiveTab] = useState("upload");
    const [uploadHistory, setUploadHistory] = useState([
        { id: 1, filename: "report.pdf", date: "2025-03-15", status: "complete", size: "2.4 MB" },
        { id: 2, filename: "document.pdf", date: "2025-03-12", status: "complete", size: "1.8 MB" },
        { id: 3, filename: "presentation.pdf", date: "2025-03-08", status: "failed", size: "4.2 MB" }
    ]);
    const [selectedFile, setSelectedFile] = useState<number | null>(null);
    const [animateList, setAnimateList] = useState(false);

    // Animation effect when tab changes
    useEffect(() => {
        if (activeTab === "history") {
            setAnimateList(true);
            const timer = setTimeout(() => {
                setAnimateList(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [activeTab]);

    const handleFileSelect = (file: { id: number; filename: string; date: string; status: string; size: string }) => {
        setSelectedFile(file.id === selectedFile ? null : file.id);
    };

    const getStatusIcon = (status: string) => {
        return status === 'complete' ?
            <CheckCircle className="h-5 w-5 text-green-500" /> :
            <AlertCircle className="h-5 w-5 text-red-500" />;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto py-8 px-4 max-w-5xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Document Processor</h1>
                    <p className="text-gray-500 dark:text-gray-400">Upload PDFs to convert them to markdown and get AI summaries</p>
                </div>

                <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="flex justify-center mb-6">
                        <TabsList className="grid grid-cols-3 w-full max-w-md bg-white/20 backdrop-blur-lg dark:bg-gray-800/30">
                            <TabsTrigger value="upload" className="flex items-center gap-2 transition-all duration-200">
                                <FileText className="h-4 w-4" />
                                <span>Upload</span>
                            </TabsTrigger>
                            <TabsTrigger value="history" className="flex items-center gap-2 transition-all duration-200">
                                <History className="h-4 w-4" />
                                <span>History</span>
                            </TabsTrigger>
                            <TabsTrigger value="settings" className="flex items-center gap-2 transition-all duration-200">
                                <Settings className="h-4 w-4" />
                                <span>Settings</span>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="upload" className="mt-0 transition-all duration-500 transform">
                        <Card className="bg-white dark:bg-gray-800 shadow-xl border-0 overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                <CardTitle className="text-xl font-medium">Upload Document</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <FileUploaderTest />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="history" className="mt-0 transition-all duration-500 transform">
                        <Card className="bg-white dark:bg-gray-800 shadow-xl border-0 overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                <CardTitle className="text-xl font-medium">Upload History</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-3">
                                    {uploadHistory.map((item, index) => (
                                        <div
                                            key={item.id}
                                            className={`border rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm ${animateList ? 'animate-fadeIn opacity-0' : 'opacity-100'
                                                }`}
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            <div
                                                className="flex items-center justify-between p-4 cursor-pointer"
                                                onClick={() => handleFileSelect(item)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                                        <FileText className="h-6 w-6 text-blue-500 dark:text-blue-300" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{item.filename}</p>
                                                        <div className="flex items-center text-sm text-gray-500 gap-2">
                                                            <span>{item.date}</span>
                                                            <span>•</span>
                                                            <span>{item.size}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full ${item.status === 'complete'
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                                        }`}>
                                                        {getStatusIcon(item.status)}
                                                        {item.status === 'complete' ? 'Completed' : 'Failed'}
                                                    </span>
                                                    <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${selectedFile === item.id ? 'rotate-90' : ''
                                                        }`} />
                                                </div>
                                            </div>

                                            {selectedFile === item.id && (
                                                <div className="p-4 pt-0 border-t mt-2 animate-slideDown bg-gray-50 dark:bg-gray-700/50">
                                                    <div className="flex items-center justify-end gap-3">
                                                        {item.status === 'complete' && (
                                                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-300">
                                                                <Download className="h-4 w-4" />
                                                                Download
                                                            </button>
                                                        )}
                                                        <button className="flex items-center gap-2 px-4 py-2 border border-red-300 hover:bg-red-50 text-red-500 rounded-md transition-colors duration-300 dark:hover:bg-red-900/30">
                                                            <Trash2 className="h-4 w-4" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="settings" className="mt-0 transition-all duration-500 transform">
                        <Card className="bg-white dark:bg-gray-800 shadow-xl border-0 overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                <CardTitle className="text-xl font-medium">Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <p className="text-center text-gray-500 dark:text-gray-400">Settings panel coming soon</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default FileUploadPage;