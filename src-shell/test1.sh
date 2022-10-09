#!/bin/bash

today=`date +%y%m%d`  # 执行命令（带格式化）并赋值给变量

echo "Today is $today"  # 使用变量

ls -al > tmp/$today # 输出定向 
# ls -al >> tmp/$today # 两个 `>>` 是追加数据

wc < tmp/$today # 输入重定向

my_var=$[4+5]  # 仅支持整数计算

my_var2=$(echo "scale=4; 4.1 * 5" | bc2) # 计算浮点数

echo "my_var=$my_var; my_var2=$my_var2"

# calculate the number of days between two dates
date1="Jan 1, 2020"
date2="May 1, 2020"

time1=$(date -v "$date1" +%s)
time2=$(date -v "$date2" +%s)

diff=$(expr $time2 - $time1)
secondsinday=$(expr 24 \* 60 \* 60)
days=$(expr $diff / $secondsinday)

echo "The difference between $date2 and $date1 is $days days"
