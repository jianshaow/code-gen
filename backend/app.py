import os
from flask import Flask, request, send_from_directory
from flask_cors import CORS

import config, models, prompts, generator

frontend = os.path.abspath(os.path.join("../frontend", "build"))
frontend = os.environ.get("FRONTEND_DIR", frontend)
static_folder = os.path.join(frontend, "static")
app = Flask(__name__, static_folder=static_folder)
CORS(app)


@app.route("/", defaults={"path": ""})
@app.route("/<path>")
def main(path):
    if path == "" or path == "setting":
        return send_from_directory(frontend, "index.html")
    else:
        return send_from_directory(frontend, path)


@app.route("/<tpl_name>/generate", methods=["POST"])
def generate(tpl_name):
    raw_data = request.get_data()
    requirement = raw_data.decode("utf-8")
    return generator.generate(tpl_name, requirement), 200


@app.route("/template", methods=["GET"])
def get_templates():
    reload = request.args.get("reload", "false")
    if reload == "true":
        prompts.reload()
    return prompts.get_tpl_names(), 200


@app.route("/template/<tpl_name>", methods=["GET"])
def get_template(tpl_name):
    return prompts.get_template(tpl_name)


@app.route("/template/<tpl_name>", methods=["PUT"])
def update_template(tpl_name):
    raw_data = request.get_data()
    content = raw_data.decode("utf-8")
    prompts.save_template(
        tpl_name,
        content,
    )
    return "", 204


@app.route("/config", methods=["GET"])
def get_config():
    return config.get_config(), 200


@app.route("/config", methods=["PUT"])
def update_config():
    conf = request.get_json()
    config.update_config(conf)
    models.setStale()
    return "", 204


@app.route("/models", methods=["GET"])
def get_models():
    reload = request.args.get("reload", "false")
    return models.get_models(reload == "true"), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
