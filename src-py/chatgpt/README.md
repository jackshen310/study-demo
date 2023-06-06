
[学习资源](https://github.com/datawhalechina)


创建虚拟环境 `python3 -m venv .env`
使用虚拟环境 `source .env/bin/activate`

安装依赖
$ pip install flask openai python-dotenv flask_cors

本地启动
$  http-server ./ --port=8080  --proxy=http://0.0.0.0:5000
$  python ImageBot.py

线上启动(端口8887)
$ pm2 start http-server --name image_bot_frontend --  ./ -p 8887  --proxy=http://0.0.0.0:5000
$ pm2 start python --name image_bot_server -- ImageBot.py

