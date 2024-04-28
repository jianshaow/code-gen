import os

tmpl_dir = os.environ.get("PROMPT_TMPL_DIR", "prompts")
api_spec = os.environ.get("API_SPEC", "ollama")
base_url = os.environ.get("OPENAI_API_BASE")
api_key = os.environ.get("OPENAI_API_KEY", "EMPTY")
model = os.environ.get("OPENAI_MODEL", "gpt-3.5-turbo")


def get_config():
    return {
        "tmpl_dir": tmpl_dir,
        "api_spec": api_spec,
        "base_url": base_url,
        "api_key": api_key,
        "model": model,
    }


def update_config(conf: dict):
    tmpl_dir = conf.get("tmpl_dir", tmpl_dir)
    api_spec = conf.get("api_spec", api_spec)
    base_url = conf.get("base_url", base_url)
    api_key = conf.get("api_key", api_key)
    model = conf.get("model", model)


if __name__ == "__main__":
    print(get_config())
