// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

use active_win_pos_rs::get_active_window;
use installed_apps_finder::get_all_installed_apps;

mod window_info;

use window_info::WindowInfo;

use installed_apps_finder::AppInfo;

mod installed_apps_finder;

#[tauri::command]
fn select_window() -> Option<WindowInfo> {
    match get_active_window() {
        Ok(active_window) => {
            println!("Active window title: {}", active_window.app_name);
            println!("Process path: {}", active_window.process_path.display());
            // Additional information can be accessed here
            return Some(WindowInfo{title: active_window.title, process_path: active_window.process_path, app_name: active_window.app_name, window_id: active_window.window_id, process_id: active_window.process_id});
        }
        Err(err) =>{
            eprintln!("Failed to get active window: {:?}", err);
            None
        } 
    }
}

#[tauri::command]
fn get_all_apps()->Vec<AppInfo>{
    return  get_all_installed_apps();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![get_all_apps, select_window])
        // .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}                                                                                           
