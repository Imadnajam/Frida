import os
import io
import re
import json
import base64
from typing import Dict, List, Optional, Tuple, Union

from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from fastapi.responses import JSONResponse
from pydantic import BaseModel

# File processing libraries
import docx2txt
import csv
import PyPDF2
import mammoth
import openpyxl
import markdown
import html2text
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
from PIL import Image

from api.controllers.conversion_controller import (
    convert_pdf_to_markdown,
    convert_docx_to_markdown,
    convert_txt_to_markdown,
    convert_html_to_markdown,
    convert_csv_to_markdown,
    convert_json_to_markdown,
    convert_xlsx_to_markdown,
    convert_image_to_markdown,
    convert_xml_to_markdown,
    convert_unknown_to_markdown,
)


# Type definitions for clarity
class ConversionResult(BaseModel):
    markdown: str
    metadata: Dict[str, Union[str, int, float, List[str], Dict[str, str]]]
    content_type: str
    preview: Optional[str] = None


# Constants
MAX_FILE_SIZE = 20 * 1024 * 1024  # 20MB
SUPPORTED_FORMATS = {
    # Documents
    "application/pdf": "pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/msword": "doc",
    "text/plain": "txt",
    "text/markdown": "md",
    "text/html": "html",
    "text/xml": "xml",
    "application/json": "json",
    "text/csv": "csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    # Images
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/svg+xml": "svg",
    # Other
    "application/rtf": "rtf",
}

# File converter router
router = APIRouter()


def create_error_response(status_code: int, detail: str) -> JSONResponse:
    """Create a standardized error response"""
    return JSONResponse(
        status_code=status_code, content={"success": False, "error": detail}
    )


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


def extract_metadata(file: UploadFile, content_type: str) -> Dict:
    """Extract metadata from files based on their type"""
    basic_metadata = {
        "filename": file.filename,
        "content_type": content_type,
        "size": 0,  # Will be updated after processing
    }

    # Return for now, will be extended when processing specific file types
    return basic_metadata


@router.post("/convert")
async def convert_to_markdown(file: UploadFile = File(...)):
    """
    Convert various file formats to Markdown.
    Supports PDF, DOCX, TXT, HTML, CSV, JSON, XLSX, images, and more.
    """
    try:
        # Validate file presence
        if not file:
            return create_error_response(400, "No file uploaded")

        # Get file content type
        content_type = file.content_type or "application/octet-stream"

        # Validate file size
        file.file.seek(0, 2)  # Move to the end of the file
        file_size = file.file.tell()  # Get file size
        file.file.seek(0)  # Reset file pointer
        if file_size > MAX_FILE_SIZE:
            return create_error_response(
                400, f"File size exceeds {MAX_FILE_SIZE / 1024 / 1024} MB"
            )

        # Choose converter based on content type
        if content_type == "application/pdf":
            result = await convert_pdf_to_markdown(file)
        elif content_type in [
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/msword",
        ]:
            result = await convert_docx_to_markdown(file)
        elif content_type == "text/plain":
            result = await convert_txt_to_markdown(file)
        elif content_type == "text/html":
            result = await convert_html_to_markdown(file)
        elif content_type == "text/csv":
            result = await convert_csv_to_markdown(file)
        elif content_type == "application/json":
            result = await convert_json_to_markdown(file)
        elif (
            content_type
            == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ):
            result = await convert_xlsx_to_markdown(file)
        elif content_type in ["image/jpeg", "image/png", "image/gif", "image/svg+xml"]:
            result = await convert_image_to_markdown(file)
        elif content_type == "text/xml":
            result = await convert_xml_to_markdown(file)
        else:
            # Try to handle unknown formats
            result = await convert_unknown_to_markdown(file)

        # Format the markdown as a code block for the API response
        markdown_code_block = f"```markdown\n{result.markdown}\n```"

        # Return the response
        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "File converted successfully",
                "markdownContent": markdown_code_block,
                "rawMarkdown": result.markdown,
                "metadata": result.metadata,
                "preview": result.preview,
                "sourceFormat": SUPPORTED_FORMATS.get(content_type, "unknown"),
            },
        )

    except HTTPException as he:
        # Re-raise HTTP exceptions
        raise he
    except Exception as e:
        print(f"Unexpected error during conversion: {str(e)}")
        return create_error_response(500, f"Failed to convert file: {str(e)}")


@router.get("/supported-formats")
async def get_supported_formats():
    """Get list of supported file formats for conversion"""
    formats = []
    for mime, extension in SUPPORTED_FORMATS.items():
        formats.append(
            {
                "mime": mime,
                "extension": extension,
                "description": f"{extension.upper()} files",
            }
        )

    return JSONResponse(
        status_code=200,
        content={
            "success": True,
            "formats": formats,
            "maxFileSize": MAX_FILE_SIZE,
            "maxFileSizeMB": MAX_FILE_SIZE / 1024 / 1024,
        },
    )
