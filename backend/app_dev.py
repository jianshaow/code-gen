import os

import uvicorn
from fastapi.middleware.cors import CORSMiddleware

from app import app

frontend_base_url = os.getenv("FRONTEND_BASE_URL", "http://localhost:8000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_base_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    app_host = os.getenv("APP_HOST", "0.0.0.0")
    app_port = int(os.getenv("APP_PORT", "8000"))

    uvicorn.run(app="app:app", host=app_host, port=app_port, reload=True)
