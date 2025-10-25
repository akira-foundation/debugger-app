use tauri::menu::{MenuBuilder, SubmenuBuilder, MenuItemBuilder};
use tauri::{AppHandle, Emitter, Manager};

pub fn build_menu(app_handle: &AppHandle) -> tauri::Result<tauri::menu::Menu<tauri::Wry>> {
    // Create about menu item
    let about_item = MenuItemBuilder::new("About Akira Debugger")
        .id("about")
        .enabled(true)
        .build(app_handle)?;

    // Create a menu with just the app name
    let app_menu = SubmenuBuilder::new(app_handle, "Akira Debugger")
        .item(&about_item)
        .build()?;

    let menu = MenuBuilder::new(app_handle)
        .item(&app_menu)
        .build()?;

    Ok(menu)
}

pub fn handle_menu_event(app: &AppHandle, menu_event_id: &tauri::menu::MenuId) {
    match menu_event_id.as_ref() {
        "about" => {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.emit("show_about", ());
            }
        }
        _ => {}
    }
}
