use tauri::{Window, AppHandle};
use std::process::Command;
use crate::license::{LicenseManager, CachedValidation};
use tauri_plugin_dialog::DialogExt;

#[tauri::command]
pub async fn set_always_on_top(window: Window, always_on_top: bool) -> Result<(), String> {
    window.set_always_on_top(always_on_top)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn show_about() -> Result<String, String> {
    Ok(r#"
Akira Debugger
Version 0.1.0

A lightweight debugging tool for PHP applications.
Monitor and analyze application logs in real-time.
"#.to_string())
}

#[tauri::command]
pub async fn open_in_editor(file_path: String, line: u64) -> Result<(), String> {
    let line_str = line.to_string();

    // Try to open with phpstorm using full path or fallback to system command
    let result = if cfg!(target_os = "macos") {
        // Try to use the full path to PhpStorm on macOS
        Command::new("/Applications/PhpStorm.app/Contents/MacOS/phpstorm")
            .args(&["--line", &line_str, &file_path])
            .spawn()
            .or_else(|_| {
                // Fallback to phpstorm command
                Command::new("phpstorm")
                    .args(&["--line", &line_str, &file_path])
                    .spawn()
            })
    } else {
        Command::new("phpstorm")
            .args(&["--line", &line_str, &file_path])
            .spawn()
    };

    result.map_err(|e| format!("Failed to open editor: {}", e.to_string()))?;
    Ok(())
}

#[tauri::command]
pub async fn validate_license() -> Result<CachedValidation, String> {
    let manager = LicenseManager::new()
        .map_err(|e| e.to_string())?;

    manager.validate().await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn set_license_key(key: String, api_url: Option<String>) -> Result<(), String> {
    let manager = LicenseManager::new()
        .map_err(|e| e.to_string())?;

    manager.set_license_key(key, api_url)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn clear_license_cache() -> Result<(), String> {
    let manager = LicenseManager::new()
        .map_err(|e| e.to_string())?;

    manager.clear_cache()
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn activate_trial() -> Result<(), String> {
    let manager = LicenseManager::new()
        .map_err(|e| e.to_string())?;

    manager.activate_trial()
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn is_trial_active() -> Result<bool, String> {
    let manager = LicenseManager::new()
        .map_err(|e| e.to_string())?;

    Ok(manager.is_trial_active())
}

#[tauri::command]
pub async fn get_trial_days_remaining() -> Result<i64, String> {
    let manager = LicenseManager::new()
        .map_err(|e| e.to_string())?;

    Ok(manager.get_trial_days_remaining())
}

#[tauri::command]
pub async fn trial_was_used() -> Result<bool, String> {
    let manager = LicenseManager::new()
        .map_err(|e| e.to_string())?;

    Ok(manager.trial_was_used())
}

#[tauri::command]
pub async fn clear_trial() -> Result<(), String> {
    let manager = LicenseManager::new()
        .map_err(|e| e.to_string())?;

    manager.clear_trial()
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn open_url(url: String) -> Result<(), String> {
    let result = if cfg!(target_os = "macos") {
        Command::new("open")
            .arg(&url)
            .spawn()
    } else if cfg!(target_os = "windows") {
        Command::new("cmd")
            .args(&["/C", "start", &url])
            .spawn()
    } else {
        Command::new("xdg-open")
            .arg(&url)
            .spawn()
    };

    result.map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub async fn get_memory_usage() -> Result<u64, String> {
    #[cfg(target_os = "macos")]
    {
        use std::process::Command as StdCommand;

        let output = StdCommand::new("ps")
            .args(&["-p", &std::process::id().to_string(), "-o", "rss="])
            .output()
            .map_err(|e| e.to_string())?;

        let rss_str = String::from_utf8_lossy(&output.stdout);
        let rss_kb: u64 = rss_str.trim().parse()
            .map_err(|_| "Failed to parse memory usage".to_string())?;

        Ok(rss_kb)
    }

    #[cfg(not(target_os = "macos"))]
    {
        Ok(0)
    }
}

#[tauri::command]
pub async fn export_logs(app: AppHandle, content: String, format: String) -> Result<Option<String>, String> {
    use std::fs;
    use tokio::sync::oneshot;

    let timestamp = chrono::Local::now().format("%Y-%m-%d");
    let filename = format!("logs-{}.{}", timestamp, format);

    let filter_name = match format.as_str() {
        "json" => "JSON files",
        "csv" => "CSV files",
        _ => "All files",
    };
    let filter_extension = format.as_str();

    let (tx, rx) = oneshot::channel();
    let mut tx = Some(tx);

    app
        .dialog()
        .file()
        .add_filter(filter_name, &[filter_extension])
        .set_file_name(&filename)
        .save_file(move |file_path| {
            if let Some(tx) = tx.take() {
                let path_str = file_path.map(|p| p.to_string());
                let _ = tx.send(path_str);
            }
        });

    let filepath = rx.await.ok().flatten();

    match filepath {
        Some(path) => {
            fs::write(&path, &content)
                .map_err(|e| format!("Failed to write file: {}", e))?;
            Ok(Some(path))
        }
        None => Ok(None),
    }
}