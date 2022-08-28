extern crate web_sys;
use crate::utils::set_panic_hook;

use regex::Regex;
use serde::Serialize;
use std::convert::TryInto;
use wasm_bindgen::prelude::*;
use web_sys::console;

macro_rules! log {
    ( $( $t:tt )* ) => {
        web_sys::console::log_1(&format!( $( $t )* ).into());
    }
}

#[wasm_bindgen]
pub struct MaskHelper {
    image_data: Vec<u8>,
    width: u32,
    height: u32,
    re: Regex,
    re2: Regex,
}

#[wasm_bindgen]
impl MaskHelper {
    pub fn new() -> MaskHelper {
        set_panic_hook();
        let re = Regex::new(r"^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$").unwrap();
        let re2 = Regex::new(r"(\d(\.\d+)?)+").unwrap();

        let image_data = Vec::new();
        let width = 0;
        let height = 0;
        MaskHelper {
            image_data,
            re,
            re2,
            width,
            height,
        }
    }
    pub fn get_label_from_mask(&mut self, js_mask: &JsValue, color: &str, opacity: f32) {
        // let start = time();
        let mask: Mask = js_mask.into_serde().unwrap();
        let mat = &mask.Mat;
        let mode = mask.Mode;

        let rgbaColor = colorRgba(color, opacity, &self.re);

        // rgba颜色值
        let r = rgbaNum(&rgbaColor, 0, &self.re2) as u8;
        let g = rgbaNum(&rgbaColor, 1, &self.re2) as u8;
        let b = rgbaNum(&rgbaColor, 2, &self.re2) as u8;
        let a = 255;
        // timeEnd(start);
        let height = (mask.LT.Y - mask.RD.Y).abs() + 1;
        let width = (mask.LT.X - mask.RD.X).abs() + 1;
        let range = (height * width).try_into().unwrap();
        // println!("len, {},{}, {}", width, height, range);
        let mut data: Vec<u8> = (0..range * 4).map(|i| 0).collect();
        let mut continuityCode = Vec::new();
        if (mode == 2) {
            // let start = time();
            continuityCode = getContinuityCode(mat.to_vec(), range);
            // timeEnd(start, "getContinuityCode");
        }

        let mat2 = mat.to_vec();
        let mut idx = 0;
        for i in 0..range {
            let isOpacity = if mode == 1 {
                getBitmap(i.try_into().unwrap(), &mat2)
            } else {
                continuityCode[i] == 0
            };
            if (!isOpacity) {
                data[idx] = r;
                data[idx + 1] = g;
                data[idx + 2] = b;
                data[idx + 3] = a;
            }
            idx += 4;
        }
        // log!("len:{}", data.len());

        self.image_data = data;
        self.width = width as u32;
        self.height = height as u32;
    }

    pub fn get_infer_from_mask(&mut self, js_mask: &JsValue, color: &str) {
        // let start = time();
        let mask: Mask = js_mask.into_serde().unwrap();
        let mat = &mask.Mat;
        let mode = mask.Mode;
        let rgbaColor = colorRgba(color, 0.5, &self.re);
        // rgba颜色值
        let r = rgbaNum(&rgbaColor, 0, &self.re2) as u8;
        let g = rgbaNum(&rgbaColor, 1, &self.re2) as u8;
        let b = rgbaNum(&rgbaColor, 2, &self.re2) as u8;
        let a = (rgbaNum(&rgbaColor, 3, &self.re2) * 255.0) as u8;

        let height = (mask.LT.Y - mask.RD.Y).abs() + 1;
        let width = (mask.LT.X - mask.RD.X).abs() + 1;
        let range = (height * width).try_into().unwrap();

        let mut data: Vec<u8> = (0..range * 4).map(|i| 0).collect();
        let mut continuityCode = Vec::new();
        if (mode == 2) {
            // let start = time();
            continuityCode = getContinuityCode(mat.to_vec(), range);
            // timeEnd(start, "getContinuityCode");
        }
        let mat2 = mat.to_vec();
        let idx = 0;
        for i in 0..range {
            let isOpacity = if mode == 1 {
                getBitmap(i.try_into().unwrap(), &mat2)
            } else {
                continuityCode[i] == 0
            };
            let widthIndex = ((i as i32 + 1) % width) - 1;
            let heightIndex = ((i as i32 + 1) / width) - 1;
            let mut isAddDot = false;
            if (((widthIndex / 2) % 2 == 0 || ((widthIndex - 1) / 2) % 2 == 0)
                && ((heightIndex / 2) % 2 == 0 || ((heightIndex - 1) / 2) % 2 == 0))
            {
                isAddDot = true;
            }
            if (!isOpacity) {
                data[idx] = r;
                data[idx + 1] = g;
                data[idx + 2] = b;
                data[idx + 3] = if isAddDot { 255 } else { a };
            }
        }

        self.image_data = data;
        self.width = width as u32;
        self.height = height as u32;
    }

