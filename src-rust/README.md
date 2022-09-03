
get-started: https://www.rust-lang.org/zh-CN/learn/get-started

在线运行rust: https://play.rust-lang.org/

通过例子学 Rust:https://rustwiki.org/zh-CN/rust-by-example/


# 常用命令
使用 Rust 的编译器 rustc 可以从源程序生成可执行文件：
$ rustc hello.rs
使用 rustc 编译后将得到可执行文件 hello。
$ ./hello
Hello World!


用Cargo 管理
$ cargo new my-project # 初始化一个模块
$ cargo build # 编译
$ cargo run # 启动

测试
$ cargo new adder --lib  # 新增一个测试adder文件夹
$ cargo test  # 执行测试

