import os
from fastapi import UploadFile, HTTPException
from fastapi.responses import JSONResponse
from PyPDF2 import PdfReader
from transformers import AutoModelForCausalLM, AutoTokenizer  
from dotenv import load_dotenv
import re

load_dotenv()

# Constants
MAX_FILE_SIZE = 10 * 1024 * 1024  
MODEL_NAME = "EleutherAI/gpt-neo-125M"  
try:
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForCausalLM.from_pretrained(MODEL_NAME)
except Exception as e:
    print("Error loading GPT-NeoX model:", str(e))
    raise RuntimeError("Failed to load GPT-NeoX model.")


def clean_text(text: str) -> str:
    
    cleaned_text = re.sub(r"[\$\^*\\_\[\]{}()~#]", "", text)
    cleaned_text = " ".join(cleaned_text.split())

    return cleaned_text


async def extract_text_from_pdf(file: UploadFile) -> str:

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
        # Internal prompt (not included in the output)
        prompt = (
            "Provide a detailed summary of the following text. "
            "Include key points, data, and insights. "
            "Explain the main ideas, supporting evidence, and conclusions.\n\n"
            f"{text}"
        )

        # Tokenize the input text (using the internal prompt)
        inputs = tokenizer(
            prompt, return_tensors="pt", truncation=True, max_length=1024
        )

        # Generate summary using GPT-NeoX
        outputs = model.generate(
            **inputs,
            max_length=500,  
            num_return_sequences=1,
            no_repeat_ngram_size=2,
            early_stopping=True,
            temperature=0.7,  
            top_p=0.9,  
        )

        # Decode the generated summary
        summary = tokenizer.decode(outputs[0], skip_special_tokens=True)
        return summary
    except Exception as e:
        print("GPT-NeoX Error:", str(e))
        raise HTTPException(status_code=500, detail=f"GPT-NeoX Error: {str(e)}")


async def handle_file_upload(file: UploadFile):
    """Handle file upload, extract text, clean it, and generate AI summary."""
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

        # Clean the extracted text
        cleaned_text = clean_text(text)

        # Generate AI summary
        summary = await generate_ai_summary(cleaned_text)

        # Return the response
        return JSONResponse(
            status_code=200,
            content={
                "message": "File processed successfully",
                "markdownContent": cleaned_text,
                "aiSummary": summary,
            },
        )

    except HTTPException:
        raise  
    except Exception as e:
        print("Unexpected error:", str(e))
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")
