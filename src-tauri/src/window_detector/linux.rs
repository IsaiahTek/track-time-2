// linux.rs

extern crate x11;

use x11::xlib::{XOpenDisplay, XGetInputFocus, XFetchName, XCloseDisplay};
use std::ptr;

pub fn get_active_window_title_linux() -> String {
    unsafe {
        let display = XOpenDisplay(ptr::null());
        if display.is_null() {
            return String::from("Unable to open display");
        }

        let mut window: u64 = 0;
        let mut revert: i32 = 0;
        XGetInputFocus(display, &mut window, &mut revert);
        let mut title: *mut i8 = std::ptr::null_mut();

        if XFetchName(display, window, &mut title) != 0 && !title.is_null() {
            let title_str = std::ffi::CStr::from_ptr(title).to_string_lossy().to_string();
            XCloseDisplay(display);
            return title_str;
        }

        XCloseDisplay(display);
        String::from("Unknown window")
    }
}
