from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from PyPDF2 import PdfReader

# Create a router
router = APIRouter()


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Check if a file is uploaded
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

        # Convert text to Markdown format
        markdown_content = f"# Extracted Text\n\n{text}"

        # Return the Markdown content
        return JSONResponse(
            status_code=200,
            content={
                "message": "File processed successfully",
                "markdownContent": markdown_content,
            },
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")
