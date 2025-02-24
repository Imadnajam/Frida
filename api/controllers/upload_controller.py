import os
from fastapi import UploadFile, HTTPException
from fastapi.responses import JSONResponse
from PyPDF2 import PdfReader
from transformers import AutoModelForCausalLM, AutoTokenizer  # For GPT-NeoX
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Constants
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
MODEL_NAME = "EleutherAI/gpt-neo-125M"  # Smaller model
try:
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForCausalLM.from_pretrained(MODEL_NAME)
except Exception as e:
    print("Error loading GPT-NeoX model:", str(e))
    raise RuntimeError("Failed to load GPT-NeoX model.")


async def extract_text_from_pdf(file: UploadFile) -> str:
    """Extract text from a PDF file."""
    try:
        pdf_reader = PdfReader(file.file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    except Exception as e:
        print("Error extracting text from PDF:", str(e))
        raise HTTPException(
            status_code=500, detail=f"Error extracting text from PDF: {str(e)}"
        )


async def generate_ai_summary(text: str) -> str:
    """Generate a summary of the text using GPT-NeoX."""
    try:
        # Tokenize input text
        inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)

        # Generate summary using GPT-NeoX
        outputs = model.generate(
            **inputs,
            max_length=200,  # Adjust max_length as needed
            num_return_sequences=1,
            no_repeat_ngram_size=2,
            early_stopping=True,
        )

        # Decode the generated summary
        summary = tokenizer.decode(outputs[0], skip_special_tokens=True)
        return summary
    except Exception as e:
        print("GPT-NeoX Error:", str(e))
        raise HTTPException(status_code=500, detail=f"GPT-NeoX Error: {str(e)}")


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
        raise  # Re-raise HTTPException to return specific error responses
    except Exception as e:
        print("Unexpected error:", str(e))
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")
