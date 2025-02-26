import io
import re
import json
import base64
import csv
import PyPDF2
import mammoth
import openpyxl
import html2text
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
from PIL import Image
from fastapi import UploadFile, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Optional, Union


class ConversionResult(BaseModel):
    markdown: str
    metadata: Dict[str, Union[str, int, float, List[str], Dict[str, str]]]
    content_type: str
    preview: Optional[str] = None


def clean_text(text: str) -> str:
    """Clean extracted text for better markdown compatibility"""
    # Remove excessive whitespace
    cleaned_text = re.sub(r"\s+", " ", text)
    # Remove control characters
    cleaned_text = re.sub(r"[\x00-\x1F\x7F]", "", cleaned_text)
    # Replace tabs with spaces
    cleaned_text = cleaned_text.replace("\t", "    ")
    # Ensure proper line breaks
    cleaned_text = re.sub(r"(\r\n|\r|\n){3,}", "\n\n", cleaned_text)
    return cleaned_text.strip()


async def convert_pdf_to_markdown(file: UploadFile) -> ConversionResult:
    """Convert PDF files to markdown"""
    try:
        pdf_reader = PyPDF2.PdfReader(file.file)
        text = ""
        metadata = {
            "page_count": len(pdf_reader.pages),
            "title": file.filename,
        }

        # Extract text from all pages
        for page_num, page in enumerate(pdf_reader.pages):
            page_text = page.extract_text()
            if page_text:
                text += f"\n\n## Page {page_num + 1}\n\n{page_text}"

        # Get document info if available
        if pdf_reader.metadata:
            info = pdf_reader.metadata
            if info.title:
                metadata["title"] = info.title
            if info.author:
                metadata["author"] = info.author
            if info.subject:
                metadata["subject"] = info.subject
            if info.creator:
                metadata["creator"] = info.creator

        # Clean the text
        markdown_text = clean_text(text)

        # Format with proper markdown
        markdown_text = f"# {metadata.get('title', 'PDF Document')}\n\n{markdown_text}"

        return ConversionResult(
            markdown=markdown_text, metadata=metadata, content_type="application/pdf"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error converting PDF: {str(e)}")


# ...other conversion functions (convert_docx_to_markdown, convert_txt_to_markdown, etc.)...


async def convert_unknown_to_markdown(file: UploadFile) -> ConversionResult:
    """Handle unknown file types by providing basic info"""
    try:
        content = await file.read()
        file.file.seek(0)

        # Try to detect if it's a text file
        is_text = True
        try:
            text = content.decode("utf-8", errors="strict")
            # If more than 10% of characters are null or control, likely binary
            control_chars = sum(
                1 for c in text if ord(c) < 32 and c not in ["\n", "\r", "\t"]
            )
            if control_chars / len(text) > 0.1:
                is_text = False
        except UnicodeDecodeError:
            is_text = False

        if is_text:
            # It's a text file we can display
            text = content.decode("utf-8", errors="replace")
            markdown_text = f"# File: {file.filename}\n\n```\n{text[:10000]}\n```"
            if len(text) > 10000:
                markdown_text += (
                    "\n\n*Note: File truncated, showing first 10,000 characters*"
                )
        else:
            # It's a binary file we can't display
            file_size = len(content)
            markdown_text = f"# Binary File: {file.filename}\n\n- **Size**: {file_size} bytes ({file_size/1024/1024:.2f} MB)\n- **Type**: {file.content_type or 'Unknown'}\n\n*This file appears to be binary and cannot be displayed as text.*"

        return ConversionResult(
            markdown=markdown_text,
            metadata={
                "filename": file.filename,
                "content_type": file.content_type or "application/octet-stream",
                "size": len(content),
            },
            content_type=file.content_type or "application/octet-stream",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error processing unknown file: {str(e)}"
        )
