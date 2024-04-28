import config, prompts, models


def generate(tmpl_name, requirement):
    prompt = prompts.get_prompt(tmpl_name, requirement)
    client = models.get_client()
    completion = client.chat.completions.create(
        model=config.model, messages=[{"role": "user", "content": prompt}]
    )
    return completion.choices[0].message.content


if __name__ == "__main__":
    import sys

    requirement = len(sys.argv) == 1 and sys.argv[0] or "code an example"
    generated = generate(prompts.get_tmpl_names()[0], requirement)
    print(generated)
