import os
from typing import Dict

from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

openai_api_base: str = os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1")
openai_api_key: str = os.getenv("OPENAI_API_KEY", "EMPTY")
openai_model: str = os.getenv("OPENAI_MODEL", "gpt-5-mini")

google_api_key: str = os.getenv("GOOGLE_API_KEY", "")
google_model: str = os.getenv("GOOGLE_MODEL", "models/gemini-2.5-flash")

ollama_base_url: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434/v1")
ollama_api_key: str = os.getenv("OLLAMA_API_KEY", "EMPTY")
ollama_model: str = os.getenv("OLLAMA_MODEL", "qwen3:0.6b")


class AppConfig(BaseModel):
    tpl_dir: str
    api_spec: str


class APIConfig(BaseModel):
    base_url: str | None
    api_key: str
    model: str


__app_config = AppConfig(
    tpl_dir=os.getenv("PROMPT_TPL_DIR", "prompts"),
    api_spec=os.getenv("API_SPEC", "ollama"),
)

__api_configs: Dict[str, APIConfig] = {
    "openai": APIConfig(
        base_url=openai_api_base, api_key=openai_api_key, model=openai_model
    ),
    "google": APIConfig(base_url="", api_key=google_api_key, model=google_model),
    "ollama": APIConfig(
        base_url=ollama_base_url, api_key=ollama_api_key, model=ollama_model
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
