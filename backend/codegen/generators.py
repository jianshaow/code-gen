from abc import abstractmethod
from typing import Generator

from codegen import models, prompts
from codegen.config import __app_config, get_model_config


class CodeGenerator:

    def __init__(self, model_name: str, **kwargs) -> None:
        self.model_name = model_name
        self.config = kwargs
        self._models = None

    def get_models(self, reload=False) -> list:
        if self._models is None or reload:
            self._models = self._get_models()
        return self._models

    @abstractmethod
    def _get_models(self) -> list:
        pass

    @abstractmethod
    def generate(self, prompt: str) -> str:
        pass

    @abstractmethod
    def gen_stream(self, prompt: str) -> Generator:
        pass


class OpenAIGenerator(CodeGenerator):

    def __init__(self, model_name: str, **kwargs) -> None:
        super().__init__(model_name, **kwargs)
        base_url = self.config["base_url"]
        api_key = self.config["api_key"]
        self._client = models.openai_client(base_url, api_key)

    def _get_models(self) -> list:
        return models.openai_models(self._client)

    def generate(self, prompt: str) -> str:
        return models.openai_generate(self._client, self.model_name, prompt) or ""

    def gen_stream(self, prompt: str):
        return models.openai_gen_stream(self._client, self.model_name, prompt)


class GoogleGenerator(CodeGenerator):

    def __init__(self, model_name: str, **kwargs) -> None:
        super().__init__(model_name, **kwargs)
        self._client = models.google_client()

    def _get_models(self) -> list:
        return models.google_models(self._client)

    def generate(self, prompt: str) -> str:
        return models.google_generate(self._client, self.model_name, prompt)

    def gen_stream(self, prompt: str):
        return models.google_gen_stream(self._client, self.model_name, prompt)


class OllamaGenerator(CodeGenerator):

    def __init__(self, model_name: str, **kwargs) -> None:
        super().__init__(model_name, **kwargs)
        base_url = self.config["base_url"]
        self._client = models.ollama_client(base_url)

    def _get_models(self) -> list:
        return models.ollama_models(self._client)

    def generate(self, prompt: str) -> str:
        return models.ollama_generate(self._client, self.model_name, prompt)

    def gen_stream(self, prompt: str) -> Generator:
        return models.ollama_gen_stream(self._client, self.model_name, prompt)


_generators = {}


def get_generator() -> CodeGenerator:
    model_provider = __app_config.model_provider
    model_config = get_model_config(model_provider)
    generator = _generators.get(model_provider)
    if generator is None:
        generator = new_generator(
            model_provider,
            model_config.model,
            base_url=model_config.base_url,
            api_key=model_config.api_key,
        )
        _generators[model_provider] = generator
    return generator


def new_generator(model_provider: str, model: str, **kwargs) -> CodeGenerator:
    if model_provider == "openai":
        generator = OpenAIGenerator(model, **kwargs)
    elif model_provider == "ollama":
        generator = OllamaGenerator(model, **kwargs)
    elif model_provider == "google":
        generator = GoogleGenerator(model, **kwargs)
    else:
        import extension as ext

        generator = ext.new_generator(model_provider, model, **kwargs)
    return generator


def generate(tpl_name: str, requirement: str):
    prompt = prompts.get_prompt(tpl_name, requirement)
    generator = get_generator()
    return generator.generate(prompt)


def gen_stream(tpl_name: str, requirement: str):
    prompt = prompts.get_prompt(tpl_name, requirement)
    generator = get_generator()
    return generator.gen_stream(prompt)


def get_models(reload=False):
    return get_generator().get_models(reload)


def setStale(model_provider: str):
    _generators.pop(model_provider, None)


def get_model_providers() -> list[str]:
    model_providers = models.get_model_providers()
    import extension as ext

    ext_model_providers = ext.get_model_providers()
    return model_providers + ext_model_providers


def __main():
    import sys

    print(get_model_providers())
    print("-" * 80)
    print(__app_config)
    print("-" * 80)
    for model in get_models():
        print(model)
    print("-" * 80)
    print(get_model_config(__app_config.model_provider))
    print("-" * 80)
    requirement = len(sys.argv) == 2 and sys.argv[1] or "code an example"
    response = gen_stream(prompts.get_tpl_names()[0], requirement)
    for chunk in response:
        print(chunk, end="")


if __name__ == "__main__":
    __main()
