import datetime
import requests
import json


class Base:
    def __init__(self, seed):
        print("Base constructor")
        self.url = None
        self.method = 'get'
        self.body = None
        self.headers = None
        self.seed = seed

    def run(self):
        try:
            return self.doCrawl()
        except BaseException:
            print(f"抓取失败 seed={self.seed}")

    def fetch(self, index=None):
        if self.method == 'get':
            if index is not None:
                res = requests.get(
                    self.url[index], headers=self.headers[index])
            else:
                res = requests.get(self.url, headers=self.headers)
        else:
            if index is not None:
                res = requests.post(self.url[index], data=json.dumps(
                    self.body[index]), headers=self.headers[index])
            else:
                res = requests.post(self.url, data=json.dumps(
                    self.body), headers=self.headers)
        print(f"Status code: {res.status_code}")
        return res

    def doCrawl(self):
        raise Exception("Not implemented")

    def isValid(self, date):
        '''按照发布日期过滤文章(发布日期为3天内)'''
        today = datetime.date.today()
        beginDate = (today + datetime.timedelta(days=-3)
                     ).isoformat()  # 减3天(不含今天)
        endDate = today.isoformat()
        if date >= beginDate and date <= endDate:
            return True
        return False


class Article:
    def __init__(self, url, title, date, author=None, remark=None, seed=None):
        self.url = url
        self.title = title
        self.remark = remark
        self.date = date
        self.author = author
        self.seed = seed

    def __repr__(self):  # 类似toString方法
        return "{" + f"url={self.url}, title={self.title}, remark={self.remark}, date={self.date}, author={self.author}" + "}"
