message = ''
count = 0
while message != "quit":
    message = input("Enter...")  # 捕获键盘输入
    count += 1
    if count >= 5:
        print("Too many attempts")
        break
