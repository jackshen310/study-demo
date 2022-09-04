fn main() {
    let x = 5;
    let y = &x;

    assert_eq!(5, *y); // 解引用

    let z = Box::new(5);

    assert_eq!(5, *z); // 解引用

    // 引用计算，共享内存
    let a = Rc::new(Cons(5, Rc::new(Cons(10, Rc::new(Nil)))));
    let b = Cons(3, Rc::clone(&a));
    let c = Cons(4, Rc::clone(&a));
}

enum List {
    Cons(i32, Rc<List>),
    Nil,
}
use crate::List::{Cons, Nil};
use std::rc::Rc;
