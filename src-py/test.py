import unittest
from func import greet_user


class NamesTestCase(unittest.TestCase):
    def setUp(self) -> None:  # 初始化，共享变量
        print("setUp called")

    def test_greet_user(self):
        self.assertEqual(greet_user("jack"), "Hello jack")


unittest.main()  # 执行单元测试
