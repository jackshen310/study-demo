pub struct Breakfast {
    pub toast: String,
    seasonal_fruit: String, // 私有属性，只能在构造函数使用
}
impl Breakfast {
    pub fn summer(toast: &str) -> Breakfast {
        println!("summer2");
        Breakfast {
            toast: String::from(toast),
            seasonal_fruit: String::from("peaches"),
        }
    }
}
pub enum Appetizer {
    Soup,
    Salad,
}
fn fix_incorrect_order() {
    cook_order();
}
fn cook_order() {}
