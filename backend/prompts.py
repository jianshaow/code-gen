import os, config

__tmpl_path_dict: dict = None


def scan_template_dir():
    global __tmpl_path_dict
    __tmpl_path_dict = {}
    root_dir = config.tmpl_dir
    for entry in os.listdir(root_dir):
        path = os.path.join(root_dir, entry)
        tmpl_name, _ = os.path.splitext(entry)
        __tmpl_path_dict[tmpl_name] = path


def reload():
    global __tmpl_path_dict
    __tmpl_path_dict = None
    scan_template_dir()


def get_tmpl_path(name):
    if __tmpl_path_dict is None:
        scan_template_dir()
    return __tmpl_path_dict[name]


def get_tmpl_names() -> dict:
    if __tmpl_path_dict is None:
        scan_template_dir()
    return list(__tmpl_path_dict.keys())


def get_prompt(tmpl_name, requirement):
    template = get_template(tmpl_name)
    prompt = template.format(requirement=requirement)
    return prompt


def get_template(tmpl_name):
    tmpl_path = get_tmpl_path(tmpl_name)
    with open(tmpl_path, "r") as file:
        content = file.read()
        return content


def save_template(tmpl_name, content):
    tmpl_path = get_tmpl_path(tmpl_name)
    with open(tmpl_path, "w") as file:
        file.write(content)


if __name__ == "__main__":
    scan_template_dir()
    print(__tmpl_path_dict)
