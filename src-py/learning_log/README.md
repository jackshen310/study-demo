1. 配置虚拟环境 $ python3 -m venv ll_env
2. 激活虚拟环境 $ source ll_env/bin/activate
3. 停止使用虚拟环境 $ deactivate
4. 安装web框架 django $ pip3 install django 
5. 创建项目 $ django-admin startproject learning_log .
6. 创建数据库 $ python3 manage.py migrate
7. 启动web项目(development) $ python3 manage.py runserver
8. 创建应用程序 $ python3 manage.py startapp learning_logs
9. 激活模型 $ python3 manage.py makemigrations  learning_logs
10. 迁移数据库（承接上一步） $ python3 manage.py migrate    
11. 创建超级用户(admin/admin) $ python3 manage.py createsuperuser
12. Django 交互式 shell 
```py
from learning_logs.models  import Topic
Topic.objects.all()
```
13. UI美化
    1.  安装django-bootstrap4 $ pip3 install django-bootstrap4