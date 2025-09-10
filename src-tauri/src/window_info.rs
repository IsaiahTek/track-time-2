use std::path::PathBuf;

use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub struct WindowInfo {
    pub title: String,
    pub process_path: PathBuf,
    pub app_name: String,
    pub window_id: String,
    pub process_id: u64,
}
