#[cfg(target_os = "linux")]
mod linux;

#[cfg(target_os = "macos")]
mod macos;

use linux::list_installed_gui_apps;

use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub struct AppInfo {
    pub name: String,       // Friendly name
    pub exec: String,       // Binary/process name
}

pub fn get_all_installed_apps() -> Vec<AppInfo> {
    // #[cfg(target_os = "windows")]
    // return list_installed_apps();

    #[cfg(target_os = "macos")]
    return list_installed_apps();

    #[cfg(target_os = "linux")]
    return list_installed_gui_apps();
}
