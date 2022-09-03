mod back_of_house;
mod front_of_house;

use front_of_house::hosting;

pub fn eat_at_restaurant() {
    hosting::add_to_waitlist2();
    // 通过相对模块找
    // front_of_house::hosting::add_to_waitlist();
    front_of_house::hosting::add_to_waitlist(); // 等价上一句
    front_of_house::hosting::add_to_waitlist2(); // 等价上一句

    let mut meal = back_of_house::Breakfast::summer("Rye");
    meal.toast = String::from("Wheat");

    println!("eat_at_restaurant, {}", meal.toast);
}

use std::collections::HashMap;
pub fn test_hash_map() {
    let text = "hello world wonderful world";
    let mut map = HashMap::new();

    for word in text.split_whitespace() {
        // 基于旧值更新新值
        let count = map.entry(word).or_insert(0);
        *count += 1; // 用 * 对count进行解引用
    }
    println!("hash map {:?}", map);
}

pub fn test_handle_error() {
    // panic!("worse...");
    let v = vec![1, 2, 3];
    v[99];
}

use std::fs::{self, File};
use std::io::{self, ErrorKind, Read};

pub fn test_create_file() {
    let f = File::open("./hello.txt");

    let f = match f {
        Ok(file) => file,
        Err(error) => match error.kind() {
            ErrorKind::NotFound => match File::create("./hello.txt") {
                Ok(f) => f,
                Err(err) => panic!("create file error"),
            },
            other => {
                panic!("create file error");
            }
        },
    };
}

pub fn test_create_file02() {
    // 第一种做法
    let f = File::open("./hello.txt").map_err(|error| {
        if (error.kind() == ErrorKind::NotFound) {
            File::create("./hello.txt").unwrap_or_else(|err| {
                panic!("create file error {}", err);
            })
        } else {
            panic!("create file error {}", error);
        }
    });
}

pub fn test_write_to_string() -> Result<String, io::Error> {
    // 第一种做法
    let f = File::open("./hello.txt");

    let mut f = match f {
        Ok(file) => file,
        Err(err) => return Err(err),
    };

    let mut s = String::new();

    match f.read_to_string(&mut s) {
        Ok(_) => Ok(s),
        Err(err) => return Err(err),
    }
}

pub fn test_write_to_string02() -> Result<String, io::Error> {
    // 第一种做法
    let mut f = File::open("./hello.txt")?;

    let mut s = String::new();

    f.read_to_string(&mut s)?;

    Ok(s)
}

// 更简便的写法，一步到位
pub fn test_write_to_string03() -> Result<String, io::Error> {
    fs::read_to_string("./hello.txt")
}

pub fn largest<T: PartialOrd + Copy>(list: &[T]) -> T {
    let mut max = list[0];
    for &item in list.iter() {
        if (max < item) {
            max = item;
        }
    }
    return max;
}

// trait 类似interfaces
pub trait Summary {
    fn summarize(&self) -> String;
}

pub struct NewsArticle {
    pub headline: String,
    pub location: String,
    pub author: String,
    pub content: String,
}
impl Summary for NewsArticle {
    fn summarize(&self) -> String {
        format!("{}, by {} ({})", self.headline, self.author, self.location)
    }
}
pub struct Tweet {
    pub username: String,
    pub content: String,
    pub reply: bool,
    pub retweet: bool,
}
impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("{}: {}", self.username, self.content)
    }
}

// 指定实现接口
pub fn notify(item: impl Summary) {
    println!("Breaking news! {}", item.summarize());
}

use std::fmt::Debug;
use std::fmt::Display;
pub struct Pair<T> {
    x: T,
    y: T,
}
impl<T> Pair<T> {
    fn new(x: T, y: T) -> Self {
        Self { x, y }
    }
}
impl<T: Display + PartialOrd + Debug> Pair<T> {
    fn cmp_display(&self) {
        if self.x >= self.y {
            println!("The largest member is x = {}", self.x);
        } else {
            println!("The largest member is y = {}", self.y);
        }
    }
}

pub fn test_pair() {
    let p = Pair::new(1, 2);

    p.cmp_display();
}
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() {
        x
    } else {
        y
    }
}

struct ImportantExcerpt<'a> {
    part: &'a str,
}
fn test_a() {
    let novel = String::from("Call me Ishmael. Some years ago...");
    let first_sentence = novel.split('.').next().expect("Could not find a '.'");
    let i = ImportantExcerpt {
        part: first_sentence,
    };
}
