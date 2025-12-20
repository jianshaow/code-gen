import os
from typing import Dict

from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

OPENAI_BASE_URL: str = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1")
OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "EMPTY")
OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
GOOGLE_MODEL: str = os.getenv("GOOGLE_MODEL", "models/gemini-2.5-flash")

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "localhost")
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", f"http://{OLLAMA_HOST}:11434")
OLLAMA_API_KEY: str = os.getenv("OLLAMA_API_KEY", "EMPTY")
OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "deepseek-v3.1:671b-cloud")


class AppConfig(BaseModel):
    tpl_dir: str
    model_provider: str


class ModelConfig(BaseModel):
    base_url: str | None
    api_key: str
    model: str


__app_config = AppConfig(
    tpl_dir=os.getenv("PROMPT_TPL_DIR", "prompts"),
    model_provider=os.getenv("MODEL_PROVIDER", "openai"),
)

__model_configs: Dict[str, ModelConfig] = {
    "openai": ModelConfig(
        base_url=OPENAI_BASE_URL, api_key=OPENAI_API_KEY, model=OPENAI_MODEL
    ),
    "google": ModelConfig(base_url="", api_key=GOOGLE_API_KEY, model=GOOGLE_MODEL),
    "ollama": ModelConfig(
        base_url=OLLAMA_BASE_URL, api_key=OLLAMA_API_KEY, model=OLLAMA_MODEL
    ),
}


def get_app_config() -> AppConfig:
    return __app_config


def update_app_config(app_config: AppConfig):
    __app_config.model_provider = app_config.model_provider
    __app_config.tpl_dir = app_config.tpl_dir


def get_model_config(model_provider: str) -> ModelConfig:
    model_config = __model_configs.get(model_provider)
    if model_config:
        return model_config
    else:
        import extension as ext

        return ext.get_model_config(model_provider)


def update_model_config(model_provider: str, model_config: ModelConfig):
    if model_provider in __model_configs:
        __model_configs.update({model_provider: model_config})
    else:
        import extension as ext

        ext.update_model_config(model_provider, model_config)


def __main():
    print(__app_config)
    print(get_model_config(__app_config.model_provider))


if __name__ == "__main__":
    __main()
