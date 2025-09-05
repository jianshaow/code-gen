from google.genai import Client as GoogleClient
from ollama import Client as OllamaClient
from openai import OpenAI as OpenAIClient


def get_api_specs() -> list[str]:
    return ["ollama", "openai", "google"]


def openai_client(base_url: str, api_key: str):
    return OpenAIClient(
        base_url=base_url,
        api_key=api_key,
    )


def openai_models(client: OpenAIClient) -> list[str]:
    return [obj.id for obj in client.models.list().data]


def openai_generate(client: OpenAIClient, model: str, prompt: str):
    completion = client.chat.completions.create(
        model=model, messages=[{"role": "user", "content": prompt}]
    )
    return completion.choices[0].message.content


def openai_gen_stream(client: OpenAIClient, model: str, prompt: str):
    response = client.chat.completions.create(
        model=model, messages=[{"role": "user", "content": prompt}], stream=True
    )
    for chunk in response:
        if chunk.choices and chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content


def google_client():
    return GoogleClient()


def google_models(client: GoogleClient) -> list[str]:
    return [
        model.name or ""
        for model in client.models.list()
        if "generateContent" in model.supported_actions  # type: ignore
    ]


def google_generate(client: GoogleClient, model: str, prompt: str):
    response = client.models.generate_content(model=model, contents=[prompt])
    return response.text or ""


def google_gen_stream(client: GoogleClient, model: str, prompt: str):
    response = client.models.generate_content_stream(model=model, contents=[prompt])
    for chunk in response:
        yield chunk.text


def ollama_client(api_base: str):
    return OllamaClient(api_base)


def ollama_models(client: OllamaClient) -> list[str]:
    models = client.list()["models"]
    return [model["model"] for model in models]


def ollama_generate(client: OllamaClient, model: str, prompt: str):
    return client.generate(model=model, prompt=prompt, think=False).response


def ollama_gen_stream(client: OllamaClient, model: str, prompt: str):
    response = client.generate(
        model=model, prompt=prompt, think=False, stream=True
    )

if __name__ == "__main__":
    print(get_api_specs())
