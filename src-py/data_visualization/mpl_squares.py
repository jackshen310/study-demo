import matplotlib.pyplot as plt
plt.rcParams['font.sans-serif'] = ['SimHei']
# Matplotlib中设置字体-黑体，解决Matplotlib中文乱码问题
plt.rcParams['axes.unicode_minus'] = False
# Seaborn中设置字体-黑体，解决Seaborn中文乱码问题
input_values = [1, 2, 3, 4, 5]
squares = [1, 4, 9, 16, 25]

plt.style.use("seaborn")
fig, ax = plt.subplots()
ax.plot(input_values, squares, linewidth=3)

# 设置图表标题并给坐标轴加上标签1。
ax.set_title("平方数", fontsize=24)
ax.set_xlabel("值", fontsize=14)
ax.set_ylabel("值的平方", fontsize=14)

# 设置刻度标记的大小。
ax.tick_params(axis='both', labelsize=14)

plt.show()
