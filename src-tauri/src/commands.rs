use tauri::Window;
use std::process::Command;

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
    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .args(&["-a", "PhpStorm", "--args", &format!("{}:{}", file_path, line)])
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    #[cfg(target_os = "windows")]
    {
        Command::new("cmd")
            .args(&["/C", "start", "phpstorm", &format!("{}:{}", file_path, line)])
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    #[cfg(target_os = "linux")]
    {
        Command::new("phpstorm")
            .args(&[&format!("{}:{}", file_path, line)])
            .spawn()
            .map_err(|e| e.to_string())?;
    }

    Ok(())
}
