'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

import  FileUploader from "@/components/uploader";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]); // Store array of files

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Welcome, Imad!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">This is a sample page using ShadCN components.</p>
          <FileUploader />
          <Button variant="default">Click me</Button>
        </CardContent>

       

        <CardFooter className="text-sm text-gray-500">
          © 2025 Your Company
        </CardFooter>
      </Card>
    </div>
  );
}
