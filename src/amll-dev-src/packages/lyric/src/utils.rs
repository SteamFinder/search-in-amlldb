#[cfg(target_arch = "wasm32")]
use wasm_bindgen::prelude::*;

use crate::LyricLine;

#[cfg_attr(target_arch = "wasm32", wasm_bindgen(start))]
/// When the `console_error_panic_hook` feature is enabled, we can call the
/// `set_panic_hook` function at least once during initialization, and then
/// we will get better error messages if our code ever panics.
///
/// For more details see
/// https://github.com/rustwasm/console_error_panic_hook#readme
pub fn wasm_start() {
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

pub fn process_lyrics(lines: &mut [LyricLine]) {
    lines.sort_by(|a, b| {
        a.words
            .first()
            .map(|x| x.start_time)
            .cmp(&b.words.first().map(|x| x.start_time))
    });
    for line in lines.iter_mut() {
        line.start_time = line.words.first().map(|x| x.start_time).unwrap_or(0);
        line.end_time = line.words.last().map(|x| x.end_time).unwrap_or(0);
    }
}
