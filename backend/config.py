import os

from dotenv import load_dotenv

load_dotenv()

tpl_dir = os.getenv("PROMPT_TPL_DIR", "prompts")
api_spec = os.getenv("API_SPEC", "ollama")

openai_api_base: str = os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1")
openai_api_key: str = os.getenv("OPENAI_API_KEY", "EMPTY")
openai_model: str = os.getenv("OPENAI_MODEL", "gpt-4.1-mini")

google_api_key: str = os.getenv("GOOGLE_API_KEY", "")
google_model: str = os.getenv("GOOGLE_MODEL", "models/gemini-2.5-flash")

ollama_base_url: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434/v1")
ollama_api_key: str = os.getenv("OLLAMA_API_KEY", "EMPTY")
ollama_model: str = os.getenv("OLLAMA_MODEL", "qwen3:0.6b")


def get_config() -> dict:
    return {
        "tpl_dir": tpl_dir,
        "api_spec": api_spec,
    }


def update_config(conf: dict):
    global api_spec, tpl_dir
    api_spec = conf.get("api_spec", api_spec)
    tpl_dir = conf.get("tpl_dir", tpl_dir)


def get_api_config(api_spec: str) -> dict[str, str]:
    if api_spec == "openai":
        return {
            "base_url": openai_api_base,
            "api_key": openai_api_key,
            "model": openai_model,
        }
    elif api_spec == "google":
        return {
            "base_url": "",
            "api_key": google_api_key,
            "model": google_model,
        }
    elif api_spec == "ollama":
        return {
            "base_url": ollama_base_url,
            "api_key": ollama_api_key,
            "model": ollama_model,
        }
    else:
        import extension as ext

        return ext.get_api_config(api_spec)


def update_api_config(api_spec: str, conf: dict[str, str]):
    global openai_api_base, openai_api_key, openai_model
    global google_model, google_api_key
    global ollama_base_url, ollama_api_key, ollama_model
    if api_spec == "openai":
        openai_api_base = conf.get("base_url") or openai_api_base
        openai_api_key = conf.get("api_key") or openai_api_key
        openai_model = conf.get("model") or openai_model
    elif api_spec == "google":
        google_api_key = conf.get("api_key") or google_api_key
        google_model = conf.get("model") or google_model
    elif api_spec == "ollama":
        ollama_base_url = conf.get("base_url") or ollama_base_url
        ollama_api_key = conf.get("api_key") or ollama_api_key
        ollama_model = conf.get("model") or ollama_model
    else:
        import extension as ext

        ext.update_api_config(api_spec, conf)


def get_api_key():
    return get_api_config(api_spec).get("api_key")


def get_base_url():
    return get_api_config(api_spec).get("base_url")


def get_model():
    return get_api_config(api_spec).get("model")


if __name__ == "__main__":
    print(get_config())
    print(get_api_config(api_spec))
