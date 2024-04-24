from flask import Flask
from flask_cors import CORS

import prompts, generator

app = Flask(__name__)
CORS(app)


@app.route("/generate", methods=["GET"])
def generate():
    return generator.generate("prompt1", ""), 200


@app.route("/template", methods=["GET"])
def get_templates():
    return prompts.get_tmpl_names(), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
