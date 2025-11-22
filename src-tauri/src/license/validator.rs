use serde::{Deserialize, Serialize};
use serde_json::json;
use sha2::{Sha256, Digest};
use hex::encode as hex_encode;
use crate::license::error::LicenseError;
use crate::license::cache::License;
use crate::license::config::LicenseConfig;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ValidationResponse {
    pub valid: bool,
    pub message: Option<String>,
    pub license: Option<License>,
    #[serde(rename = "daysRemaining")]
    pub days_remaining: Option<i64>,
}

pub struct LicenseValidator;

impl LicenseValidator {
    pub async fn validate_online(
        config: &LicenseConfig,
    ) -> Result<ValidationResponse, LicenseError> {
        let license_key = config
            .license_key
            .as_ref()
            .ok_or(LicenseError::InvalidLicenseKey)?;

        let machine_hash = Self::get_machine_hash();

        let client = reqwest::Client::new();
        let response = client
            .post(format!("{}/validate", config.api_url))
            .json(&json!({
                "key": license_key,
                "machineHash": machine_hash,
                "userAgent": "Akira Debugger",
            }))
            .send()
            .await
            .map_err(|e| LicenseError::RequestError(e.to_string()))?;

        if !response.status().is_success() {
            return Ok(ValidationResponse {
                valid: false,
                message: Some(format!("Validation failed: {}", response.status())),
                license: None,
                days_remaining: None,
            });
        }

        let data = response
            .json::<ValidationResponse>()
            .await
            .map_err(|e| LicenseError::RequestError(e.to_string()))?;

        Ok(data)
    }

    fn get_machine_hash() -> String {
        let data = format!(
            "akira_debugger_{}",
            std::env::consts::OS
        );
        let mut hasher = Sha256::new();
        hasher.update(data.as_bytes());
        hex_encode(hasher.finalize())
    }
}
