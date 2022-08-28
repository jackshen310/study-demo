extern crate web_sys;

use wasm_bindgen::prelude::*;
use web_sys::console;

macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}

#[wasm_bindgen]
pub struct Mask {
    width: u32,
    height: u32,
}

#[wasm_bindgen]
impl Mask {
    pub fn new() -> Mask {
        Mask {
            width: 100,
            height: 100,
        }
    }
    pub fn greet(&self) {
        log!("hello world");
    }
}
