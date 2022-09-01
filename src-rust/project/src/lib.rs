mod back_of_house;
mod front_of_house;

// use crate::back_of_house;
// use crate::front_of_house;

pub fn eat_at_restaurant() {
    // 通过相对模块找
    // front_of_house::hosting::add_to_waitlist();
    front_of_house::hosting::add_to_waitlist(); // 等价上一句
    front_of_house::hosting::add_to_waitlist2(); // 等价上一句

    let mut meal = back_of_house::Breakfast::summer("Rye");
    meal.toast = String::from("Wheat");

    println!("eat_at_restaurant, {}", meal.toast);
}
