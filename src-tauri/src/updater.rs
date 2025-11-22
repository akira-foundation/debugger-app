use tauri::AppHandle;
use tauri::updater::Update;

pub async fn check_for_updates(app: AppHandle) {
    match app.updater().check().await {
        Ok(update) => {
            if update.is_update_available() {
                log_update_available(&update);

                if let Err(e) = install_update(app, update).await {
                    eprintln!("Failed to install update: {}", e);
                }
            }
        }
        Err(e) => {
            eprintln!("Failed to check for updates: {}", e);
        }
    }
}

async fn install_update(app: AppHandle, update: Update) -> Result<(), Box<dyn std::error::Error>> {
    update.download_and_install().await?;
    app.restart();
    Ok(())
}

fn log_update_available(update: &Update) {
    println!(
        "Update available: {} (current: {})",
        update.latest_version(),
        update.current_version()
    );
}
