use std::fs;

use super::AppInfo;
// use std::path::Path;

pub fn list_installed_gui_apps() -> Vec<AppInfo> {
    let paths = [
        "/usr/share/applications",
        "/usr/local/share/applications",
        "/var/lib/snapd/desktop/applications",
        &format!("{}/.local/share/applications", std::env::var("HOME").unwrap()),
    ];

    let mut apps = Vec::new();

    for path in paths {
        if let Ok(entries) = fs::read_dir(path) {
            for entry in entries.flatten() {
                let path = entry.path();
                if path.extension().map_or(false, |e| e == "desktop") {
                    if let Ok(content) = fs::read_to_string(&path) {
                        let no_display = content.contains("NoDisplay=true");
                        let hidden = content.contains("Hidden=true");
                        let terminal = content.contains("Terminal=true");
                        if no_display || hidden || terminal {
                            continue;
                        }

                        let name = extract_field(&content, "Name");
                        let exec = extract_field(&content, "Exec");

                        if let (Some(name), Some(exec)) = (name, exec) {
                            apps.push(AppInfo { name, exec });
                        }
                    }
                }
            }
        }
    }
    apps.sort_by(|a, b| a.name.cmp(&b.name));
    apps
}

fn extract_field(content: &str, field: &str) -> Option<String> {
    for line in content.lines() {
        if let Some(value) = line.strip_prefix(&format!("{field}=")) {
            if field == "Exec" {
                let mut parts = value.split_whitespace();
                while let Some(part) = parts.next() {
                    if part == "env" || part.contains('=') {
                        continue;
                    }
                    return Some(part.trim().to_string());
                }
                return None;
            }
            return Some(value.trim().to_string());
        }
    }
    None
}

