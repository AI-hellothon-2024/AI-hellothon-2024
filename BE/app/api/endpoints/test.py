from fastapi import APIRouter, HTTPException, status, Request
from app.services.ai_service import test_image_create

router = APIRouter()

@router.post("")
async def collection_list_endpoint():

    await test_image_create()

    return {"message": "end"}
