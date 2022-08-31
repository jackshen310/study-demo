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
pub struct Timer<'a> {
    name: &'a str,
}

impl<'a> Timer<'a> {
    pub fn new(name: &'a str) -> Timer<'a> {
        console::time_with_label(name);
        Timer { name }
    }
}

impl<'a> Drop for Timer<'a> {
    fn drop(&mut self) {
        console::time_end_with_label(self.name);
    }
}

#[derive(PartialEq, Debug, Clone)]
enum MaskMode {
    BITMAP = 1,
    MAT = 2,
}
impl MaskMode {
    fn value_of(mode: u8) -> MaskMode {
        if mode == 1 {
            MaskMode::BITMAP
        } else {
            MaskMode::MAT
        }
    }
}

#[wasm_bindgen]
pub struct MaskHelper {
    label_data_list: Vec<Vec<u8>>,
    infer_data_list: Vec<Vec<u8>>,
    re: Regex,
    re2: Regex,
}

#[wasm_bindgen]
impl MaskHelper {
    pub fn new() -> MaskHelper {
        set_panic_hook();
        let re = Regex::new(r"^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$").unwrap();
        let re2 = Regex::new(r"(\d(\.\d+)?)+").unwrap();

        let label_data_list = Vec::new();
        let infer_data_list = Vec::new();

        MaskHelper {
            label_data_list,
            infer_data_list,
            re,
            re2,
        }
    }

    pub fn clear(&mut self) {
        self.label_data_list = Vec::new();
        self.infer_data_list = Vec::new();
    }

    pub fn get_label_from_mask(&mut self, js_mask: &JsValue, color: &str, opacity: f32) -> JsValue {
        // let start = time();
        let mask: Mask = js_mask.into_serde().unwrap();
        let mat = mask.Mat;
        let mode = MaskMode::value_of(mask.Mode);

        let rgbaColor = colorRgba(color, opacity, &self.re);

        // rgba颜色值
        let rgba = rgbaNum(&rgbaColor, &self.re2);
        let r = rgba[0] as u8;
        let g = rgba[1] as u8;
        let b = rgba[2] as u8;
        let a = 255;

        let height = (mask.LT.Y - mask.RD.Y).abs() + 1;
        let width = (mask.LT.X - mask.RD.X).abs() + 1;
        let range = (height * width).try_into().unwrap();
        let mut data: Vec<u8> = (0..range * 4).map(|i| 0).collect();

        if mode == MaskMode::MAT {
            // let _timer = Timer::new("mask mode is 2");
            let mut start: usize = 0;
            for i in 0..mat.len() {
                let isOpacity = if mat[i] < 0 { true } else { false };
                for j in start..(start + (mat[i].abs() as usize)) {
                    if (!isOpacity) {
                        data[j * 4] = r;
                        data[j * 4 + 1] = g;
                        data[j * 4 + 2] = b;
                        data[j * 4 + 3] = a;
                    }
                }
                start = start + (mat[i].abs() as usize);
            }
        } else {
            let _timer = Timer::new("mask mode is 1");
            let mut idx = 0;
            for i in 0..range {
                let isOpacity = getBitmap(i, &mat);
                if (!isOpacity) {
                    data[idx] = r;
                    data[idx + 1] = g;
                    data[idx + 2] = b;
                    data[idx + 3] = a;
                }
                idx += 4;
            }
        }
        self.label_data_list.push(data);

        let res = Response {
            width,
            height,
            index: self.label_data_list.len() - 1,
        };

        return JsValue::from_serde(&res).unwrap();
    }

