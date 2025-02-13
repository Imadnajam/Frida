from fastapi import APIRouter
from api.controllers.hello_controller import hello_fast_api

router = APIRouter()

@router.get("/api/py/test")
def hello():
    return hello_fast_api()
