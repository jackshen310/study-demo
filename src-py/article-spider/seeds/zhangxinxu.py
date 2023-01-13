import requests
import json
from bs4 import BeautifulSoup

from base import Base, Article


class Zhangxinxu(Base):
    def __init__(self):
        super().__init__('zhangxinxu')
        self.url = 'https://www.zhangxinxu.com/wordpress/'

    def doCrawl(self):
        res = self.fetch()
        soup = BeautifulSoup(res.text, 'html.parser')
       # print(soup.prettify())
        articles = []
       # 遍历div.post这个selector
        for item in soup.find_all('div', attrs={'class': 'post'})[0:5]:
            url = f"{item.find('a')['href']}"
            title = item.find('a').text
            date = item.find('span').text
            date = date.replace('年', '-')
            date = date.replace('月', '-')
            date = date.replace('日', '')
            remark = item.find_all('p')[1].text
            author = '张鑫旭'
            if self.isValid(date):
                articles.append(
                    Article(title, url, date, author=author, remark=remark, seed=self.seed))
        return articles
