import os, requests
from urllib.parse import urlsplit
from urllib.error import HTTPError
from openai import OpenAI
from google.generativeai import GenerativeModel, list_models

import config

__clients = {}
__model_lists = {}


def setStale():
    global __clients, __models
    __clients.clear()
    __model_lists.clear()


def get_client():
    api_spec = config.api_spec
    client = __clients.get(api_spec)
    if client == None:
        if api_spec == "openai" or api_spec == "ollama":
            client = __openai_client()
        elif api_spec == "gemini":
            client = __gemini_client()
        __clients[api_spec] = client
    return client


def __openai_client():
    return OpenAI(
        base_url=config.base_url,
        api_key=config.api_key,
    )


def __gemini_client():
    return GenerativeModel()


def get_models(reload=False):
    api_spec = config.api_spec
    models = __model_lists.get(api_spec)
    if models == None or reload:
        if api_spec == "openai":
            models = [obj.id for obj in get_client().models.list().data]
        elif api_spec == "gemini":
            models = [model.name for model in list_models()]
        elif api_spec == "ollama":
            models = __get_ollama_models()
        else:
            raise NotImplementedError(f"not supported spec {config.api_spec}")

    return models != None and models or []


def __get_ollama_base_url():
    if config.base_url:
        parsed_url = urlsplit(config.base_url)
        return f"{parsed_url.scheme}://{parsed_url.netloc}"
    else:
        return None


def __get_ollama_models():
    base_url = __get_ollama_base_url()
    if base_url:
        url = "{base_url}/api/tags".format(base_url=base_url)
        response = requests.get(url)
        if response.status_code == 200:
            json_data = response.json()
            return [obj["name"] for obj in json_data["models"]]
        else:
            raise HTTPError(
                url=url, code=response.status_code, msg="call ollama api fail"
            )
    return None


def get_api_specs():
    api_specs_str = os.environ.get("MODEL_API_SPECS", "ollama,openai,gemini")
    return api_specs_str.split(",")


def generate(prompt: str):
    client = get_client()
    if isinstance(client, OpenAI):
        completion = client.chat.completions.create(
            model=config.model, messages=[{"role": "user", "content": prompt}]
        )
        result = completion.choices[0].message.content
    elif isinstance(client, GenerativeModel):
        result = client.generate_content(prompt).text
    return result


if __name__ == "__main__":
    print(get_api_specs())
    print(get_models())
