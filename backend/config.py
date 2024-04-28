import os

api_spec = os.environ.get("API_SPEC", "ollama")
base_url = os.environ.get("OPENAI_API_BASE")
api_key = os.environ.get("OPENAI_API_KEY", "EMPTY")
model = os.environ.get("OPENAI_MODEL", "gpt-3.5-turbo")
tpl_dir = os.environ.get("PROMPT_TPL_DIR", "prompts")


def get_config():
    return {
        "tpl_dir": tpl_dir,
        "api_spec": api_spec,
        "base_url": base_url,
        "api_key": api_key,
        "model": model,
    }


def update_config(conf: dict):
    global api_spec, base_url, api_key, model, tpl_dir
    api_spec = conf.get("api_spec", api_spec)
    base_url = conf.get("base_url", base_url)
    api_key = conf.get("api_key", api_key)
    model = conf.get("model", model)
    tpl_dir = conf.get("tpl_dir", tpl_dir)


if __name__ == "__main__":
    print(get_config())
