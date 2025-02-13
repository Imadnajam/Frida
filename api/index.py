from fastapi import FastAPI
from routers.hello_router import router

# Create FastAPI instance with custom docs and openapi url
app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

# Include the router from the 'router' module
app.include_router(router)
