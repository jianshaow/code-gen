from config import APIConfig
from generators import CodeGenerator


def get_api_specs() -> list[str]:
    return []


def get_api_config(api_spec: str) -> APIConfig:
    raise NotImplementedError(f"API spec '{api_spec}' is not implemented")


def update_api_config(api_spec: str, api_config: APIConfig):
    raise NotImplementedError(f"API spec '{api_spec}' is not implemented")


def new_generator(api_spec: str, model: str, **kwargs) -> CodeGenerator:
    raise NotImplementedError(f"API spec '{api_spec}' is not implemented")
