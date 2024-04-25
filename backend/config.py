import os

tmpl_dir = os.environ.get("PROMPT_TMPL_DIR", "prompts")
base_url = os.environ.get("OPENAI_API_BASE")
api_key = os.environ.get("OPENAI_API_KEY")
model = os.environ.get("OPENAI_MODEL_NAME", "gpt-3.5-turbo")


def get_config():
    global tmpl_dir, base_url, api_key, model
    return {
        "tmpl_dir": tmpl_dir,
        "base_url": base_url,
        "api_key": api_key,
        "model": model,
    }


def update_config(conf: dict):
    global tmpl_dir, base_url, api_key, model
    tmpl_dir = conf.get("tmpl_dir", tmpl_dir)
    base_url = conf.get("base_url", base_url)
    api_key = conf.get("api_key", api_key)
    model = conf.get("model", model)


if __name__ == "__main__":
    print(get_config())
