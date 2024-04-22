from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/query", methods=["GET"])
def query_index():
    return "Hello", 200


@app.route("/data", methods=["GET"])
def query_data():
    return ["data1", "data2"], 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
