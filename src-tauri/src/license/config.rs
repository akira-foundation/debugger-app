use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use crate::license::error::LicenseError;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LicenseConfig {
    #[serde(rename = "licenseKey")]
    pub license_key: Option<String>,
    #[serde(rename = "apiUrl")]
    pub api_url: String,
    #[serde(rename = "cacheExpireHours")]
    pub cache_expire_hours: u32,
}

impl Default for LicenseConfig {
    fn default() -> Self {
        Self {
            license_key: None,
            api_url: "https://packages.akira-io.com/api/licenses".to_string(),
            cache_expire_hours: 24,
        }
    }
}

pub struct ConfigManager {
    config_file: PathBuf,
}

impl ConfigManager {
    pub fn new(config_dir: &PathBuf) -> Result<Self, LicenseError> {
        let config_file = config_dir.join("license_config.json");
        Ok(Self { config_file })
    }

    pub fn load(&self) -> Result<LicenseConfig, LicenseError> {
        if self.config_file.exists() {
            let contents = fs::read_to_string(&self.config_file)?;
            let config: LicenseConfig = serde_json::from_str(&contents)?;
            Ok(config)
        } else {
            Ok(LicenseConfig::default())
        }
    }

    pub fn save(&self, config: &LicenseConfig) -> Result<(), LicenseError> {
        let json = serde_json::to_string_pretty(config)?;
        fs::write(&self.config_file, json)?;
        Ok(())
    }

    pub fn set_license_key(&self, key: String, api_url: Option<String>) -> Result<(), LicenseError> {
        let mut config = self.load()?;
        config.license_key = Some(key);
        if let Some(url) = api_url {
            config.api_url = url;
        }
        self.save(&config)?;
        Ok(())
    }
}
