use tauri::AppHandle;
use tauri_plugin_updater::UpdaterExt;

pub async fn check_for_updates(app: AppHandle) {
    match app.updater().expect("failed to create updater").check().await {
        Ok(Some(update)) => {
            println!("Update available: {}", update.version);

            if let Err(e) = update.download_and_install(
                |_chunk_len, _total| {},
                || {}
            ).await {
                eprintln!("Failed to install update: {}", e);
            } else {
                app.restart();
            }
        }
        Ok(None) => {
            println!("App is up to date");
        }
        Err(e) => {
            eprintln!("Failed to check for updates: {}", e);
        }
    }
}
