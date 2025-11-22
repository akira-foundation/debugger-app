// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod logger;
mod menu;
mod server;
mod license;

use commands::{
    set_always_on_top, show_about, open_in_editor, open_url,
    validate_license, set_license_key, clear_license_cache,
    activate_trial, is_trial_active, get_trial_days_remaining,
    trial_was_used, clear_trial
};

#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .menu(menu::build_menu)
        .on_menu_event(|app, menu_event| {
            menu::handle_menu_event(app, menu_event.id());
        })
        .invoke_handler(tauri::generate_handler![
            set_always_on_top,
            show_about,
            open_in_editor,
            open_url,
            validate_license,
            set_license_key,
            clear_license_cache,
            activate_trial,
            is_trial_active,
            get_trial_days_remaining,
            trial_was_used,
            clear_trial
        ])
        .setup(|app| {
            let app_handle = app.handle().clone();

            tokio::spawn(async move {
                server::start_server(app_handle).await;
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
