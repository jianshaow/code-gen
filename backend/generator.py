import prompts


def generate(tmpl_name, requirement):
    prompt = prompts.get_prompt(tmpl_name, requirement)
    return 'print("Hello, World")'
