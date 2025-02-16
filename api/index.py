from fastapi import FastAPI
from route.hello_router import router
from route.user_routes import user_routes

app = FastAPI()

app.include_router(router)
app.include_router(user_routes, prefix="/api/py")
