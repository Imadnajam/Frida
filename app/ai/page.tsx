"use client";

import { useState } from "react";
import FileUploaderTest from "@/components/uploader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Settings } from "lucide-react";
import Navbar from "@/components/pages/nav";
const FileUploadPage = () => {
    const [activeTab, setActiveTab] = useState("upload");

    return (
        <div>
         <Navbar />
        <div className="min-h-screen">
            <div className="container mx-auto py-8 px-4 max-w-5xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-2 text-main">Document Processor</h1>
                    <p className="text-foreground">Upload PDFs to convert them to markdown and get AI summaries</p>
                </div>

                <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="flex justify-center mb-6">
                        <TabsList className="grid grid-cols-2 w-full max-w-md bg-secondary-background shadow-[var(--shadow)]">
                            <TabsTrigger value="upload" className="flex items-center gap-2 transition-all duration-200 data-[state=active]:bg-main data-[state=active]:text-main-foreground">
                                <FileText className="h-4 w-4" />
                                <span>Upload</span>
                            </TabsTrigger>
                            <TabsTrigger value="settings" className="flex items-center gap-2 transition-all duration-200 data-[state=active]:bg-main data-[state=active]:text-main-foreground">
                                <Settings className="h-4 w-4" />
                                <span>Settings</span>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="upload" className="mt-0 transition-all duration-500 transform">
                        <Card className="bg-secondary-background border border-border shadow-[var(--shadow)] rounded-[var(--border-radius)]">
                            <CardHeader className="bg-main text-main-foreground">
                                <CardTitle className="text-xl font-[var(--heading-font-weight)]">Upload Document</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <FileUploaderTest />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="settings" className="mt-0 transition-all duration-500 transform">
                        <Card className="bg-secondary-background border border-border shadow-[var(--shadow)] rounded-[var(--border-radius)]">
                            <CardHeader className="bg-main text-main-foreground">
                                <CardTitle className="text-xl font-[var(--heading-font-weight)]">Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <p className="text-center text-foreground/70">Settings panel coming soon</p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
            </div>
        </div>
    );
};

export default FileUploadPage;