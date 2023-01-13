import datetime
import yaml
import os
from base import Base, Article

# 参考 https://zhuanlan.zhihu.com/p/379062852


class Weixin(Base):
    def __init__(self):
        super().__init__('weixin')
        self.url = 'https://mp.weixin.qq.com/cgi-bin/appmsg?action=list_ex&begin=0&count=5&fakeid=Mzk0MDMwMzQyOA==&type=9&query=&token=99816620&lang=zh_CN&f=json&ajax=1'
        self.method = 'get'
        print(os.curdir)
        print(os.path.abspath("src-py/article-spider/weixin.yaml"))
        with open(os.path.abspath("weixin.yaml"), "r") as file:
            file_data = file.read()
        config = yaml.safe_load(file_data)
        self.headers = {
            'Cookie': config['cookie']}

    def doCrawl(self):
        '''抓取逻辑'''
        res = self.fetch()
        response_dict = res.json()
        if response_dict['base_resp']['ret'] != 0:
            print(response_dict['base_resp'])
            raise Exception("微信抓取失败：" + response_dict['base_resp']['err_msg'])

        articles = []
        for item in response_dict['app_msg_list']:
            title = item['title']
            remark = ''
            url = f"{item['link']}"
            dd = datetime.date.fromtimestamp(
                int(item['create_time']))
            author = 'code秘密花园'
            date = dd.isoformat()
            if self.isValid(date):
                articles.append(
                    Article(url, title, date=date,
                            author=author, remark=remark, seed=self.seed)
                )
        return articles
