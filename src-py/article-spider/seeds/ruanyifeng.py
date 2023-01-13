import requests
from bs4 import BeautifulSoup

from base import Base, Article


class Ruanyifeng(Base):
    def __init__(self):
        super().__init__('ruanyifeng')
        self.url = 'https://www.ruanyifeng.com/blog/'
        self.method = 'get'

    def doCrawl(self):
        '''抓取逻辑'''
        res = self.fetch()
        res.encoding = 'utf-8'  # 需要设置一下编码，不然会有乱码
        soup = BeautifulSoup(res.text, 'html.parser')
        articles = []
        # 遍历li.module-list-item这个selector
        for item in soup.find_all('li', attrs={'class': 'module-list-item'})[0:5]:
            url = f"{item.find('a')['href']}"
            title = item.find('a').text
            date = item.find('span').text
            date = date.replace('年', '-')
            date = date.replace('月', '-')
            date = date.replace('日', '')
            date = date.replace('»', '')
            date = date.replace(' ', '')
            arr = date.split('-')
            if len(arr[2]) == 1:
                arr[2] = '0' + arr[2]
            date = '-'.join(arr)

            remark = ''
            author = '阮一峰'
            if self.isValid(date):
                articles.append(
                    Article(url, title, date, author=author, remark=remark, seed=self.seed))
        return articles
