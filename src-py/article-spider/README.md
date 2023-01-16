

# 用Python抓取文章抓取

## 简介
该小工具支持抓取来自掘金社区、阮一峰blog等最新文章，并推送到指定企微群

## 安装依赖（python >= 3.7)
```bash
$ apt-get install python3-pip
$ python3 -m pip install bs4
$ python3 -m pip install lxml
$ python3 -m pip install schedule
$ python3 -m pip install pyyaml
```

## 启动
```bash
$ python3 main.py
```

## 部署
```bash
# 用pm2部署
pm2 start main.py -x --interpreter python3 --name python-spider
```
## 库使用
1. requests库使用：https://requests.readthedocs.io/en/latest/user/quickstart/#response-content
2. BeautifulSoup 使用文档：https://www.crummy.com/software/BeautifulSoup/bs4/doc.zh/#find
3. schedule 使用文档：https://cloud.tencent.com/developer/article/1647955
4. 抓取公众号文章参考：https://zhuanlan.zhihu.com/p/379062852

# 欢迎贡献
该小工具目前已实现如下社区或个人博客最新文章（最新3天）的抓取：
1. 掘金（前端最近热文文章、ConardLi个人文章）
2. css森林（https://www.cssforest.org/）
3. 阮一峰个人blog（https://www.ruanyifeng.com/blog/）
4. 公众号
5. 张鑫旭个人blog（https://www.zhangxinxu.com/wordpress/）

可以扩展更多的文章rss来源，如自己喜欢的作者、社区，内容不限于前端技术

## 如何开发
1. 确定rss种子来源，如左耳朵耗子的博客(https://coolshell.cn/featured)
2. 确定如何解析文章列表，一般有两种，一种调用api，一种是解析html
3. 如果是调用api，就参考`juejin.py`,如果是解析html，就参考`cssforest.py`，如左耳朵耗子的博客就是解析html
4. copy代码，放到seeds目录下，如`coolshell.py`,然后根据实际情况修改代码即可
5. 在`main.py`的`runAll`方法的sources变量增加Coolshell()
   ```python
   from seeds.coolshell import Coolshell
   def runAll():
      sources = [..., Coolshell()]
      ...
   ```
6. 调试时，可以直接`runAll()`，注释掉定时器相关代码（发送到企微群也可以禁用掉）

## 公众号
公众号的文章有严格的反爬机制，现阶段需要提供cookie，而且cookie的有效期只有24小时，暂时没有免登录的解决方案（欢迎大神贡献），所以公众号的文章无法稳定抓取，不过有一种变通的做法，一般公众号的作者都会在多个平台发布，如code秘密花园，他可能也会在掘金上发布，那么就可以通过掘金抓取就可以了。