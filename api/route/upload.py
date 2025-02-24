from fastapi import APIRouter, File, UploadFile
from api.controllers.upload_controller import handle_file_upload

# Create a router
router = APIRouter()


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    return await handle_file_upload(file)
