def greet_user(username):  # 函数定义
    """显示简单的问候语。"""  # 函数文档
    message = f"Hello {username}"
    print(message)
    return message


greet_user("jack")  # 位置实参
greet_user(username="shen")  # 关键字实参数


def greet_user2(*usernames):  # 参数不固定
    for username in usernames:
        print(f"Hello {username}")


greet_user2("Andy", "Joly")
