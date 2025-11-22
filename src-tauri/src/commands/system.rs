use std::process::Command;

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
