from fastapi import APIRouter
from controllers.hello_controller import hello_fast_api

router = APIRouter()


@router.get("/api/test")
def hello():
    return hello_fast_api()
