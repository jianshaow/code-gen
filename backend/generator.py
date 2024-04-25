import config, prompts
from openai import OpenAI

__client = None


def get_client():
    global __client
    if __client == None:
        __client = OpenAI(
            base_url=config.base_url,
            api_key=config.api_key,
        )
    return __client


def generate(tmpl_name, requirement):
    prompt = prompts.get_prompt(tmpl_name, requirement)
    client = get_client()
    completion = client.chat.completions.create(
        model=config.model, messages=[{"role": "user", "content": prompt}]
    )
    return completion.choices[0].message.content


if __name__ == "__main__":
    import sys

    requirement = len(sys.argv) == 1 and sys.argv[0] or "code an example"
    generated = generate("prompt1", requirement)
    print(generated)
