from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/generate", methods=["GET"])
def query_index():
    return "print(\"Hello, World\")", 200


@app.route("/template", methods=["GET"])
def query_data():
    return ["prompt1", "prompt2"], 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
