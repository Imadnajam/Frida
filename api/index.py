from fastapi import FastAPI
from api.route.hello_router import router
from api.route.user_routes import user_routes

app = FastAPI()

app.include_router(router)
app.include_router(user_routes, prefix="/api/py")
