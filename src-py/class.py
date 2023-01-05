class Dog:
    """一次模拟小狗的简单尝试。"""

    def __init__(self, name, age):  # 构造方法
        """初始化属性name和age。"""
        self.name = name
        self.age = age

    def sit(self):  # self 相当于this
        """模拟小狗收到命令时蹲下。"""
        print(f"{self.name} is now sitting.")

    def roll_over(self):
        """模拟小狗收到命令时打滚。"""
        print(f"{self.name} rolled over!")


dog = Dog("jack", 2)
dog.sit()


class MyDog(Dog):  # class继承
    def __init__(self, name, age):
        super().__init__(name, age)  # 调用父类构造方法

    def sit(self):
        print("nothing!")


myDog = MyDog("jack", 2)
myDog.sit()
