//! ASS 字幕文件的导出
//!
//! 注意导出会损失 10 毫秒以内的精度
//!
//! 主唱名称会变为 `v1`，对唱会变为 `v2`
//! 如果是背景歌词则会在名称后面加上后缀 `-bg`
//! 如果是译文则会在名称后面加上后缀 `-trans`
//! 如果是音译则会在名称后面加上后缀 `-roman`
use crate::*;
use std::fmt::Write;

#[cfg(target_arch = "wasm32")]
use wasm_bindgen::prelude::*;

fn write_timestamp(result: &mut String, time: u64) {
    let ms = time % 1000;
    let sec = (time - ms) / 1000;
    let min = (sec - sec % 60) / 60;
    let hour = (min - min % 60) / 60;

    write!(result, "{}:{:02}:{:02}.{:02}", hour, min, sec % 60, ms / 10).unwrap()
}

pub fn stringify_ass(lines: &[LyricLine]) -> String {
    let mut result = String::with_capacity(
        lines
            .iter()
            .map(|x| x.words.iter().map(|x| x.word.len() + 20).sum::<usize>())
            .sum(),
    );

    result.push_str("[Script Info]\n");
    result.push_str("[Events]\n");
    result.push_str(
        "Formats: Marked, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n",
    );

    for line in lines {
        result.push_str("Dialogue: 0,");
        let start_time = line.words.iter().map(|x| x.start_time).min();
        let end_time = line.words.iter().map(|x| x.end_time).max();
        if start_time.is_none() || end_time.is_none() {
            continue;
        }
        let start_time = start_time.unwrap();
        let end_time = end_time.unwrap();
        write_timestamp(&mut result, start_time);
        result.push_str(", ");
        write_timestamp(&mut result, end_time);
        result.push_str(", Default, ");
        if line.is_duet {
            result.push_str("v2");
        } else {
            result.push_str("v1");
        }
        if line.is_bg {
            result.push_str("-bg");
        }
        result.push_str(",0,0,0,,");
        for word in &line.words {
            let duration = word.end_time.saturating_sub(word.start_time) / 10;
            result.push_str("{\\k");
            write!(&mut result, "{duration}").unwrap();
            result.push('}');
            result.push_str(&word.word);
        }
        result.push('\n');
        if !line.translated_lyric.is_empty() {
            result.push_str("Dialogue: 0,");
            write_timestamp(&mut result, start_time);
            result.push_str(", ");
            write_timestamp(&mut result, end_time);
            result.push_str(", Default, ");
            if line.is_duet {
                result.push_str("v2");
            } else {
                result.push_str("v1");
            }
            if line.is_bg {
                result.push_str("-bg");
            }
            result.push_str("-trans");
            result.push_str(",0,0,0,,");
            result.push_str(&line.translated_lyric);
            result.push('\n');
        }
        if !line.roman_lyric.is_empty() {
            result.push_str("Dialogue: 0,");
            write_timestamp(&mut result, start_time);
            result.push_str(", ");
            write_timestamp(&mut result, end_time);
            result.push_str(", Default, ");
            if line.is_duet {
                result.push_str("v2");
            } else {
                result.push_str("v1");
            }
            if line.is_bg {
                result.push_str("-bg");
            }
            result.push_str("-roman");
            result.push_str(",0,0,0,,");
            result.push_str(&line.roman_lyric);
            result.push('\n');
        }
    }

    result
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen(js_name = "stringifyAss", skip_typescript)]
pub fn stringify_ass_js(lrc: JsValue) -> String {
    let lines: Vec<LyricLine> = serde_wasm_bindgen::from_value(lrc).unwrap();
    stringify_ass(&lines)
}
