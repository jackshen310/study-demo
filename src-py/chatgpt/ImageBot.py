import os
import openai
from flask import Flask,jsonify,request
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
openai.organization = os.getenv('ORGANIZATION')
openai.api_key = os.getenv('API_KEY')

CORS(app)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/image_bot', methods=['POST'])
def image_bot():
    # 获取请求参数
    json = request.get_json()
    prompt = json.get('prompt')
    n = json.get('n')
    size = json.get('size')

    print(prompt,n,size)

    response = openai.Image.create(
      prompt=prompt,
      n=int(n),
      size=size
    )
    print('response', response)
    return jsonify(response), 200

if __name__ == '__main__':
    app.run()
