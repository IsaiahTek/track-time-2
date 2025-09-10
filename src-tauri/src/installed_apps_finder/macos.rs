pub fn list_installed_apps() -> Vec<String> {
    let mut apps = vec![];
    let paths = ["/Applications", &format!("{}/Applications", std::env::var("HOME").unwrap())];

    for path in paths {
        if let Ok(entries) = std::fs::read_dir(path) {
            for entry in entries.flatten() {
                let path = entry.path();
                if let Some(ext) = path.extension() {
                    if ext == "app" {
                        if let Some(name) = path.file_name().and_then(|n| n.to_str()) {
                            apps.push(name.to_string());
                        }
                    }
                }
            }
        }
    }

    apps
}
