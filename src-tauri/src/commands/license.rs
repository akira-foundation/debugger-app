use crate::license::{LicenseManager, CachedValidation};

#[tauri::command]
pub async fn validate_license() -> Result<CachedValidation, String> {
    let manager = LicenseManager::new()
        .map_err(|e| e.to_string())?;

    manager.validate().await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn set_license_key(key: String, api_url: Option<String>) -> Result<(), String> {
    let manager = LicenseManager::new()
        .map_err(|e| e.to_string())?;

    manager.set_license_key(key, api_url)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn clear_license_cache() -> Result<(), String> {
    let manager = LicenseManager::new()
        .map_err(|e| e.to_string())?;

    manager.clear_cache()
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn activate_trial() -> Result<(), String> {
    let manager = LicenseManager::new()
        .map_err(|e| e.to_string())?;

    manager.activate_trial()
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn is_trial_active() -> Result<bool, String> {
    let manager = LicenseManager::new()
        .map_err(|e| e.to_string())?;

    Ok(manager.is_trial_active())
}

#[tauri::command]
pub async fn get_trial_days_remaining() -> Result<i64, String> {
    let manager = LicenseManager::new()
        .map_err(|e| e.to_string())?;

    Ok(manager.get_trial_days_remaining())
}

#[tauri::command]
pub async fn trial_was_used() -> Result<bool, String> {
    let manager = LicenseManager::new()
        .map_err(|e| e.to_string())?;

    Ok(manager.trial_was_used())
}

#[tauri::command]
pub async fn clear_trial() -> Result<(), String> {
    let manager = LicenseManager::new()
        .map_err(|e| e.to_string())?;

    manager.clear_trial()
        .map_err(|e| e.to_string())
}