    pub fn width(&self) -> u32 {
        self.width
    }

    pub fn height(&self) -> u32 {
        self.height
    }
    pub fn image_data(&self) -> *const u8 {
        self.image_data.as_ptr()
    }

    pub fn greet(&self) {
        log!("hello world");
    }
}

/**
 *@desc JS颜色十六进制转换为rgb或rgba,返回的格式为 rgba（255，255，255，0.5）字符串
 * sHex为传入的十六进制的色值
 * alpha为rgba的透明度，默认为1
 */

fn colorRgba(sHex: &str, mut alpha: f32, RE: &Regex) -> String {
    if (alpha.is_nan()) {
        alpha = 1.0;
    }
    // println!("colorRgba, {}, {}", sHex, alpha);

    // 十六进制颜色值的正则表达式
    // let re = Regex::new(r"^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$").unwrap();
    /* 16进制颜色转为RGB格式 */
    let mut sColor = sHex.to_lowercase();
    // rgba(85,56,255,0.5)
    if (!sColor.is_empty() && RE.is_match(&sColor)) {
        if (sColor.len() == 4) {
            let mut sColorNew = String::from('#');
            for i in [1..4] {
                sColorNew += &sColor.get(i).unwrap().repeat(2);
            }
            sColor = sColorNew;
        }
        // 处理六位的颜色值
        let mut sColorChange: [i32; 4] = [0; 4];

        sColorChange[0] = i32::from_str_radix(&(sColor.get(1..3).unwrap()), 16).unwrap();

        // let mut n = 1;
        // while n < 7 {
        //     let num = i64::from_str_radix(&(sColor.get(n..n + 2).unwrap_or("")), 16);
        //     match num {
        //         Ok(d) => {
        //             sColorChange.push(d.to_string());
        //         }
        //         Err(e) => println!("Error: {}", e),
        //     }
        //     n += 2;
        // }

        return "rgba(".to_string()
            + &sColorChange.map(|d| d.to_string()).join(",")
            + ","
            + &alpha.to_string()
            + ")".into();
    } else {
        if alpha != 0.0 {
            return sColor
                .get(0..sColor.rfind(",").unwrap_or(1) + 1)
                .unwrap_or("")
                .to_string()
                + &alpha.to_string();
        } else {
            return sColor;
        }
    }
}

// 获取rgba里的数值(rgba:传入的rgba格式颜色值，index:想要获取第几位，有0、1、2、3)
fn rgbaNum(rgba: &str, index: usize, RE: &Regex) -> f32 {
    // println!("rgba:{},{}", rgba, index);
    // let re = Regex::new(r"(\d(\.\d+)?)+").unwrap();
    let caps = RE.captures_iter(rgba).nth(index).unwrap();
    let val = caps.get(0).map_or("0", |m| m.as_str());
    let num = val.to_string().parse::<f32>().unwrap();
    return num;
}

/**
 * 解析连续性编码数组
 * @param {*} mat 连续性编码数组
 * @param {*} range mask面积
 * @returns 0 1数组，表示mask每一个像素点是否透明
 */
fn getContinuityCode(mat: Vec<i64>, range: usize) -> Vec<u8> {
    let mut array: Vec<u8> = Vec::with_capacity(range);
    println!("getContinuityCode, {}", range);
    let mut start = 0;
    for i in 0..mat.len() {
        let val = if mat[i] < 0 { 0 } else { 1 };
        for j in start..(start + mat[i].abs()) {
            // array[j as usize] = val;
            array.push(val);
        }
        start = start + mat[i].abs();
    }
    return array;
}

/**
 * 解析bitmap
 * @param {number} n 第n个像素点
 * @param {Array} mat bitmap数组
 * @returns
 */
fn getBitmap(n: i32, mat: &Vec<i64>) -> bool {
    // n对应的元素 n / 32
    let row = n >> 5;
    // n对应的int中的位置，是 n mod 32
    let index = n & 0x1f;
    let result = mat[row as usize] & (1 << index);
    return result == 0;
}

#[derive(serde::Deserialize, Serialize, Debug, Clone)]
pub struct Point {
    X: i32,
    Y: i32,
}
#[derive(serde::Deserialize, Serialize, Debug, Clone)]
pub struct Mask {
    LT: Point,
    RD: Point,
    r#Mat: Vec<i64>,
    Mode: u8,
}

#[derive(serde::Deserialize, Serialize, Debug, Clone)]
pub struct Response {
    width: i32,
    height: i32,
}
