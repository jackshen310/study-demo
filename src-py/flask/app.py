# save this as app.py
from flask import Flask

app = Flask(__name__)

print("1")


@app.route("/")
def hello():
    return "Hello, World!"


app.run(debug=True)
