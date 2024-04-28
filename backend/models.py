import requests
from urllib.parse import urlsplit
from urllib.error import HTTPError
from openai import OpenAI

import config

__client = None
__models = None


def get_client():
    global __client
    if __client == None:
        __client = OpenAI(
            base_url=config.base_url,
            api_key=config.api_key,
        )
    return __client


def get_models(reload=False):
    global __models
    if __models == None or reload:
        if config.api_spec == "openai":
            __models = [obj.id for obj in get_client().models.list().data]
        elif config.api_spec == "ollama":
            url = "{base_url}/api/tags".format(base_url=__get_ollama_base_url())
            response = requests.get(url)
            if response.status_code == 200:
                json_data = response.json()
                __models = [obj["name"] for obj in json_data["models"]]
            else:
                raise HTTPError(
                    url=url, code=response.status_code, msg="call ollama api fail"
                )
        else:
            raise NotImplementedError(f"not supported spec {config.api_spec}")

    return __models


def __get_ollama_base_url():
    parsed_url = urlsplit(config.base_url)
    return f"{parsed_url.scheme}://{parsed_url.netloc}"


if __name__ == "__main__":
    print(get_models())
