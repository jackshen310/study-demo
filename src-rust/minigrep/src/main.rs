use minigrep::{run, Config};
use std::{env, process};

fn main() {
    let args: Vec<String> = env::args().collect();

    let config = Config::new(&args).unwrap_or_else(|err| {
        eprintln!("parse error: {}", err); // 标准错误，打印到控制台
        process::exit(1);
    });

    if let Err(e) = run(config) {
        eprintln!("Application error: {}", e); // 标准错误，打印到控制台
        process::exit(1);
    }
}
