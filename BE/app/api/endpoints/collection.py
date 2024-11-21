# app/api/endpoints/collection.py

from fastapi import APIRouter, HTTPException, status, Request
from app.schemas.collection_schema import (
    CollectionListRequest, CollectionListResponse, CollectionDetailResponse, CollectionDetailRequest
)
from app.services.collection_service import (
    collection_list, collection_detail
)

router = APIRouter()


@router.post("/list", response_model=CollectionListResponse)
async def collection_list_endpoint(request: CollectionListRequest, client_request: Request):
    try:
        col_list = await collection_list(request)
        return col_list
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"오류 : {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"오류 : {str(e)}"
        )

@router.post("/detail", response_model=CollectionDetailResponse)
async def collection_detail_endpoint(request: CollectionDetailRequest, client_request: Request):
    try:
        col_detail = await collection_detail(request)
        return col_detail
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"오류: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"오류: {str(e)}"
        )