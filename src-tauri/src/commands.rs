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
    let line_str = line.to_string();

    // Simply open the file directly at the specified line
    // PhpStorm will recognize the Laravel project automatically
    Command::new("phpstorm")
        .args(&["--line", &line_str, &file_path])
        .spawn()
        .map_err(|e| e.to_string())?;

    Ok(())
}
