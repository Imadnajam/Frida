"use client";

import { useState } from "react";
import FileUploaderTest from "@/components/uploader"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, History, Settings } from "lucide-react";

const FileUploadPage = () => {
    const [activeTab, setActiveTab] = useState("upload");
    const [uploadHistory, setUploadHistory] = useState([
        { id: 1, filename: "report.pdf", date: "2025-03-15", status: "complete" },
        { id: 2, filename: "document.pdf", date: "2025-03-12", status: "complete" },
        { id: 3, filename: "presentation.pdf", date: "2025-03-08", status: "failed" }
    ]);

    return (
        <div className="container mx-auto py-8 px-4 max-w-5xl">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Document Processor</h1>
                <p className="text-gray-500">Upload PDFs to convert them to markdown and get AI summaries</p>
            </div>

            <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex justify-center mb-6">
                    <TabsList className="grid grid-cols-3 w-full max-w-md">
                        <TabsTrigger value="upload" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span>Upload</span>
                        </TabsTrigger>
                        <TabsTrigger value="history" className="flex items-center gap-2">
                            <History className="h-4 w-4" />
                            <span>History</span>
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            <span>Settings</span>
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="upload" className="mt-0">
                    <Card className="bg-white shadow-lg border-0">
                        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                            <CardTitle className="text-xl font-medium">Upload Document</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <FileUploaderTest />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="history" className="mt-0">
                    <Card className="bg-white shadow-lg border-0">
                        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                            <CardTitle className="text-xl font-medium">Upload History</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                {uploadHistory.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FileText className="h-6 w-6 text-blue-500" />
                                            <div>
                                                <p className="font-medium">{item.filename}</p>
                                                <p className="text-sm text-gray-500">{item.date}</p>
                                            </div>
                                        </div>
                                        <span className={`text-sm px-2 py-1 rounded-full ${item.status === 'complete' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {item.status === 'complete' ? 'Completed' : 'Failed'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings" className="mt-0">
                    <Card className="bg-white shadow-lg border-0">
                        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                            <CardTitle className="text-xl font-medium">Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <p className="text-center text-gray-500">Settings panel coming soon</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default FileUploadPage;