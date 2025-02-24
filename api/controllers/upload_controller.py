import os
from fastapi import UploadFile, HTTPException
from fastapi.responses import JSONResponse
from PyPDF2 import PdfReader
import openai  
load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")


async def handle_file_upload(file: UploadFile):
    try:
        if not file:
            raise HTTPException(status_code=400, detail="No file uploaded")

        # Check if the file is a PDF
        if file.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")

        # Read the PDF file
        pdf_reader = PdfReader(file.file)
        text = ""

        # Extract text from each page
        for page in pdf_reader.pages:
            text += page.extract_text()

        # Check if text was extracted
        if not text:
            raise HTTPException(
                status_code=500, detail="Failed to extract text from PDF"
            )

        ai_response = openai.ChatCompletion.create(
            model="gpt-4",  
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {
                    "role": "user",
                    "content": f"Summarize the following text in a concise manner:\n\n{text}",
                },
            ],
            max_tokens=500,
        )

        # Get the AI-generated summary
        summary = ai_response["choices"][0]["message"]["content"]

        # Convert text to Markdown format with AI summary
        markdown_content = f"# Extracted Text\n\n{text}\n\n# AI Summary\n\n{summary}"

        # Return the Markdown content
        return JSONResponse(
            status_code=200,
            content={
                "message": "File processed successfully",
                "markdownContent": markdown_content,
                "aiSummary": summary,
            },
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")
