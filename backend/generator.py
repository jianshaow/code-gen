import prompts, config, models
from abc import abstractmethod
from urllib.parse import urlsplit


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
    def generate(prompt: str) -> str:
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
        return models.openai_generate(self._client, self.model_name, prompt)


class GoogleGenerator(CodeGenerator):

    def __init__(self, model_name: str, **kwargs) -> None:
        super().__init__(model_name, **kwargs)
        self._model = models.google_model(model_name)

    def _get_models(self) -> list:
        return models.google_models()

    def generate(self, prompt: str) -> str:
        return models.google_generate(self._model, prompt)


class OLlamaGenerator(CodeGenerator):

    def __init__(self, model_name: str, **kwargs) -> None:
        super().__init__(model_name, **kwargs)
        base_url = self.config["base_url"]
        api_key = self.config["api_key"]
        self._client = models.openai_client(base_url, api_key)

    def _get_models(self) -> list:
        parsed_url = urlsplit(self.config["base_url"])
        ollama_base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
        return models.ollama_models(ollama_base_url)

    def generate(self, prompt: str) -> str:
        return models.openai_generate(self._client, self.model_name, prompt)


_generators = {}


def get_generator() -> CodeGenerator:
    api_spec = config.api_spec
    generator = _generators.get(api_spec)
    if generator is None:
        base_url = config.get_base_url()
        api_key = config.get_api_key()
        model = config.get_model()
        generator = new_generator(api_spec, model, base_url=base_url, api_key=api_key)
        _generators[api_spec] = generator
    return generator


def new_generator(api_spec: str, model: str, **kwargs) -> CodeGenerator:
    if api_spec == "openai":
        generator = OpenAIGenerator(model, **kwargs)
    elif api_spec == "ollama":
        generator = OLlamaGenerator(model, **kwargs)
    elif api_spec == "google":
        generator = GoogleGenerator(model, **kwargs)
    else:
        import extension as ext

        generator = ext.new_generator(api_spec, model, **kwargs)
    return generator


def generate(tpl_name: str, requirement: str):
    prompt = prompts.get_prompt(tpl_name, requirement)
    generator = get_generator()
    return generator.generate(prompt)


def get_models(reload=False):
    return get_generator().get_models(reload)


def setStale(api_spec: str):
    _generators.pop(api_spec, None)


def get_api_specs() -> list[str]:
    api_specs = models.get_api_specs()
    import extension as ext

    ext_api_specs = ext.get_api_specs()
    return api_specs + ext_api_specs


if __name__ == "__main__":
    import sys

    print(get_api_specs())
    print(get_models())
    print(config.get_config())
    print(config.get_api_config(config.api_spec))
    requirement = len(sys.argv) == 2 and sys.argv[1] or "code an example"
    generated = generate(prompts.get_tpl_names()[0], requirement)
    print(generated)
