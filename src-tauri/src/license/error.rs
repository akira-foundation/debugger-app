use thiserror::Error;

#[derive(Error, Debug)]
pub enum LicenseError {
    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),

    #[error("Serialization error: {0}")]
    SerializationError(#[from] serde_json::error::Error),

    #[error("Request error: {0}")]
    RequestError(String),

    #[error("Invalid license key")]
    InvalidLicenseKey,

    #[error("License validation failed")]
    ValidationFailed,

    #[error("Trial already used on this device")]
    TrialAlreadyUsed,

    #[error("Directory error")]
    DirectoryError,

    #[error("Encryption error: {0}")]
    EncryptionError(String),
}
