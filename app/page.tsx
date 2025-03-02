'use client';

import { useState } from 'react';
import FileUploader from '@/components/convert';

import Navbar from '@/components/pages/nav';
import Footer from '@/components/pages/footer';
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
      <Footer/>
    </div>
  );
}
