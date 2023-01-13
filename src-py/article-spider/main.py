import json
import requests
from seeds.juejin import Juejin
from seeds.cssforest import Cssforest
from seeds.zhangxinxu import Zhangxinxu
from seeds.ruanyifeng import Ruanyifeng
from seeds.weixin import Weixin
import datetime
import schedule
import time


def runAll():
    # 1. 设置数据源
    sources = [Weixin(), Cssforest(), Zhangxinxu(), Ruanyifeng(), Juejin(),]

    # 2. 抓取并过滤
    articles = []
    for source in sources:
        list = source.run()
        if len(list) != 0:
            articles.extend(list)
    print(articles)

    # 3. 构建消息
    '''
    格式如下：
    ## 优质文章推送(2023-01-09)
    1. [前端性能优化——包体积压缩82%、打包速度提升65%](https://juejin.cn/post/7186315052465520698)(海阔_天空/juejin/2023-01-15)
    2. [为什么我能坚持？因为写技术文章给我的太多了呀！](https://juejin.cn/post/7185891954083758136)(zxg_神说要有光/juejin/2023-01-15)
    '''
    links = []
    for index, article in enumerate(articles):
        links.append(
            f"{index+1}. [{article.title}]({article.url})({article.author}/{article.date}/{article.seed})")
    allLinks = '\n'.join(links)
    content = f"""
## 优质文章推送({datetime.date.today()})\n
{allLinks}
    """
    print(content)

    # 4. 发送到企业微信机器人
    sendBot(content)


def sendBot(content):
    '''发送到企微群'''
    # 使用参考：https://developer.work.weixin.qq.com/document/path/91770
    botUrl = 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=56cd179c-8107-411c-b3f6-9a589c5256af'
    res = requests.post(botUrl, data=json.dumps(
        {
            "msgtype": "markdown",
            "markdown": {
                "content": content
            }
        }))
    if res.status_code == 200:
        print('发送成功')
    else:
        print('发送失败')


if __name__ == '__main__':
    # 每天早上9点执行(参考：https://cloud.tencent.com/developer/article/1647955)
    # 获取3天内发布的文章
    # 如果是开发调试，可直接运行 runAll()
    # schedule.every().day.at("00:25").do(runAll)
    runAll()
    while True:
        schedule.run_pending()
        time.sleep(1)
