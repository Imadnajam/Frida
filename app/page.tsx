'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ThemeModeToggle } from "@/components/ThemeModeToggle";
import FileUploader from "@/components/uploader";
import { COMPANY_DETAILS } from "@/utils/constants"; 

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <ThemeModeToggle
        messages={{
          dark: "Dark",
          light: "Light",
          system: "System",
        }}
      />
      <Card className="w-full max-w-md p-6 shadow-md rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Welcome!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">This is a sample page using ShadCN components.</p>
          <FileUploader />
          <Button variant="default">Click me</Button>
        </CardContent>
        <CardFooter className="text-sm">
          © {COMPANY_DETAILS.year} {COMPANY_DETAILS.name}
        </CardFooter>
      </Card>
    </div>
  );
}
