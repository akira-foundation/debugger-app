// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod logger;
mod menu;
mod server;

use commands::{set_always_on_top, show_about, open_in_editor};

#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .menu(menu::build_menu)
        .on_menu_event(|app, menu_event| {
            menu::handle_menu_event(app, menu_event.id());
        })
        .invoke_handler(tauri::generate_handler![set_always_on_top, show_about, open_in_editor])
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
