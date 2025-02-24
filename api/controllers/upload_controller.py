import os
from fastapi import UploadFile, HTTPException
from fastapi.responses import JSONResponse
from PyPDF2 import PdfReader
import openai
from dotenv import load_dotenv


load_dotenv()

openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    raise ValueError("OPENAI_API_KEY environment variable is not set.")
openai.api_key = openai_api_key

# Constants
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


async def extract_text_from_pdf(file: UploadFile) -> str:
    """Extract text from a PDF file."""
    pdf_reader = PdfReader(file.file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text


async def generate_ai_summary(text: str) -> str:
    """Generate a summary of the text using OpenAI's GPT-4."""
    try:
        response = openai.ChatCompletion.create(
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
        return response["choices"][0]["message"]["content"]
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to generate AI summary: {str(e)}"
        )


async def handle_file_upload(file: UploadFile):
    """Handle file upload, extract text, and generate AI summary."""
    try:
        # Validate file presence
        if not file:
            raise HTTPException(status_code=400, detail="No file uploaded")

        # Validate file type
        if file.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")

        # Validate file size
        file.file.seek(0, 2)  # Move to the end of the file
        file_size = file.file.tell()  # Get file size
        file.file.seek(0)  # Reset file pointer
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File size exceeds {MAX_FILE_SIZE / 1024 / 1024} MB",
            )

        # Extract text from PDF
        text = await extract_text_from_pdf(file)
        if not text:
            raise HTTPException(
                status_code=500, detail="Failed to extract text from PDF"
            )

        # Generate AI summary
        summary = await generate_ai_summary(text)

        # Format Markdown content
        markdown_content = f"# Extracted Text\n\n{text}\n\n# AI Summary\n\n{summary}"

        # Return the response
        return JSONResponse(
            status_code=200,
            content={
                "message": "File processed successfully",
                "markdownContent": markdown_content,
                "aiSummary": summary,
            },
        )

    except HTTPException:
        raise  
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")
