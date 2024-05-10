from generator import CodeGenerator


def get_api_specs() -> list[str]:
    return []


def get_api_config(api_spec: str) -> dict:
    raise NotImplementedError(f"API spec '{api_spec}' is not implemented")


def update_api_config(api_spec: str, conf: dict):
    raise NotImplementedError(f"API spec '{api_spec}' is not implemented")


def new_generator(
    api_spec: str, base_url: str, api_key: str, model: str
) -> CodeGenerator:
    raise NotImplementedError(f"API spec '{api_spec}' is not implemented")
