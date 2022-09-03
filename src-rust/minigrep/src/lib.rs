use std::error::Error;
use std::fs;
use std::{env, process};

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn case_sensitive() {
        let query = "duct";
        let contents = "\
               Rust:
               safe, fast, productive.
               Pick three.Duct tape.";

        assert_eq!(vec!["safe, fast, productive."], search(query, contents));
    }
    #[test]
    fn case_insensitive() {
        let query = "rUsT";
        let contents = "\
                                       Rust:
                                       safe, fast, productive.
                                       Pick three.
                                       Trust me.";
        assert_eq!(
            vec!["Rust:", "Trust me."],
            search_case_insensitive(query, contents)
        );
    }
}

pub struct Config {
    query: String,
    filename: String,
    case_sensitive: bool,
}

impl Config {
    // 返回Result，一般用于处理可能出错的场景
    pub fn new(mut args: env::Args) -> Result<Config, &'static str> {
        // if args.len() < 3 {
        //     return Err("not enough arguments");
        // }
        args.next();

        let query = match args.next() {
            Some(v) => v,
            None => return Err("query is not set"),
        };
        let filename = match args.next() {
            Some(v) => v,
            None => return Err("filename is not set"),
        };

        let case_sensitive = env::var("CASE_INSENSITIVE").is_err();

        Ok(Config {
            query,
            filename,
            case_sensitive,
        })
    }
}
/**
 * 1. 遍历内容的每一行。
 * 2. 检查当前行是否包含搜索字符串。
 * 3. 如果包含，则将其添加到返回值列表中。
 * 4. 如果不包含，则忽略。
 * 5. 返回匹配到的结果列表。
 */
fn search<'a>(query: &'a str, contents: &'a str) -> Vec<&'a str> {
    // let mut res = Vec::new();
    // for line in contents.lines() {
    //     if line.contains(&query) {
    //         res.push(line.trim());
    //     }
    // }
    // res

    // 通过迭代器重构
    contents
        .lines()
        .filter(|line| line.contains(query))
        .collect()
}

fn search_case_insensitive<'a>(query: &'a str, contents: &'a str) -> Vec<&'a str> {
    // let mut res = Vec::new();
    // let query = query.to_lowercase();
    // for line in contents.lines() {
    //     if line.to_lowercase().contains(&query) {
    //         res.push(line.trim());
    //     }
    // }
    // res

    // 用迭代器重构（性能更佳）
    let query = query.to_lowercase();
    contents
        .lines()
        .filter(|line| line.to_lowercase().contains(&query))
        .collect()
}
pub fn run(config: Config) -> Result<(), Box<dyn Error>> {
    let contents = fs::read_to_string(config.filename)?;

    // println!("{}", contents);
    let results = if config.case_sensitive {
        search(&config.query, &contents)
    } else {
        search_case_insensitive(&config.query, &contents)
    };

    for line in results.iter() {
        println!("found: {}", line); // 可以打印到文件 > output.txt
    }

    Ok(())
}