    pub fn get_infer_from_mask(&mut self, js_mask: &JsValue, color: &str) -> JsValue {
        let mask: Mask = js_mask.into_serde().unwrap();
        let mat = mask.Mat;
        let mode = MaskMode::value_of(mask.Mode);
        let rgbaColor = colorRgba(color, 0.5, &self.re);

        // rgba颜色值
        let rgba = rgbaNum(&rgbaColor, &self.re2);
        let r = rgba[0] as u8;
        let g = rgba[1] as u8;
        let b = rgba[2] as u8;
        let a = (rgba[3] * 255.0) as u8;

        let height = (mask.LT.Y - mask.RD.Y).abs() + 1;
        let width = (mask.LT.X - mask.RD.X).abs() + 1;
        let range = (height * width).try_into().unwrap();

        let mut data: Vec<u8> = (0..range * 4).map(|i| 0).collect();

        if mode == MaskMode::MAT {
            // let _timer = Timer::new("mask mode is 2");
            let mut start: usize = 0;
            for i in 0..mat.len() {
                let isOpacity = if mat[i] < 0 { true } else { false };
                let isAddDot = getIsAddDot(i as i32, width);
                for j in start..(start + (mat[i].abs() as usize)) {
                    if (!isOpacity) {
                        data[j * 4] = r;
                        data[j * 4 + 1] = g;
                        data[j * 4 + 2] = b;
                        data[j * 4 + 3] = if isAddDot { 255 } else { a };
                    }
                }
                start = start + (mat[i].abs() as usize);
            }
        } else {
            let _timer = Timer::new("mask mode is 1");
            let mut idx = 0;
            for i in 0..range {
                let isOpacity = getBitmap(i, &mat);
                let isAddDot = getIsAddDot(i as i32, width);
                if (!isOpacity) {
                    data[idx] = r;
                    data[idx + 1] = g;
                    data[idx + 2] = b;
                    data[idx + 3] = if isAddDot { 255 } else { a };
                }
                idx += 4;
            }
        }

        self.infer_data_list.push(data);

        let res = Response {
            width,
            height,
            index: self.infer_data_list.len() - 1,
        };

        return JsValue::from_serde(&res).unwrap();
    }

    // 返回指向memory地址的指针
    pub fn label_data(&self, index: usize) -> *const u8 {
        self.label_data_list[index].as_ptr()
    }

    pub fn infer_data(&self, index: usize) -> *const u8 {
        self.infer_data_list[index].as_ptr()
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

    // 十六进制颜色值的正则表达式
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
        sColorChange[1] = i32::from_str_radix(&(sColor.get(3..5).unwrap()), 16).unwrap();
        sColorChange[2] = i32::from_str_radix(&(sColor.get(5..7).unwrap()), 16).unwrap();

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
fn rgbaNum(rgba: &str, RE: &Regex) -> [f32; 4] {
    let mut res: [f32; 4] = [0.0; 4];
    let mut idx = 0;
    for i in RE.captures_iter(rgba) {
        if (idx == 4) {
            break;
        }
        let val = i.get(0).map_or("0", |m| m.as_str());
        let num = val.to_string().parse::<f32>().unwrap();
        res[idx] = num;
        // log!("index: {}", idx);
        idx += 1
    }
    return res;
}

/**
 * 解析连续性编码数组
 * @param {*} mat 连续性编码数组
 * @param {*} range mask面积
 * @returns 0 1数组，表示mask每一个像素点是否透明
 */
// fn getContinuityCode(mat: &Vec<i64>, range: usize) -> Vec<u8> {
//     let mut array: Vec<u8> = Vec::with_capacity(range);
//     let mut start = 0;
//     for i in 0..mat.len() {
//         let val = if mat[i] < 0 { 0 } else { 1 };
//         for j in start..(start + mat[i].abs()) {
//             array.push(val);
//         }
//         start = start + mat[i].abs();
//     }
//     return array;
// }

/**
 * 解析bitmap
 * @param {number} n 第n个像素点
 * @param {Array} mat bitmap数组
 * @returns
 */
fn getBitmap(n: usize, mat: &Vec<i64>) -> bool {
    // n对应的元素 n / 32
    let row = n >> 5;
    // n对应的int中的位置，是 n mod 32
    let index = n & 0x1f;
    let result = mat[row as usize] & (1 << index);
    return result == 0;
}

fn getIsAddDot(i: i32, width: i32) -> bool {
    let mut isAddDot = false;
    let widthIndex = ((i as i32 + 1) % width) - 1;
    let heightIndex = ((i as i32 + 1) / width) - 1;
    let mut isAddDot = false;
    if (((widthIndex / 2) % 2 == 0 || ((widthIndex - 1) / 2) % 2 == 0)
        && ((heightIndex / 2) % 2 == 0 || ((heightIndex - 1) / 2) % 2 == 0))
    {
        isAddDot = true;
    }
    isAddDot
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
    index: usize,
    width: i32,
    height: i32,
}
