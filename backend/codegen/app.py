import os

import uvicorn
from fastapi import FastAPI, Request, status
from fastapi.responses import FileResponse, PlainTextResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles

from codegen import config, generators, prompts

frontend = os.path.abspath(os.path.join("../frontend", "dist"))
frontend = os.getenv("FRONTEND_DIR", frontend)
static_folder = os.path.join(frontend, "static")

app = FastAPI()


@app.post("/{tpl_name}/generate")
async def generate(tpl_name, request: Request):
    raw_data = await request.body()
    requirement = raw_data.decode("utf-8")
    return PlainTextResponse(generators.generate(tpl_name, requirement))


@app.post("/{tpl_name}/gen_stream")
async def gen_stream(tpl_name, request: Request):
    raw_data = await request.body()
    requirement = raw_data.decode("utf-8")
    return StreamingResponse(generators.gen_stream(tpl_name, requirement))


@app.get("/template")
def get_templates(reload: bool = False):
    if reload:
        prompts.reload()
    return prompts.get_tpl_names()


@app.get("/template/{tpl_name}")
def get_template(tpl_name):
    return PlainTextResponse(prompts.get_template(tpl_name))


@app.put("/template/{tpl_name}", status_code=status.HTTP_204_NO_CONTENT)
async def update_template(tpl_name, request: Request):
    raw_data = await request.body()
    content = raw_data.decode("utf-8")
    prompts.save_template(
        tpl_name,
        content,
    )


@app.get("/config")
def get_config():
    return config.get_app_config()


@app.put("/config", status_code=status.HTTP_204_NO_CONTENT)
async def update_config(app_config: config.AppConfig):
    config.update_app_config(app_config)


@app.get("/model_provider")
def get_model_providers():
    return generators.get_model_providers()


@app.get("/model_provider/{model_provider}")
def get_modelconfig(model_provider):
    return config.get_model_config(model_provider)


@app.put("/model_provider/{model_provider}", status_code=status.HTTP_204_NO_CONTENT)
async def update_model_config(model_provider, model_config: config.ModelConfig):
    config.update_model_config(model_provider, model_config)
    generators.setStale(model_provider)


@app.get("/models")
def get_models(request: Request):
    reload = request.get("reload", "false")
    return generators.get_models(reload == "true")


class FrontendStaticFiles(StaticFiles):
    async def get_response(self, path: str, scope):
        if path == "setting":
            file_path = os.path.join(frontend, "index.html")
            return FileResponse(file_path)

        return await super().get_response(path, scope)


app.mount("/", FrontendStaticFiles(directory=frontend, html=True), name="frontend")

if __name__ == "__main__":
    app_host = os.getenv("APP_HOST", "0.0.0.0")
    app_port = int(os.getenv("APP_PORT", "8000"))

    uvicorn.run(app="codegen.app:app", host=app_host, port=app_port, reload=True)
