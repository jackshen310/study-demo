from bs4 import BeautifulSoup

from base import Base, Article


class Cssforest(Base):
    def __init__(self):
        super().__init__('cssforest')
        self.url = 'https://www.cssforest.org/'
        self.method = 'get'

    def doCrawl(self):
        '''抓取逻辑'''
        res = self.fetch()
        soup = BeautifulSoup(res.text, 'html.parser')
        articles = []
        for item in soup.find_all('section', attrs={'class': 'listing'})[0:5]:
            url = f"https://www.cssforest.org/{item.find('a')['href']}"
            title = item.find('a').text
            remark = ''
            date = item.find('time')['datetime']
            author = 'CSS森林'
            if self.isValid(date):
                articles.append(
                    Article(title, url, date, author=author, seed=self.seed))
        return articles
