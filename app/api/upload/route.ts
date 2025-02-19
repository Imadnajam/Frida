import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';
import { Readable } from 'stream';
import { ReadableStream } from 'web-streams-polyfill';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Define paths for saving files
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        const markdownDir = path.join(process.cwd(), 'public/markdown');

        // Ensure directories exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        if (!fs.existsSync(markdownDir)) {
            fs.mkdirSync(markdownDir, { recursive: true });
        }

        // Save file to the upload directory
        const filePath = path.join(uploadDir, file.name);
        console.log('Saving file to:', filePath);

        // Convert ReadableStream to Node.js stream
        const readableStream = file.stream();
        const nodeReadableStream = Readable.fromWeb(readableStream as unknown as ReadableStream);

        // Pipe the stream to the file system
        const writeStream = fs.createWriteStream(filePath);
        await new Promise((resolve, reject) => {
            nodeReadableStream.pipe(writeStream);
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
        });

        // Check if the file exists after being saved
        if (!fs.existsSync(filePath)) {
            console.error('File not found after upload:', filePath);
            return NextResponse.json({ error: 'Failed to save the file' }, { status: 500 });
        }

        // Read the file back as a buffer
        const fileBuffer = fs.readFileSync(filePath);
        console.log('File buffer read successfully');

        // Parse the PDF
        const data = await pdf(fileBuffer);

        // Generate markdown file
        const markdownContent = `# Extracted Text\n\n${data.text}`;
        const markdownFileName = file.name.replace('.pdf', '.md');
        const markdownFilePath = path.join(markdownDir, markdownFileName);
        fs.writeFileSync(markdownFilePath, markdownContent);

        // Return the response with file paths
        return NextResponse.json({
            message: 'File uploaded successfully',
            filePath: `/uploads/${file.name}`,
            markdownFile: `/markdown/${path.basename(markdownFilePath)}`
        });
    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }
}