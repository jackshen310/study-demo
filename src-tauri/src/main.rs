#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

fn main() {
    use tauri::Manager;
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
                window.close_devtools();
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![mask_to_image_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
// use rustface::ImageData;

#[derive(serde::Deserialize, Serialize, Debug, Copy, Clone)]
struct Point {
    X: i32,
    Y: i32,
}
#[derive(serde::Deserialize, Serialize, Debug, Clone)]
struct Mask {
    LT: Point,
    RD: Point,
    r#Mat: Vec<i64>,
    Mode: u8,
}
#[derive(serde::Deserialize, Serialize, Debug, Clone)]
struct LabelItem {
    color: String,
    comment: String,
    id: String,
    points: Vec<Point>,
    shape: String,
    r#type: String,
    mask: Option<Mask>,
    maskData: Option<ImageData>,
}

#[derive(serde::Deserialize, Serialize, Debug, Clone)]
struct InferItem {
    color: String,
    comment: String,
    points: Vec<Point>,
    shape: String,
    r#type: String,
    mask: Option<Mask>,
    score: f32,
    maskData: Option<ImageData>,
}
#[derive(serde::Deserialize, Serialize, Debug, Clone)]
struct ImageData {
    data: Vec<u8>,
    width: i32,
    height: i32,
}
#[derive(serde::Serialize, Debug)]
struct Response {
    label: Label,
    infer: Infer,
    draw_image: bool,
    isError: bool,
    response_time: u64,
}

type Label = Vec<LabelItem>;
type Infer = Vec<InferItem>;

use bincode::config;
use std::time::{Duration, Instant};
use std::time::{SystemTime, UNIX_EPOCH};

#[tauri::command]
fn mask_to_image_data(
    app_handle: tauri::AppHandle,
    window: tauri::Window,
    filter: Vec<String>,
    label_opacity: String,
    draw_image: bool,
    mut label: Label,
    mut infer: Infer,
    request_time: u64,
) -> Option<Response> {
    // println!("filter: {:?}", filter);
    // println!("label_opacity: {}", label_opacity);
    // println!("draw_image: {}", draw_image);
    // println!("label: {:?}", label[0].mask);
    // println!("label: {:?}", infer[0].points);
    // println!("Window: {}", window.label());

    let time1 = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_millis();
    println!("to request:{}", time1 - (request_time as u128));

    let start = time();
    if (label.len() == 0 && infer.len() == 0) {
        return None;
    }
    let RE = Regex::new(r"^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$").unwrap();
    let RE2 = Regex::new(r"(\d(\.\d+)?)+").unwrap();
    if (filter.contains(&"ANNOTATION".to_string())) {
        let mut index = 0;

        while (index < label.len()) {
            // let start = time();
            let mut anno = &mut label[index];
            let color = &anno.color;
            let mask = anno.mask.as_ref();
            let isMask = mask.is_some();
            if (isMask == false) {
                continue;
            }
            anno.maskData = getImageDataFromMask(
                mask.unwrap(),
                color.to_string(),
                label_opacity.parse::<f32>().unwrap(),
                &RE,
                &RE2,
            );
            // timeEnd(start);
            index += 1;
            break;
        }
    }

    if (filter.contains(&"INFER".to_string())) {
        let mut index = 0;
        while (index < infer.len()) {
            let mut anno = &mut label[index];
            let color = &anno.color;
            let mask = anno.mask.as_ref();
            let isMask = mask.is_some();
            if (isMask == false) {
                continue;
            }
            anno.maskData = getInferFromMask(mask.unwrap(), color.to_string(), &RE, &RE2);
            index += 1;
        }
    }
    timeEnd(start, "mask to image data");

    let time2 = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_millis();
    println!("end...");

    let res = Some(Response {
        label,
        infer,
        draw_image,
        isError: false,
        response_time: time2 as u64,
    });
    // let encoded: Vec<u8> = bincode::serialize(&res).unwrap();
    // window.emit("mask", encoded);
    return res;
}

fn time() -> Instant {
    return Instant::now();
}
fn timeEnd(start: Instant, tag: &str) {
    let duration = start.elapsed();
    println!("{} is: {:?}", tag, duration);
}
fn getImageDataFromMask(
    mask: &Mask,
    color: String,
    opacity: f32,
    RE: &Regex,
    RE2: &Regex,
) -> Option<ImageData> {
    // let start = time();
    let mat = &mask.Mat;
    let mode = mask.Mode;

    let rgbaColor = colorRgba(color, opacity, RE);

    // rgba颜色值
    let r = rgbaNum(&rgbaColor, 0, &RE2) as u8;
    let g = rgbaNum(&rgbaColor, 1, &RE2) as u8;
    let b = rgbaNum(&rgbaColor, 2, &RE2) as u8;
    let a = 255;
    // timeEnd(start);
    let height = (mask.LT.Y - mask.RD.Y).abs() + 1;
    let width = (mask.LT.X - mask.RD.X).abs() + 1;
    let range = (height * width).try_into().unwrap();
    // println!("len, {},{}, {}", width, height, range);
    let mut data: Vec<u8> = Vec::with_capacity(range * 4);
    let mut continuityCode = Vec::new();
    if (mode == 2) {
        let start = time();
        continuityCode = getContinuityCode(mat.to_vec(), range);
        timeEnd(start, "getContinuityCode");
    }

    let mat2 = mat.to_vec();
    for i in 0..range {
        let isOpacity = if mode == 1 {
            getBitmap(i.try_into().unwrap(), &mat2)
        } else {
            continuityCode[i] == 0
        };
        data.push(if isOpacity { 0 } else { r });
        data.push(if isOpacity { 0 } else { g });
        data.push(if isOpacity { 0 } else { b });
        data.push(if isOpacity { 0 } else { a });
    }
    return Some(ImageData {
        data,
        width,
        height,
    });
    // return Some(ImageData {
    //     data,
    //     width,
    //     height,
    // });
}

// 生成推理结果
fn getInferFromMask(mask: &Mask, color: String, RE: &Regex, RE2: &Regex) -> Option<ImageData> {
    let mat = &mask.Mat;
    let mode = mask.Mode;
    let rgbaColor = colorRgba(color, 0.5, RE);
    // rgba颜色值
    let r = rgbaNum(&rgbaColor, 0, &RE2) as u8;
    let g = rgbaNum(&rgbaColor, 1, &RE2) as u8;
    let b = rgbaNum(&rgbaColor, 2, &RE2) as u8;
    let a = (rgbaNum(&rgbaColor, 3, &RE2) * 255.0) as u8;

    let height = (mask.LT.Y - mask.RD.Y).abs() + 1;
    let width = (mask.LT.X - mask.RD.X).abs() + 1;
    let range = (height * width).try_into().unwrap();

    let mut data: Vec<u8> = Vec::with_capacity(range * 4);
    let mut continuityCode = Vec::new();
    if (mode == 2) {
        let start = time();
        continuityCode = getContinuityCode(mat.to_vec(), range);
        timeEnd(start, "getContinuityCode");
    }
    let mat2 = mat.to_vec();
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
        data.push(if isOpacity { 0 } else { r });
        data.push(if isOpacity { 0 } else { g });
        data.push(if isOpacity { 0 } else { b });
        data.push(if isOpacity {
            0
        } else {
            if isAddDot {
                255
            } else {
                a
            }
        });
    }
    // return Some(ImageData::new(&data, width, height));
    return Some(ImageData {
        data,
        width,
        height,
    });
}

/**
 *@desc JS颜色十六进制转换为rgb或rgba,返回的格式为 rgba（255，255，255，0.5）字符串
 * sHex为传入的十六进制的色值
 * alpha为rgba的透明度，默认为1
 */
use regex::Regex;
use serde::Serialize;
use std::{any::Any, borrow::Borrow, num::ParseIntError};
fn colorRgba(sHex: String, mut alpha: f32, RE: &Regex) -> String {
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
