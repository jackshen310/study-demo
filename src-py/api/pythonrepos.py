import requests

# 执行API调用并存储响应。
url = 'https://api.github.com/search/repositories?q=language:python&sort=stars'
headers = {'Accept': 'application/vnd.github.v3+json'}
r = requests.get(url, headers=headers)
print(f"Status code: {r.status_code}")
# 将API响应赋给一个变量。
response_dict = r.json()


print(f"Total repositories: {response_dict['total_count']}")

# 探索有关仓库的信息。
repo_dicts = response_dict['items']
print(f"Repositories returned: {len(repo_dicts)}")

for repo_dict in repo_dicts:
    print(f"\nName: {repo_dict['name']}")
    print(f"Owner: {repo_dict['owner']['login']}")
    print(f"Stars: {repo_dict['stargazers_count']}")
    print(f"Repository: {repo_dict['html_url']}")
    print(f"Description: {repo_dict['description']}")
