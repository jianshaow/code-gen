import os, config

__tpl_path_dict: dict = None


def scan_tpl_dir():
    global __tpl_path_dict
    __tpl_path_dict = {}
    root_dir = config.tpl_dir
    for entry in os.listdir(root_dir):
        path = os.path.join(root_dir, entry)
        tpl_name, _ = os.path.splitext(entry)
        __tpl_path_dict[tpl_name] = path


def reload():
    global __tpl_path_dict
    __tpl_path_dict = None
    scan_tpl_dir()


def get_tpl_path(name) -> str:
    if __tpl_path_dict is None:
        scan_tpl_dir()
    return __tpl_path_dict[name]


def get_tpl_names() -> dict:
    if __tpl_path_dict is None:
        scan_tpl_dir()
    return list(__tpl_path_dict.keys())


def get_prompt(tpl_name: str, requirement: str) -> str:
    template = get_template(tpl_name)
    prompt = template.format(requirement=requirement)
    return prompt


def get_template(tpl_name: str):
    tpl_path = get_tpl_path(tpl_name)
    with open(tpl_path, "r", encoding="utf-8") as file:
        content = file.read()
        return content


def save_template(tpl_name, content):
    tpl_path = get_tpl_path(tpl_name)
    with open(tpl_path, "w", encoding="utf-8") as file:
        file.write(content)


if __name__ == "__main__":
    scan_tpl_dir()
    print(__tpl_path_dict)
