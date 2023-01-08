from operator import itemgetter
from plotly.graph_objs import Bar
from plotly import offline
import requests

# 执行API调用并存储响应。
url = 'https://hacker-news.firebaseio.com/v0/topstories.json'
r = requests.get(url)
print(f"Status code: {r.status_code}")

# 处理有关每篇文章的信息。
submission_ids = r.json()
submission_dicts = []
for submission_id in submission_ids[:30]:
    # 对于每篇文章，都执行一个API调用。
    url = f"https://hacker-news.firebaseio.com/v0/item/{submission_id}.json"
    r = requests.get(url)
    print(f"id: {submission_id}\tstatus: {r.status_code}")
    response_dict = r.json()

    # 对于每篇文章，都创建一个字典。
    # print(response_dict)
    if "descendants" not in response_dict:
        response_dict['descendants'] = 0
    submission_dict = {
        'title': response_dict['title'],
        'hn_link': f"http://news.ycombinator.com/item?id={submission_id}",
        'comments': response_dict['descendants'],
    }
    submission_dicts.append(submission_dict)

submission_dicts = sorted(submission_dicts, key=itemgetter('comments'),
                          reverse=True)

titles, comments, labels = [], [], []
for submission_dict in submission_dicts:
    labels.append(submission_dict['title'])
    titles.append(
        f"<a href='{submission_dict['hn_link']}'>{submission_dict['title']}</a>")
    comments.append(submission_dict['comments'])


# 可视化。
data = [{
    'type': 'bar',
    'x': titles,
    'y': comments,
    'hovertext': labels,
    'marker': {
        'color': 'rgb(60, 100, 150)',
        'line': {'width': 1.5, 'color': 'rgb(25, 25, 25)'}
    },
    'opacity': 0.6,
}]

my_layout = {
    'title': 'hacker-news上最受欢迎的文章',
    'titlefont': {'size': 28},
    'xaxis': {
        'title': 'Repository',
        'titlefont': {'size': 24},
        'tickfont': {'size': 14},
    },
    'yaxis': {
        'title': 'Stars',
        'titlefont': {'size': 24},
        'tickfont': {'size': 14},
    },
}

fig = {'data': data, 'layout': my_layout}
offline.plot(fig, filename='submissions.html')
