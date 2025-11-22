#[tauri::command]
pub async fn show_about() -> Result<String, String> {
    Ok(r#"
Akira Debugger
Version 0.1.0

A lightweight debugging tool for PHP applications.
Monitor and analyze application logs in real-time.
"#.to_string())
}
