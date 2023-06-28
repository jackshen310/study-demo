
虚拟环境了解：https://www.jianshu.com/p/2fdb53825d35
flask框架了解：https://github.com/pallets/flask
flask文档：https://flask.palletsprojects.com/en/2.2.x/quickstart/#a-minimal-application

1. 安装虚拟环境 `apt install python3-venv`
2. 创建虚拟环境 `python3 -m venv .env`
3. 使用虚拟环境 `source .env/bin/activate`
4. 安装依赖
```
pip install Flask
```
1. 启动服务 `python3 -m flask --app app --debug run`
2. 退出虚拟环境 `deactivate`