from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.route.user_routes import  user_routes
from api.route.upload import router as upload_router

# Create the main FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_routes, prefix="/api/py")
app.include_router(upload_router, prefix="/api/py")
