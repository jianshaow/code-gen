import os, sys, prompts
from openai import OpenAI

__client = None


def get_client():
    global __client
    if __client == None:
        __client = OpenAI(
            base_url=os.environ.get("OPENAI_API_BASE"),
            api_key=os.environ.get("OPENAI_API_KEY"),
        )
    return __client


def generate(tmpl_name, requirement):
    prompt = prompts.get_prompt(tmpl_name, requirement)
    client = get_client()
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo", messages=[{"role": "user", "content": prompt}]
    )
    return completion.choices[0].message.content


if __name__ == "__main__":
    requirement = len(sys.argv) == 1 and sys.argv[0] or "code a hello world example."
    generated = generate("prompt1", requirement)
    print(generated)
