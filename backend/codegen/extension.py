from codegen.config import ModelConfig
from codegen.generators import CodeGenerator


def get_model_providers() -> list[str]:
    return []


def get_model_config(model_provider: str) -> ModelConfig:
    raise NotImplementedError(f"Model provider '{model_provider}' is not implemented")


def update_model_config(model_provider: str, model_config: ModelConfig):
    raise NotImplementedError(f"Model provider '{model_provider}' is not implemented")


def new_generator(model_provider: str, model: str, **kwargs) -> CodeGenerator:
    raise NotImplementedError(f"Model provider '{model_provider}' is not implemented")
