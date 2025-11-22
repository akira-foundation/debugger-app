use aes_gcm::aead::{Aead, KeyInit, Payload};
use aes_gcm::{Aes256Gcm, Nonce};
use rand::Rng;
use sha2::{Digest, Sha256};
use crate::license::error::LicenseError;

pub struct TrialEncryption;

impl TrialEncryption {
    fn derive_key() -> [u8; 32] {
        let machine_id = Self::get_machine_id();
        let mut hasher = Sha256::new();
        hasher.update(machine_id.as_bytes());
        let result = hasher.finalize();
        let mut key = [0u8; 32];
        key.copy_from_slice(&result[..32]);
        key
    }

    fn get_machine_id() -> String {
        use std::process::Command;

        #[cfg(target_os = "macos")]
        {
            if let Ok(output) = Command::new("ioreg")
                .args(&["-rd1", "-c", "IOPlatformExpertDevice"])
                .output()
            {
                if let Ok(text) = String::from_utf8(output.stdout) {
                    if let Some(line) = text.lines().find(|l| l.contains("IOPlatformUUID")) {
                        if let Some(uuid) = line.split('"').nth(3) {
                            return uuid.to_string();
                        }
                    }
                }
            }
        }

        #[cfg(target_os = "windows")]
        {
            if let Ok(output) = Command::new("powershell")
                .args(&["-Command", "Get-WmiObject Win32_ComputerSystemProduct | Select-Object -ExpandProperty UUID"])
                .output()
            {
                if let Ok(text) = String::from_utf8(output.stdout) {
                    return text.trim().to_string();
                }
            }
        }

        #[cfg(target_os = "linux")]
        {
            if let Ok(text) = std::fs::read_to_string("/etc/machine-id") {
                return text.trim().to_string();
            }
        }

        "unknown".to_string()
    }

    pub fn encrypt(data: &str) -> Result<String, LicenseError> {
        let key = Self::derive_key();
        let cipher = Aes256Gcm::new_from_slice(&key)
            .map_err(|_| LicenseError::EncryptionError("Invalid key".to_string()))?;

        let mut rng = rand::thread_rng();
        let mut nonce_bytes = [0u8; 12];
        rng.fill(&mut nonce_bytes);
        let nonce = Nonce::from(nonce_bytes);

        let ciphertext = cipher
            .encrypt(&nonce, Payload::from(data.as_bytes()))
            .map_err(|_| LicenseError::EncryptionError("Encryption failed".to_string()))?;

        let mut encrypted = nonce_bytes.to_vec();
        encrypted.extend_from_slice(&ciphertext);

        Ok(hex::encode(encrypted))
    }

    pub fn decrypt(encrypted: &str) -> Result<String, LicenseError> {
        let key = Self::derive_key();
        let cipher = Aes256Gcm::new_from_slice(&key)
            .map_err(|_| LicenseError::EncryptionError("Invalid key".to_string()))?;

        let encrypted_bytes = hex::decode(encrypted)
            .map_err(|_| LicenseError::EncryptionError("Invalid hex".to_string()))?;

        if encrypted_bytes.len() < 12 {
            return Err(LicenseError::EncryptionError("Invalid encrypted data".to_string()));
        }

        let (nonce_bytes, ciphertext) = encrypted_bytes.split_at(12);
        let nonce = Nonce::from(std::array::from_fn(|i| nonce_bytes[i]));

        let plaintext = cipher
            .decrypt(&nonce, Payload::from(ciphertext))
            .map_err(|_| LicenseError::EncryptionError("Decryption failed".to_string()))?;

        String::from_utf8(plaintext)
            .map_err(|_| LicenseError::EncryptionError("Invalid UTF-8".to_string()))
    }
}
