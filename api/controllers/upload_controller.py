from fastapi import UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pdfplumber import PDF  
from transformers import pipeline  # Simplified interface
import re
import logging
import asyncio
from functools import lru_cache
from typing import Optional

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants with environment-based fallbacks
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
MODEL_NAME = "pszemraj/led-base-book-summary"  # More suitable model
ANALYSIS_TYPES = {
    "conceptual_gaps": "Identify conceptual gaps and unclear claims",
    "missing_evidence": "Highlight missing evidence in arguments",
    "structure_issues": "Analyze document structure problems",
}

# Smart text chunking parameters
CHUNK_SIZE = 3500
OVERLAP = 200


class SummaryGenerator:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.initialize_model()
        return cls._instance

    def initialize_model(self):
        """Smart model loading with memory management"""
        try:
            logger.info(f"Loading model: {MODEL_NAME}")
            self.summarizer = pipeline(
                "summarization",
                model=MODEL_NAME,
                device_map="auto",  # Optimize for available hardware
                truncation=True,
            )
            logger.info("Model loaded successfully")
        except Exception as e:
            logger.error(f"Model loading failed: {str(e)}")
            raise RuntimeError(f"Model initialization error: {str(e)}")

    async def generate_summary(
        self, text: str, analysis_type: str = "conceptual_gaps"
    ) -> str:
        """Smart generation with chunking and analysis type handling"""
        try:
            cleaned_text = self.clean_text(text)
            chunks = self.chunk_text(cleaned_text)

            # Adaptive prompt generation
            base_prompt = ANALYSIS_TYPES.get(
                analysis_type, "Analyze this text for conceptual issues"
            )

            results = []
            for chunk in chunks:
                result = await asyncio.to_thread(
                    self.summarizer,
                    f"{base_prompt}:\n{chunk}",
                    max_length=400,
                    min_length=100,
                    do_sample=False,
                    repetition_penalty=2.0,
                )
                results.append(result[0]["summary_text"])

            return self.postprocess_results(results)

        except Exception as e:
            logger.error(f"Generation error: {str(e)}")
            raise

    def chunk_text(self, text: str) -> list:
        """Smart text chunking with overlap"""
        return [
            text[i : i + CHUNK_SIZE] for i in range(0, len(text), CHUNK_SIZE - OVERLAP)
        ]

    def clean_text(self, text: str) -> str:
        """Improved text cleaning with regex optimization"""
        return re.sub(r"\s+", " ", re.sub(r"[^\w\s-]", "", text)).strip()

    def postprocess_results(self, results: list) -> str:
        """Ensures coherent final output from multiple chunks"""
        return "\n\n".join([f"Section {i+1}: {text}" for i, text in enumerate(results)])


async def handle_file_upload(file: UploadFile = File(...)):
    """Optimized handler with smart features"""
    try:
        # Validate input with early returns
        if not validate_file(file):
            return JSONResponse(
                status_code=400, content={"error": "Invalid file input"}
            )

        # Parallel processing
        text_task = asyncio.create_task(extract_text_from_pdf(file))
        summary_task = asyncio.create_task(
            SummaryGenerator().generate_summary(await text_task)
        )

        # Timeout handling
        try:
            summary = await asyncio.wait_for(summary_task, timeout=120)
        except asyncio.TimeoutError:
            logger.warning("Processing timeout")
            return JSONResponse(
                status_code=504, content={"error": "Processing timeout"}
            )

        return create_response(text_task.result(), summary)

    except Exception as e:
        logger.error(f"Processing error: {str(e)}")
        return JSONResponse(
            status_code=500, content={"error": f"Processing failed: {str(e)}"}
        )


def validate_file(file: UploadFile) -> bool:
    """Comprehensive validation with smart checks"""
    if file.content_type != "application/pdf":
        return False
    if file.size > MAX_FILE_SIZE:
        return False
    return True


async def extract_text_from_pdf(file: UploadFile) -> str:
    """Improved text extraction with pdfplumber"""
    try:
        with PDF.open(file.file) as pdf:
            return "\n".join(
                [page.extract_text(x_tolerance=1, y_tolerance=1) for page in pdf.pages]
            )
    except Exception as e:
        logger.error(f"PDF error: {str(e)}")
        raise HTTPException(500, "PDF processing failed")


def create_response(raw_text: str, summary: str) -> JSONResponse:
    """Smart response formatting with adaptive preview"""
    preview_length = 2000 if len(raw_text) > 5000 else 1000
    return JSONResponse(
        {
            "summary": summary,
            "preview": {
                "text": raw_text[:preview_length],
                "truncated": len(raw_text) > preview_length,
            },
            "stats": {"original_length": len(raw_text), "summary_length": len(summary)},
        }
    )
