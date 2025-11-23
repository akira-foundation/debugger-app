use std::process::Command;

#[derive(Debug, Clone, Copy)]
pub enum Editor {
    VSCode,
    PhpStorm,
    Cursor,
}

impl Editor {
    pub fn all() -> &'static [Editor] {
        &[Editor::VSCode, Editor::PhpStorm, Editor::Cursor]
    }

    pub fn name(&self) -> &'static str {
        match self {
            Editor::VSCode => "VSCode",
            Editor::PhpStorm => "PhpStorm",
            Editor::Cursor => "Cursor",
        }
    }

    pub fn identifier(&self) -> &'static str {
        match self {
            Editor::VSCode => "vscode",
            Editor::PhpStorm => "phpstorm",
            Editor::Cursor => "cursor",
        }
    }

    pub fn from_identifier(id: &str) -> Option<Editor> {
        match id {
            "vscode" => Some(Editor::VSCode),
            "phpstorm" => Some(Editor::PhpStorm),
            "cursor" => Some(Editor::Cursor),
            _ => None,
        }
    }

    pub fn is_installed(&self) -> bool {
        match self {
            Editor::VSCode => {
                if cfg!(target_os = "macos") {
                    Command::new("ls")
                        .arg("/Applications/Visual Studio Code.app")
                        .output()
                        .map(|output| output.status.success())
                        .unwrap_or(false)
                } else {
                    Command::new("which")
                        .arg("code")
                        .output()
                        .map(|output| output.status.success())
                        .unwrap_or(false)
                }
            }
            Editor::PhpStorm => {
                if cfg!(target_os = "macos") {
                    Command::new("ls")
                        .arg("/Applications/PhpStorm.app")
                        .output()
                        .map(|output| output.status.success())
                        .unwrap_or(false)
                } else {
                    Command::new("which")
                        .arg("phpstorm")
                        .output()
                        .map(|output| output.status.success())
                        .unwrap_or(false)
                }
            }
            Editor::Cursor => {
                if cfg!(target_os = "macos") {
                    Command::new("ls")
                        .arg("/Applications/Cursor.app")
                        .output()
                        .map(|output| output.status.success())
                        .unwrap_or(false)
                } else {
                    Command::new("which")
                        .arg("cursor")
                        .output()
                        .map(|output| output.status.success())
                        .unwrap_or(false)
                }
            }
        }
    }

    pub fn open_file(&self, file_path: &str, line: u64) -> Result<(), String> {
        let line_str = line.to_string();

        match self {
            Editor::VSCode => {
                let file_with_line = format!("{}:{}", file_path, line);
                let result = if cfg!(target_os = "macos") {
                    Command::new("open")
                        .args(&["-a", "Visual Studio Code", &file_with_line])
                        .spawn()
                } else if cfg!(target_os = "windows") {
                    Command::new("code").arg(&file_with_line).spawn()
                } else {
                    Command::new("code").arg(&file_with_line).spawn()
                };

                result.map_err(|e| format!("Failed to open VSCode: {}", e))?;
            }
            Editor::PhpStorm => {
                let result = if cfg!(target_os = "macos") {
                    Command::new("/Applications/PhpStorm.app/Contents/MacOS/phpstorm")
                        .args(&["--line", &line_str, file_path])
                        .spawn()
                        .or_else(|_| {
                            Command::new("phpstorm")
                                .args(&["--line", &line_str, file_path])
                                .spawn()
                        })
                } else {
                    Command::new("phpstorm")
                        .args(&["--line", &line_str, file_path])
                        .spawn()
                };

                result.map_err(|e| format!("Failed to open PhpStorm: {}", e))?;
            }
            Editor::Cursor => {
                let result = if cfg!(target_os = "macos") {
                    Command::new("/Applications/Cursor.app/Contents/MacOS/Cursor")
                        .args(&[file_path, format!(":{}", line).as_str()])
                        .spawn()
                        .or_else(|_| {
                            Command::new("cursor")
                                .args(&[file_path, format!(":{}", line).as_str()])
                                .spawn()
                        })
                } else {
                    Command::new("cursor")
                        .args(&[file_path, format!(":{}", line).as_str()])
                        .spawn()
                };

                result.map_err(|e| format!("Failed to open Cursor: {}", e))?;
            }
        }

        Ok(())
    }
}
