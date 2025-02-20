import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';
import { Readable } from 'stream';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            console.error('No file uploaded');
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Define paths for saving files
        const uploadDir = path.join(process.cwd(), 'tmp/uploads');
        const markdownDir = path.join(process.cwd(), 'tmp/markdown');

        // Ensure directories exist
        if (!fs.existsSync(uploadDir)) {
            console.log('Creating upload directory:', uploadDir);
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        if (!fs.existsSync(markdownDir)) {
            console.log('Creating markdown directory:', markdownDir);
            fs.mkdirSync(markdownDir, { recursive: true });
        }

        // Save file to the upload directory
        const filePath = path.join(uploadDir, file.name);
        console.log('Saving file to:', filePath);

        // Convert ReadableStream to Node.js stream
        const readableStream = file.stream();
        // Convert ReadableStream to Node.js stream with proper typing
        const nodeReadableStream = Readable.fromWeb(readableStream as any);

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
        console.log('File saved successfully:', filePath);

        // Read the file back as a buffer
        const fileBuffer = fs.readFileSync(filePath);
        console.log('File buffer read successfully');

        // Parse the PDF
        const data = await pdf(fileBuffer);

        // Generate markdown file
        const markdownContent = `# Extracted Text\n\n${data.text}`;
        const markdownFileName = file.name.replace('.pdf', '.md');
        const markdownFilePath = path.join(markdownDir, markdownFileName);
        console.log('Writing markdown file to:', markdownFilePath);

        try {
            fs.writeFileSync(markdownFilePath, markdownContent);
            console.log('Markdown file created successfully:', markdownFilePath);
        } catch (err) {
            console.error('Failed to create markdown file:', err);
            return NextResponse.json({ error: 'Failed to create markdown file' }, { status: 500 });
        }

        // Verify markdown file existence
        if (!fs.existsSync(markdownFilePath)) {
            console.error('Markdown file not found:', markdownFilePath);
            return NextResponse.json({ error: 'Markdown file not found' }, { status: 500 });
        }

        // Return the response with file paths
        return NextResponse.json({
            message: 'File uploaded successfully',
            pdfFilePath: filePath,
            markdownFilePath: markdownFilePath,
        });

    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }
}
