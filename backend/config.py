import os

tpl_dir = os.environ.get("PROMPT_TPL_DIR", "prompts")
api_spec = os.environ.get("API_SPEC", "ollama")

openai_base_url = os.environ.get(
    "OPENAI_API_BASE", "http://host.docker.internal:8000/v1"
)
openai_api_key = os.environ.get("OPENAI_API_KEY", "EMPTY")
openai_model = os.environ.get("OPENAI_MODEL", "gpt-3.5-turbo")

google_model = os.environ.get("GOOGLE_MODEL", "models/gemini-pro")

ollama_base_url = os.environ.get(
    "OLLAMA_API_BASE", "http://host.docker.internal:11434/v1"
)
ollama_api_key = os.environ.get("OLLAMA_API_KEY", "EMPTY")
ollama_model = os.environ.get("OLLAMA_MODEL", "llama3:8b")


def get_config():
    return {
        "tpl_dir": tpl_dir,
        "api_spec": api_spec,
    }


def update_config(conf: dict):
    global api_spec, tpl_dir
    api_spec = conf.get("api_spec", api_spec)
    tpl_dir = conf.get("tpl_dir", tpl_dir)


def get_api_config(api_spec: str):
    if api_spec == "openai":
        return {
            "base_url": openai_base_url,
            "api_key": openai_api_key,
            "model": openai_model,
        }
    if api_spec == "google":
        return {
            "base_url": None,
            "api_key": os.environ.get("GOOGLE_API_KEY"),
            "model": google_model,
        }
    if api_spec == "ollama":
        return {
            "base_url": ollama_base_url,
            "api_key": ollama_api_key,
            "model": ollama_model,
        }
    return {}


def update_api_config(api_spec: str, conf: dict):
    global openai_base_url, openai_api_key, openai_model
    global google_base_url, google_api_key, google_model
    global ollama_base_url, ollama_api_key, ollama_model
    if api_spec == "openai":
        openai_base_url = conf.get("base_url")
        openai_api_key = conf.get("api_key")
        openai_model = conf.get("model")
    if api_spec == "google":
        os.environ["GOOGLE_API_KEY"] = conf.get("api_key")
        google_model = conf.get("model")
    if api_spec == "ollama":
        ollama_base_url = conf.get("base_url")
        ollama_api_key = conf.get("api_key")
        ollama_model = conf.get("model")


def get_api_key():
    return get_api_config(api_spec).get("api_key")


def get_base_url():
    return get_api_config(api_spec).get("base_url")


def get_model():
    return get_api_config(api_spec).get("model")


if __name__ == "__main__":
    print(get_config())
    print(get_api_config(api_spec))
