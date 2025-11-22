use chrono::Utc;
use std::fs;
use crate::license::error::LicenseError;
use crate::license::config::ConfigManager;
use crate::license::cache::{CacheManager, CachedValidation};
use crate::license::trial::TrialManager;
use crate::license::validator::LicenseValidator;

pub struct LicenseManager {
    config_manager: ConfigManager,
    cache_manager: CacheManager,
    trial_manager: TrialManager,
}

impl LicenseManager {
    pub fn new() -> Result<Self, LicenseError> {
        let config_dir = directories::ProjectDirs::from("io", "akira", "Akira Debugger")
            .ok_or(LicenseError::DirectoryError)?
            .config_dir()
            .to_path_buf();

        fs::create_dir_all(&config_dir)?;

        let config_manager = ConfigManager::new(&config_dir)?;
        let cache_manager = CacheManager::new(&config_dir)?;
        let trial_manager = TrialManager::new(&config_dir)?;

        Ok(Self {
            config_manager,
            cache_manager,
            trial_manager,
        })
    }

    pub async fn validate(&self) -> Result<CachedValidation, LicenseError> {
        let config = self.config_manager.load()?;

        // try online validation first
        if config.license_key.is_some() {
            if let Ok(response) = LicenseValidator::validate_online(&config).await {
                if response.valid {
                    self.cache_manager.set_from_response(
                        true,
                        response.license.clone(),
                        response.days_remaining,
                    )?;

                    let now = Utc::now();
                    return Ok(CachedValidation {
                        valid: true,
                        license: response.license,
                        days_remaining: response.days_remaining,
                        validated_at: now.to_rfc3339(),
                        expires_at: now.to_rfc3339(),
                        cache_expires_at: now.to_rfc3339(),
                        is_online: true,
                    });
                }
            }
        }

      // try offline validation if online validation failed
        if let Ok(Some(cached)) = self.cache_manager.get() {
            return Ok(CachedValidation {
                is_online: false,
                ..cached
            });
        }

        // return an invalid license if both online and offline validations fail
        let now = Utc::now();
        Ok(CachedValidation {
            valid: false,
            license: None,
            days_remaining: None,
            validated_at: now.to_rfc3339(),
            expires_at: now.to_rfc3339(),
            cache_expires_at: now.to_rfc3339(),
            is_online: false,
        })
    }

    pub fn set_license_key(&self, key: String, api_url: Option<String>) -> Result<(), LicenseError> {
        self.config_manager.set_license_key(key, api_url)
    }

    pub fn clear_cache(&self) -> Result<(), LicenseError> {
        self.cache_manager.clear()
    }

    pub fn activate_trial(&self) -> Result<(), LicenseError> {
        self.trial_manager.activate()
    }

    pub fn is_trial_active(&self) -> bool {
        self.trial_manager.is_active()
    }

    pub fn get_trial_days_remaining(&self) -> i64 {
        self.trial_manager.days_remaining()
    }

    pub fn trial_was_used(&self) -> bool {
        self.trial_manager.was_used()
    }

    pub fn clear_trial(&self) -> Result<(), LicenseError> {
        self.trial_manager.clear()
    }
}
