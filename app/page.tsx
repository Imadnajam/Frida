'use client';

import { useState } from 'react';

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import FileUploader from '@/components/convert';
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
       <FileUploader />
            
          
      </div>
    </div>
  );
}
