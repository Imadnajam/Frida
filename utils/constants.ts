export const COMPANY_DETAILS = {
    name: "Frida",
    year: 2025,
    slogan: "Simplifying Document Conversion",
    mission: "To provide fast, reliable, and efficient document-to-Markdown conversions for developers, writers, and project managers.",
    website: "https://frida2.vercel.app/",
    email: "#",
    phone: "+212121212",
    address: {
        street: "404",
        city: "404",
        state: "CA",
        country: "Ma",
        zip: "14"
    },
    socialMedia: {
        twitter: "#",
        github: "https://github.com/Imadnajam/Frida",
        discord: "#"
    },
    team: [
        { name: "Imad Najam", role: "Founder & Lead Developer" },
    ],
    supportedFileFormats: ["DOCX", "XLSX", "PPTX", "PDF", "TXT"],
    features: [
        "Real-time Preview",
        "Customizable Conversion Options",
        "FastAPI Backend for High-Speed Conversion",
        "File History for Easy Access",
        "Modern and Responsive UI"
    ],
    license: "MIT"
};
export const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

import React from "react";
import { Paperclip, FileText, FileImage, Table } from "lucide-react";

export const getFileIcon = (fileType: string) => {
    if (!fileType) return React.createElement(Paperclip);

    if (fileType.includes('pdf')) return React.createElement(FileText, { className: "text-red-500" });
    if (fileType.includes('word')) return React.createElement(FileText, { className: "text-blue-500" });
    if (fileType.includes('sheet') || fileType.includes('csv')) return React.createElement(Table, { className: "text-green-500" });
    if (fileType.includes('image')) return React.createElement(FileImage, { className: "text-purple-500" });
    return React.createElement(Paperclip);
};