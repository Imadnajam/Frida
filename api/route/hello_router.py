from fastapi import APIRouter
from controllers.hello_controller import hello_fast_api

router = APIRouter()


@router.get("/api/py/test")
def hello():
    return hello_fast_api()


@router.get("/api/py/imad")
def imad():
    return {"message": "hhhh"}


@router.get("/api/py/test/{name}")
def hello_name(name: str):
    return {"message": f"Hello {name} from FastAPI By Imad NAJAM"}
