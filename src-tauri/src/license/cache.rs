use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc, Duration};
use std::fs;
use std::path::PathBuf;
use crate::license::error::LicenseError;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct License {
    pub id: String,
    pub key: String,
    pub status: String,
    #[serde(rename = "type")]
    pub license_type: String,
    #[serde(rename = "expiresAt")]
    pub expires_at: Option<String>,
    #[serde(rename = "maxActivations")]
    pub max_activations: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CachedValidation {
    pub valid: bool,
    pub license: Option<License>,
    #[serde(rename = "daysRemaining")]
    pub days_remaining: Option<i64>,
    #[serde(rename = "validatedAt")]
    pub validated_at: String,
    #[serde(rename = "expiresAt")]
    pub expires_at: String,
    #[serde(rename = "cacheExpiresAt")]
    pub cache_expires_at: String,
    #[serde(rename = "isOnline")]
    pub is_online: bool,
}

pub struct CacheManager {
    cache_file: PathBuf,
}

impl CacheManager {
    pub fn new(config_dir: &PathBuf) -> Result<Self, LicenseError> {
        let cache_file = config_dir.join("license_cache.json");
        Ok(Self { cache_file })
    }

    pub fn get(&self) -> Result<Option<CachedValidation>, LicenseError> {
        if !self.cache_file.exists() {
            return Ok(None);
        }

        let contents = fs::read_to_string(&self.cache_file)?;
        let validation: CachedValidation = serde_json::from_str(&contents)?;

        let expires_at = DateTime::parse_from_rfc3339(&validation.expires_at)
            .map_err(|_| LicenseError::ValidationFailed)?
            .with_timezone(&Utc);

        if Utc::now() <= expires_at {
            return Ok(Some(validation));
        }

        self.clear().ok();
        Ok(None)
    }

    pub fn set(&self, validation: CachedValidation) -> Result<(), LicenseError> {
        let json = serde_json::to_string_pretty(&validation)?;
        fs::write(&self.cache_file, json)?;
        Ok(())
    }

    pub fn set_from_response(
        &self,
        valid: bool,
        license: Option<License>,
        days_remaining: Option<i64>,
    ) -> Result<(), LicenseError> {
        let now = Utc::now();
        let cache_expires_at = now + Duration::hours(24);
        let license_expires_at = now + Duration::hours(24);

        let cached = CachedValidation {
            valid,
            license,
            days_remaining,
            validated_at: now.to_rfc3339(),
            expires_at: license_expires_at.to_rfc3339(),
            cache_expires_at: cache_expires_at.to_rfc3339(),
            is_online: true,
        };

        self.set(cached)
    }

    pub fn clear(&self) -> Result<(), LicenseError> {
        if self.cache_file.exists() {
            fs::remove_file(&self.cache_file)?;
        }
        Ok(())
    }
}
