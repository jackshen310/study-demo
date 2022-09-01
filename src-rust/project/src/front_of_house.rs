// 模块概念学习
pub mod hosting {
    pub fn add_to_waitlist() {}
    pub fn add_to_waitlist2() {}
}

// 使用use 引入模块
// self:: 从当前文件找
// use self::front_of_house::hosting;
// use std::collections::HashMap; // 引入标准库中的包

// 使用pub use重导出名称
// pub use self::front_of_house::hosting;
