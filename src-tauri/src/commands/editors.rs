use crate::editor_manager::Editor;

#[tauri::command]
pub fn get_available_editors() -> Vec<(String, String)> {
    Editor::all()
        .iter()
        .map(|editor| (editor.identifier().to_string(), editor.name().to_string()))
        .collect()
}

#[tauri::command]
pub fn get_installed_editors() -> Vec<(String, String)> {
    Editor::all()
        .iter()
        .filter(|editor| editor.is_installed())
        .map(|editor| (editor.identifier().to_string(), editor.name().to_string()))
        .collect()
}

#[tauri::command]
pub fn check_editor_installed(editor_id: String) -> bool {
    Editor::from_identifier(&editor_id)
        .map(|editor| editor.is_installed())
        .unwrap_or(false)
}

#[tauri::command]
pub fn open_in_editor_v2(file_path: String, line: u64, editor_id: String) -> Result<(), String> {
    let editor = Editor::from_identifier(&editor_id)
        .ok_or_else(|| format!("Unknown editor: {}", editor_id))?;

    editor.open_file(&file_path, line)
}
