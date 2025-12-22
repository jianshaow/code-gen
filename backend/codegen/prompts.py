import os

from pydantic import BaseModel

from codegen.config import get_app_config


class Templates(BaseModel):
    scanned: bool = False
    tpl_paths: dict = {}


__templates = Templates()


def scan_tpl_dir():
    root_dir = get_app_config().tpl_dir
    for entry in os.listdir(root_dir):
        path = os.path.join(root_dir, entry)
        tpl_name, _ = os.path.splitext(entry)
        __templates.tpl_paths[tpl_name] = path


def reload():
    __templates.scanned = False
    scan_tpl_dir()


def get_tpl_path(name) -> str:
    if not __templates.scanned:
        scan_tpl_dir()
    return __templates.tpl_paths[name]


def get_tpl_names() -> list:
    if not __templates.scanned:
        scan_tpl_dir()
    return list(__templates.tpl_paths.keys())


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
    print(__templates.tpl_paths)
