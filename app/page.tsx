'use client';

import { useState } from 'react';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import FileUploader from '@/components/uploader';
import { COMPANY_DETAILS } from '@/utils/constants';
import Navbar from '@/components/pages/nav';

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="flex flex-col items-center justify-between min-h-screen ">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-lg shadow-2xl rounded-2xl p-6 transition-transform transform hover:scale-105">
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold ">Welcome to {COMPANY_DETAILS.name}!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6  text-lg">{COMPANY_DETAILS.slogan || "Simplifying your file conversion."}</p>
            <FileUploader />
            <div className="mt-6">
              
            </div>
          </CardContent>
          <CardFooter className="text-center  mt-6">
            © {COMPANY_DETAILS.year} {COMPANY_DETAILS.name}. All rights reserved.
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
