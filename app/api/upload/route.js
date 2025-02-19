import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Define storage directory (e.g., public/uploads)
        const uploadDir = path.join(process.cwd(), "public/uploads");

        // Ensure directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Save file
        const filePath = path.join(uploadDir, file.name);
        fs.writeFileSync(filePath, buffer);

        return NextResponse.json({ message: "File uploaded successfully", filePath: `/uploads/${file.name}` });
    } catch (error) {
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }
}
