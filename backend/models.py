import ollama
from openai import OpenAI
import google.generativeai as genai


genai.configure(transport="rest")

def get_api_specs() -> list[str]:
    return ["ollama", "openai", "google"]


def openai_client(base_url: str, api_key: str):
    return OpenAI(
        base_url=base_url,
        api_key=api_key,
    )


def openai_models(client: OpenAI) -> list[str]:
    return [obj.id for obj in client.models.list().data]


def openai_generate(client: OpenAI, model: str, prompt: str):
    completion = client.chat.completions.create(
        model=model, messages=[{"role": "user", "content": prompt}]
    )
    return completion.choices[0].message.content


def google_model(model_name: str):
    return genai.GenerativeModel(model_name=model_name)


def google_models() -> list[str]:
    return [
        model.name
        for model in genai.list_models()
        if "generateContent" in model.supported_generation_methods
    ]


def google_generate(model: genai.GenerativeModel, prompt: str):
    return model.generate_content(prompt).text


def ollama_models(host: str) -> list[str]:
    if host:
        client = ollama.Client(host)
        models = client.list()
        return [obj["name"] for obj in models["models"]]

    return None


if __name__ == "__main__":
    print(get_api_specs())
