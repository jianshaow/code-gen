import os
from typing import Dict

from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

OPENAI_BASE_URL: str = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "EMPTY")
OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY")
GOOGLE_MODEL: str = os.getenv("GOOGLE_MODEL", "models/gemini-2.5-flash")

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "localhost")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", f"http://{OLLAMA_HOST}:11434")
OLLAMA_API_KEY: str = os.getenv("OLLAMA_API_KEY", "EMPTY")
OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "deepseek-v3.1:671b-cloud")


class AppConfig(BaseModel):
    tpl_dir: str
    api_spec: str


class APIConfig(BaseModel):
    base_url: str | None
    api_key: str
    model: str


__app_config = AppConfig(
    tpl_dir=os.getenv("PROMPT_TPL_DIR", "prompts"),
    api_spec=os.getenv("API_SPEC", "openai"),
)

__api_configs: Dict[str, APIConfig] = {
    "openai": APIConfig(
        base_url=OPENAI_BASE_URL, api_key=OPENAI_API_KEY, model=OPENAI_MODEL
    ),
    "google": APIConfig(base_url="", api_key=GOOGLE_API_KEY, model=GOOGLE_MODEL),
    "ollama": APIConfig(
        base_url=OLLAMA_BASE_URL, api_key=OLLAMA_API_KEY, model=OLLAMA_MODEL
    ),
}


def get_app_config() -> AppConfig:
    return __app_config


def update_app_config(app_config: AppConfig):
    __app_config.api_spec = app_config.api_spec
    __app_config.tpl_dir = app_config.tpl_dir


def get_api_config(api_spec: str) -> APIConfig:
    api_config = __api_configs.get(api_spec)
    if api_config:
        return api_config
    else:
        import extension as ext

        return ext.get_api_config(api_spec)


def update_api_config(api_spec: str, api_config: APIConfig):
    if api_spec in __api_configs:
        __api_configs.update({api_spec: api_config})
    else:
        import extension as ext

        ext.update_api_config(api_spec, api_config)


def __main():
    print(__app_config)
    print(get_api_config(__app_config.api_spec))


if __name__ == "__main__":
    __main()
