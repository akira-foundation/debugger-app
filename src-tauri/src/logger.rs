use chrono::Local;
use serde_json::{json, Value};
use tauri::{AppHandle, Emitter};
use uuid::Uuid;

fn unescape_html(s: &str) -> String {
    s.replace("&amp;", "&")
        .replace("&lt;", "<")
        .replace("&gt;", ">")
        .replace("&quot;", "\"")
        .replace("&#039;", "'")
}

fn strip_html_and_scripts(s: &str) -> String {
    let mut result = s.to_string();

    // Remove <script>...</script> blocks (case insensitive)
    loop {
        let lower = result.to_lowercase();
        if let Some(start) = lower.find("<script") {
            if let Some(end) = lower[start..].find("</script>") {
                result.drain(start..start + end + 9);
            } else {
                break;
            }
        } else {
            break;
        }
    }

    // Remove <style>...</style> blocks (case insensitive)
    loop {
        let lower = result.to_lowercase();
        if let Some(start) = lower.find("<style") {
            if let Some(end) = lower[start..].find("</style>") {
                result.drain(start..start + end + 8);
            } else {
                break;
            }
        } else {
            break;
        }
    }

    // Remove all HTML tags
    loop {
        if let Some(start) = result.find('<') {
            if let Some(end) = result[start..].find('>') {
                result.drain(start..start + end + 1);
            } else {
                break;
            }
        } else {
            break;
        }
    }

    result.trim().to_string()
}

pub fn process_log(payload: &str, app: &AppHandle) {
    let now = Local::now().format("%H:%M:%S").to_string();

    if let Ok(json) = serde_json::from_str::<Value>(payload) {
        if let Some(payloads) = json.get("payloads") {
            let empty_vec = vec![];
            let items = payloads.as_array().unwrap_or(&empty_vec);

            for item in items {
                let log_type = item
                    .get("type")
                    .and_then(|t| t.as_str())
                    .unwrap_or("log")
                    .to_lowercase();

                let content = item.get("content").cloned().unwrap_or(Value::Null);

                // Handle label - send to frontend to attach to last log
                if log_type == "label" {
                    let label_text = content
                        .get("label")
                        .and_then(|c| c.as_str())
                        .unwrap_or("Unknown");

                    let label_event = json!({
                        "type": "attach-label",
                        "label": label_text,
                    });

                    let _ = app.emit("attach-label", &label_event);
                    continue;
                }

                // Handle color - send to frontend to attach to last log
                if log_type == "color" {
                    if let Some(color_str) = content.get("color").and_then(|c| c.as_str()) {
                        let color_event = json!({
                            "color": color_str,
                        });

                        let _ = app.emit("attach-color", &color_event);
                    }
                    continue;
                }

                // Regular log - process and attach pending label
                let origin = item.get("origin");
                let file = origin
                    .and_then(|o| o.get("file"))
                    .and_then(|f| f.as_str())
                    .unwrap_or("unknown");

                let line = origin
                    .and_then(|o| o.get("line_number"))
                    .and_then(|l| l.as_u64())
                    .unwrap_or(0);

                let file_clean = file.split('/').last().unwrap_or("unknown").to_string();

                let values = content
                    .get("values")
                    .and_then(|v| v.as_array())
                    .cloned()
                    .unwrap_or_else(|| vec![content.clone()]);

                let mut content_lines = Vec::new();
                for value in values {
                    if value == Value::Null {
                        continue;
                    }

                    match &value {
                        Value::String(s) => {
                            let cleaned = strip_html_and_scripts(s);
                            let unescaped = unescape_html(&cleaned);
                            if unescaped.is_empty() {
                                continue;
                            }
                            content_lines.push(unescaped);
                        }
                        Value::Object(_) | Value::Array(_) => {
                            let pretty = serde_json::to_string_pretty(&value)
                                .unwrap_or_else(|_| value.to_string());
                            let cleaned = strip_html_and_scripts(&pretty);
                            let unescaped = unescape_html(&cleaned);
                            content_lines.push(unescaped);
                        }
                        _ => {
                            let stringified = value.to_string();
                            let cleaned = strip_html_and_scripts(&stringified);
                            let unescaped = unescape_html(&cleaned);
                            content_lines.push(unescaped);
                        }
                    }
                }

                // Check if item has explicit color
                let color = item
                    .get("color")
                    .and_then(|c| c.as_str())
                    .unwrap_or("default")
                    .to_lowercase();

                let mut log_entry = json!({
                    "id": Uuid::new_v4().to_string(),
                    "timestamp": now,
                    "type": log_type.to_lowercase(),
                    "location": format!("{}:{}", file_clean, line),
                    "content": content_lines,
                    "color": color,
                });

                let _ = app.emit("log-entry", &log_entry);
            }
        }
    }
}
