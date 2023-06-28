import this  # python之禅
msg = "hello world"
print(msg)
print(msg.title())  # 单词首字符大写

first = "jack"
last = "shen"
full_name = f"{first} {last}"  # 字符串合并
print(full_name)

print(" python ".strip())  # 去掉字符串两边空白

print(3**2)  # **表示3的二次方

bicycles = ['trek', 'cannondale', 'redline', 'specialized']
print(bicycles[0])  # 数组
bicycles.append("abc")  # 插入
del bicycles[1]  # 删除
bicycles.sort(reverse=True)  # 排序
print(bicycles[-1])

for bicyle in bicycles:  # 数组遍历
    print(bicyle)

for r in range(1, 6):
    print(r)

cars = ['audi', 'bmw', 'subaru', 'toyota']
for car in cars:
    if car == 'bmw':  # if 语句
        print(car.upper())
    elif "audi" in cars:  # in(not in) 语法
        print(car)
    else:
        print(car.title())

maps = {"first_name": "jack"}  # 字典
maps["last_name"] = "shen"
maps["age"] = 18
for key, value in maps.items():  # 遍历
    print(f"\nkey:{key}")
    print(f"value:{value}")

response_dict = {'by': 'ea016', 'id': 34296785, 'score': 1, 'time': 1673161202,
                 'title': 'PhotoRoom Is Hiring a Fullstack API Developer (OpenAPI, Python, React) in Paris', 'type': 'job', 'url': 'https://jobs.lever.co/photoroom/29260c53-a84f-4d4f-a322-3bdc8540cdb7?lever-origin=applied&lever-source%5B%5D=yc'}
if "descendants" not in response_dict:
    response_dict["descendants"] = "abc"
print(response_dict["descendants"])
