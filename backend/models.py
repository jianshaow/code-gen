import requests
from urllib.parse import urlsplit
from urllib.error import HTTPError
from openai import OpenAI
from google.generativeai import GenerativeModel, list_models

import config

__clients = {}
__model_lists = {}


def setStale(api_spec):
    __clients.pop(api_spec)
    __model_lists.pop(api_spec)


def get_client():
    api_spec = config.api_spec
    client = __clients.get(api_spec)
    if client == None:
        if api_spec == "openai":
            client = __openai_client()
        elif api_spec == "ollama":
            client = __ollama_client()
        elif api_spec == "google":
            client = __google_client()
        __clients[api_spec] = client
    return client


def __ollama_client():
    return OpenAI(
        base_url=config.ollama_base_url,
        api_key=config.ollama_api_key,
    )


def __openai_client():
    return OpenAI(
        base_url=config.openai_base_url,
        api_key=config.openai_api_key,
    )


def __google_client():
    return GenerativeModel(model_name=config.get_model())


def get_models(reload=False):
    api_spec = config.api_spec
    models = __model_lists.get(api_spec)
    if models == None or reload:
        if api_spec == "openai":
            models = [obj.id for obj in get_client().models.list().data]
        elif api_spec == "google":
            models = [model.name for model in list_models()]
        elif api_spec == "ollama":
            models = __get_ollama_models()
        else:
            raise NotImplementedError(f"not supported spec {config.api_spec}")

    return models != None and models or []


def __get_ollama_base_url():
    if config.openai_base_url:
        parsed_url = urlsplit(config.ollama_base_url)
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
    return ["ollama", "openai", "google"]


def generate(prompt: str):
    client = get_client()
    if isinstance(client, OpenAI):
        completion = client.chat.completions.create(
            model=config.get_model(), messages=[{"role": "user", "content": prompt}]
        )
        result = completion.choices[0].message.content
    elif isinstance(client, GenerativeModel):
        result = client.generate_content(prompt).text
    return result


if __name__ == "__main__":
    print(get_api_specs())
    print(get_models())
