use chrono::{DateTime, Utc};
use serde_json::{json, Value};
use std::fs;
use std::path::PathBuf;
use crate::license::error::LicenseError;

pub struct TrialManager {
    trial_file: PathBuf,
}

impl TrialManager {
    pub fn new(config_dir: &PathBuf) -> Result<Self, LicenseError> {
        let trial_file = config_dir.join("trial_status.json");
        Ok(Self { trial_file })
    }

    pub fn activate(&self) -> Result<(), LicenseError> {
        if self.trial_file.exists() {
            return Err(LicenseError::TrialAlreadyUsed);
        }

        let trial_data = json!({
            "started_at": Utc::now().to_rfc3339(),
        });

        let json = serde_json::to_string_pretty(&trial_data)?;
        fs::write(&self.trial_file, json)?;
        Ok(())
    }

    pub fn is_active(&self) -> bool {
        if !self.trial_file.exists() {
            return false;
        }

        if let Ok(contents) = fs::read_to_string(&self.trial_file) {
            if let Ok(data) = serde_json::from_str::<Value>(&contents) {
                if let Some(started_at_str) = data.get("started_at").and_then(|v| v.as_str()) {
                    if let Ok(started_at) = DateTime::parse_from_rfc3339(started_at_str) {
                        let start = started_at.with_timezone(&Utc);
                        let days_elapsed = (Utc::now() - start).num_days();
                        return days_elapsed < 7;
                    }
                }
            }
        }
        false
    }

    pub fn days_remaining(&self) -> i64 {
        if !self.trial_file.exists() {
            return 0;
        }

        if let Ok(contents) = fs::read_to_string(&self.trial_file) {
            if let Ok(data) = serde_json::from_str::<Value>(&contents) {
                if let Some(started_at_str) = data.get("started_at").and_then(|v| v.as_str()) {
                    if let Ok(started_at) = DateTime::parse_from_rfc3339(started_at_str) {
                        let start = started_at.with_timezone(&Utc);
                        let days_elapsed = (Utc::now() - start).num_days();
                        return std::cmp::max(0, 7 - days_elapsed);
                    }
                }
            }
        }
        0
    }

    pub fn was_used(&self) -> bool {
        self.trial_file.exists()
    }

    pub fn clear(&self) -> Result<(), LicenseError> {
        if self.trial_file.exists() {
            fs::remove_file(&self.trial_file)?;
        }
        Ok(())
    }
}
