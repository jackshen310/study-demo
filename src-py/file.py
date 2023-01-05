
import json

filename = "./data/pi_digits.txt"
try:
    with open(filename) as f:  # 打开文件
        str = f.read().rstrip()
except FileNotFoundError:
    print(f"the file {filename} does not exist")
else:
    print(str)  # 读取所有内容

with open("./data/pi_digits.txt") as f:
    lines = f.readlines()  # 读取所有行

pi_str = ""
for line in lines:
    pi_str += line.strip()
print(pi_str)


try:
    val = 5 / 0
except ZeroDivisionError:  # 异常处理
    print("Invalid value")
    val = 0

print(val)

with open("./data/numbers.json") as f:
    numbers = json.load(f)  # 加载json文件
    print(numbers)


with open("./data/username.json", "w") as f:
    json.dump("xxxx", f)  # 写入json文件
