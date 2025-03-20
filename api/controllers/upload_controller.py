from fastapi import UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from PyPDF2 import PdfReader
from transformers import AutoModelForCausalLM, AutoTokenizer
import re
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants
MAX_FILE_SIZE = 10 * 1024 * 1024
MODEL_NAME = "EleutherAI/gpt-neo-125M"

# Lazy loading for tokenizer and model
tokenizer = None
model = None


def load_model():
    global tokenizer, model
    if tokenizer is None or model is None:
        try:
            logger.info(f"Loading model: {MODEL_NAME}")
            tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
            if tokenizer.pad_token is None:
                tokenizer.pad_token = tokenizer.eos_token

            # Standard loading without Accelerate options
            model = AutoModelForCausalLM.from_pretrained(MODEL_NAME)
            logger.info("Model loaded successfully")
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}", exc_info=True)
            raise RuntimeError(f"Failed to load model: {str(e)}")


# Utility function to clean text
def clean_text(text: str) -> str:
    cleaned_text = re.sub(r"[\$\^*\\_\[\]{}()~#]", "", text)
    cleaned_text = " ".join(cleaned_text.split())
    return cleaned_text


# Extract text from PDF
async def extract_text_from_pdf(file: UploadFile) -> str:
    try:
        logger.info("Extracting text from PDF")
        pdf_reader = PdfReader(file.file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        logger.info(f"Extracted {len(text)} characters of text")
        return text
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500, detail=f"Error extracting text from PDF: {str(e)}"
        )


# Generate AI summary using GPT-NeoX
async def generate_ai_summary(text: str) -> str:
    try:
        # Load model if not already loaded
        load_model()

        logger.info("Creating prompt")
        # Create the prompt
        prompt = (
            "Provide a detailed summary of the following text. "
            "Include key points, data, and insights. "
            "Explain the main ideas, supporting evidence, and conclusions.\n\n"
            f"{text[:4000]}"  
        )

        logger.info("Tokenizing input")
        # Tokenize the input
        inputs = tokenizer(
            prompt,
            return_tensors="pt",
            truncation=True,
            max_length=1024,
        )

        logger.info("Generating summary")
        # Generate summary with reduced parameters for efficiency
        outputs = model.generate(
            **inputs,
            max_new_tokens=200,  # Reduced from 500 to prevent timeouts
            num_beams=3,  # Reduced from 5 to be more efficient
            early_stopping=True,
            no_repeat_ngram_size=2,
        )

        logger.info("Decoding summary")
        # Decode the generated summary
        summary = tokenizer.decode(outputs[0], skip_special_tokens=True)
        return summary
    except Exception as e:
        logger.error(f"Error generating AI summary: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500, detail=f"Error generating AI summary: {str(e)}"
        )


# File upload endpoint
async def handle_file_upload(file: UploadFile = File(...)):
    try:
        logger.info(f"Starting file upload process for: {file.filename}")

        # Validate file presence
        if not file:
            logger.warning("No file uploaded")
            raise HTTPException(status_code=400, detail="No file uploaded")

        # Validate file type
        if file.content_type != "application/pdf":
            logger.warning(f"Invalid file type: {file.content_type}")
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")

        # Validate file size
        file.file.seek(0, 2)
        file_size = file.file.tell()
        file.file.seek(0)
        logger.info(f"File size: {file_size / 1024 / 1024:.2f} MB")

        if file_size > MAX_FILE_SIZE:
            logger.warning(f"File size exceeds limit: {file_size / 1024 / 1024:.2f} MB")
            raise HTTPException(
                status_code=400,
                detail=f"File size exceeds {MAX_FILE_SIZE / 1024 / 1024} MB",
            )

        # Extract text from PDF
        text = await extract_text_from_pdf(file)
        if not text:
            logger.warning("No text extracted from PDF")
            raise HTTPException(
                status_code=500, detail="Failed to extract text from PDF"
            )

        # Clean the extracted text
        logger.info("Cleaning extracted text")
        cleaned_text = clean_text(text)

       
        markdown_code_block = (
            f"```\n{cleaned_text[:2000]}...\n```"  
        )

        # Generate AI summary
        logger.info("Generating AI summary")
        summary = await generate_ai_summary(cleaned_text)

        # Return the response
        logger.info("Processing complete, returning response")
        return JSONResponse(
            status_code=200,
            content={
                "message": "File processed successfully",
                "markdownContent": markdown_code_block,
                "aiSummary": summary,
            },
        )
    except HTTPException as he:
        # Pass through HTTP exceptions
        logger.warning(f"HTTP Exception: {he.detail}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")
