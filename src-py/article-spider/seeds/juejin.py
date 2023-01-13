import datetime

from base import Base, Article


class Juejin(Base):
    def __init__(self):
        print("init juejin config")
        super().__init__('juejin')
        self.url = ['https://api.juejin.cn/recommend_api/v1/article/recommend_cate_feed?aid=2608&spider=0',
                    'https://api.juejin.cn/content_api/v1/article/query_list?aid=2608&uuid=7176827274266773048&spider=0']
        self.method = ['post', 'post']
        self.body = [
            {"id_type": 2,
             "sort_type": 7,
             "cate_id": "6809637767543259144",
             "cursor": "0",
             "limit": 3
             }, {
                "cursor": "0",
                "sort_type": 2,
                "user_id": "3949101466785709"
            }]
        self.headers = [{
            'Content-Type': 'application/json'}, {
            'Content-Type': 'application/json'}]

    def doCrawl(self):
        '''抓取逻辑'''
        articles = []
        for index in range(len(self.url)):
            res = self.fetch(index)
            response_dict = res.json()

            for item in response_dict['data']:
                title = item['article_info']['title']
                remark = item['article_info']['brief_content']
                url = f"https://juejin.cn/post/{item['article_info']['article_id']}"
                print(item['article_info']['ctime'])
                dd = datetime.date.fromtimestamp(
                    int(item['article_info']['ctime']))
                author = item['author_user_info']['user_name']
                date = dd.isoformat()
                # 推荐的文章不过滤，个人文章需要过滤
                if self.isValid(date) or index == 0:
                    articles.append(
                        Article(url, title, date=date,
                                author=author, remark=remark, seed=self.seed)
                    )
        return articles
