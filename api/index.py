from fastapi import FastAPI
from api.routes.hello_router import router


app = FastAPI()

app.include_router(router)
