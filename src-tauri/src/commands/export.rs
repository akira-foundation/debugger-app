use tauri::AppHandle;
use tauri_plugin_dialog::DialogExt;

#[tauri::command]
pub async fn open_save_logs_dialog(app: AppHandle, format: String) -> Result<Option<String>, String> {
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
    Ok(filepath)
}

#[tauri::command]
pub async fn write_logs_to_file(filepath: String, content: String) -> Result<(), String> {
    use std::fs;

    fs::write(&filepath, &content)
        .map_err(|e| format!("Failed to write file: {}", e))
}
