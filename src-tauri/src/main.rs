// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod listener;
mod logger;

use tauri::Manager;
use std::sync::Arc;
use tokio::sync::Mutex;

#[tokio::main]
async fn main() {
    let app = tauri::Builder::default()
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
