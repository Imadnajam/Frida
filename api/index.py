from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.route.converter import router as converter_router
from api.route.user_routes import  user_routes
from api.route.message import message_routes
## from api.route.upload import router as upload_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(converter_router, prefix="/api/py")
app.include_router(user_routes, prefix="/api/py")
app.include_router(message_routes, prefix="/api/py")
## app.include_router(upload_router, prefix="/api/py")



@app.get("/")
async def read_root():
    return {"message": "Welcome to Frida the FastAPI application!"}
