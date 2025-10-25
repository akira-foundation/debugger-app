// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod listener;
mod logger;

use tauri::menu::{Menu, MenuBuilder, SubmenuBuilder};


#[tauri::command]
async fn set_always_on_top(window: tauri::Window, always_on_top: bool) -> Result<(), String> {
    window.set_always_on_top(always_on_top)
        .map_err(|e| e.to_string())
}

#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .menu(|app_handle| {
            // Create a menu with just the app name
            let app_menu = SubmenuBuilder::new(app_handle, "Akira Debugger")
                .build()?;

            let menu = MenuBuilder::new(app_handle)
                .item(&app_menu)
                .build()?;
            Ok(menu)
        })
        .invoke_handler(tauri::generate_handler![set_always_on_top])
        .setup(|app| {
            let app_handle = app.handle().clone();

            tokio::spawn(async move {
                listener::start_listener("127.0.0.1", 23517, app_handle).await;
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
