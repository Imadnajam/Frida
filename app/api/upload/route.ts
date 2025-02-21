import { NextResponse } from 'next/server';
import pdf from 'pdf-parse';
import { Readable } from 'stream';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            console.error('❌ No file uploaded');
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Convert ReadableStream to Node.js stream
        const readableStream = file.stream();
        const nodeReadableStream = Readable.fromWeb(readableStream as any);

        // Read the stream to a buffer
        const chunks: Buffer[] = [];
        for await (const chunk of nodeReadableStream) {
            chunks.push(Buffer.from(chunk));
        }
        const fileBuffer = Buffer.concat(chunks.map(chunk => new Uint8Array(chunk)));

        if (!fileBuffer || fileBuffer.length === 0) {
            console.error('❌ File buffer is empty');
            return NextResponse.json({ error: 'File buffer is empty' }, { status: 500 });
        }

        // Parse the PDF
        const data = await pdf(fileBuffer);

        if (!data.text) {
            console.error('❌ Failed to extract text from PDF');
            return NextResponse.json({ error: 'Failed to extract text from PDF' }, { status: 500 });
        }

        // Generate markdown content
        const markdownContent = `# Extracted Text\n\n${data.text}`;
        console.log('✅ Markdown content generated successfully');

        // Return the markdown content as a response
        return NextResponse.json({
            message: 'File processed successfully',
            markdownContent,
        });

    } catch (error) {
        console.error('❌ Upload Error:', error);
        return NextResponse.json({ error: 'Failed to process file' }, { status: 500 });
    }
}
