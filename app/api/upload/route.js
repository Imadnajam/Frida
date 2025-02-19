import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import pdf from "pdf-parse";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");

        console.log("Received file:", file);

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Storage paths
        const uploadDir = path.join(process.cwd(), "public/uploads");
        const markdownDir = path.join(process.cwd(), "public/markdown");

        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        if (!fs.existsSync(markdownDir)) fs.mkdirSync(markdownDir, { recursive: true });

        // Save file
        const filePath = path.join(uploadDir, file.name);
        fs.writeFileSync(filePath, buffer);
        console.log("File saved at:", filePath);

        // Convert PDF to Markdown
        let markdownFilePath = null;
        if (file.name.endsWith(".pdf")) {
            const data = await pdf(buffer);
            console.log("Extracted text:", data.text);

            const markdownContent = `# Extracted Text\n\n${data.text}`;
            const markdownFileName = file.name.replace(".pdf", ".md");
            markdownFilePath = path.join(markdownDir, markdownFileName);
            fs.writeFileSync(markdownFilePath, markdownContent);
            console.log("Markdown saved at:", markdownFilePath);
        }

        return NextResponse.json({
            message: "File uploaded successfully",
            filePath: `/uploads/${file.name}`,
            markdownFile: markdownFilePath ? `/markdown/${path.basename(markdownFilePath)}` : null
        });
    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }
}
