use std::process::Command;

#[tauri::command]
pub async fn open_in_editor(file_path: String, line: u64) -> Result<(), String> {
    let line_str = line.to_string();

    let result = if cfg!(target_os = "macos") {
        Command::new("/Applications/PhpStorm.app/Contents/MacOS/phpstorm")
            .args(&["--line", &line_str, &file_path])
            .spawn()
            .or_else(|_| {
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
