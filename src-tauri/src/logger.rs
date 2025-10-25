use chrono::Local;
use serde_json::{json, Value};
use tauri::{AppHandle, Emitter};
use uuid::Uuid;

// ============================================================================
// HTML Processing
// ============================================================================

fn unescape_html(s: &str) -> String {
    s.replace("&amp;", "&")
        .replace("&lt;", "<")
        .replace("&gt;", ">")
        .replace("&quot;", "\"")
        .replace("&#039;", "'")
}

fn strip_html_and_scripts(s: &str) -> String {
    let mut result = s.to_string();
    remove_tag_content(&mut result, "script", 9);
    remove_tag_content(&mut result, "style", 8);
    remove_all_html_tags(&mut result);
    result.trim().to_string()
}

fn remove_tag_content(result: &mut String, tag: &str, closing_tag_len: usize) {
    loop {
        let lower = result.to_lowercase();
        let open_tag = format!("<{}", tag);
        if let Some(start) = lower.find(&open_tag) {
            let closing_tag = format!("</{}>", tag);
            if let Some(end) = lower[start..].find(&closing_tag) {
                result.drain(start..start + end + closing_tag_len);
            } else {
                break;
            }
        } else {
            break;
        }
    }
}

fn remove_all_html_tags(result: &mut String) {
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
}

// ============================================================================
// Log Processing
// ============================================================================

pub fn process_log(payload: &str, app: &AppHandle) {
    let now = Local::now().format("%H:%M:%S").to_string();

    if let Ok(json) = serde_json::from_str::<Value>(payload) {
        if let Some(payloads) = json.get("payloads") {
            let empty_vec = vec![];
            let items = payloads.as_array().unwrap_or(&empty_vec);

            for item in items {
                process_item(item, &now, app);
            }
        }
    }
}

fn process_item(item: &Value, timestamp: &str, app: &AppHandle) {
    let log_type = item
        .get("type")
        .and_then(|t| t.as_str())
        .unwrap_or("log")
        .to_lowercase();

    let content = item.get("content").cloned().unwrap_or(Value::Null);

    // Handle special log types
    if handle_special_log_types(&log_type, &content, app) {
        return;
    }

    // Process regular log
    emit_log_entry(item, timestamp, &log_type, &content, app);
}

fn handle_special_log_types(log_type: &str, content: &Value, app: &AppHandle) -> bool {
    match log_type {
        "label" => {
            let label_text = content
                .get("label")
                .and_then(|c| c.as_str())
                .unwrap_or("Unknown");

            let label_event = json!({
                "type": "attach-label",
                "label": label_text,
            });

            let _ = app.emit("attach-label", &label_event);
            true
        }
        "color" => {
            if let Some(color_str) = content.get("color").and_then(|c| c.as_str()) {
                let color_event = json!({
                    "color": color_str,
                });

                let _ = app.emit("attach-color", &color_event);
            }
            true
        }
        _ => false,
    }
}

fn emit_log_entry(
    item: &Value,
    timestamp: &str,
    log_type: &str,
    content: &Value,
    app: &AppHandle,
) {
    let origin = item.get("origin");
    let file = origin
        .and_then(|o| o.get("file"))
        .and_then(|f| f.as_str())
        .unwrap_or("unknown");

    let line = origin
        .and_then(|o| o.get("line_number"))
        .and_then(|l| l.as_u64())
        .unwrap_or(0);

    // Use full file path for editor integration, but display only filename
    let file_display = file.split('/').last().unwrap_or("unknown").to_string();

    let values = extract_values(log_type, content);
    let content_lines = format_content_lines(&values);
    let color = extract_color(item);

    let log_entry = json!({
        "id": Uuid::new_v4().to_string(),
        "timestamp": timestamp,
        "type": log_type.to_lowercase(),
        "location": format!("{}:{}", file_display, line),
        "file_path": file,
        "content": content_lines,
        "color": color,
    });

    let _ = app.emit("log-entry", &log_entry);
}

fn extract_values(log_type: &str, content: &Value) -> Vec<Value> {
    if log_type == "application_log" {
        let mut log_parts = vec![];

        if let Some(val) = content.get("value") {
            log_parts.push(val.clone());
        }

        if let Some(ctx) = content.get("context") {
            if ctx != &Value::Null {
                log_parts.push(ctx.clone());
            }
        }

        if log_parts.is_empty() {
            vec![content.clone()]
        } else {
            log_parts
        }
    } else {
        content
            .get("values")
            .and_then(|v| v.as_array())
            .cloned()
            .unwrap_or_else(|| vec![content.clone()])
    }
}

fn format_content_lines(values: &[Value]) -> Vec<String> {
    let mut content_lines = Vec::new();

    for value in values {
        if value == &Value::Null {
            continue;
        }

        let formatted = match value {
            Value::String(s) => {
                let cleaned = strip_html_and_scripts(s);
                unescape_html(&cleaned)
            }
            Value::Object(_) | Value::Array(_) => {
                let pretty = serde_json::to_string_pretty(value)
                    .unwrap_or_else(|_| value.to_string());
                let cleaned = strip_html_and_scripts(&pretty);
                unescape_html(&cleaned)
            }
            _ => {
                let stringified = value.to_string();
                let cleaned = strip_html_and_scripts(&stringified);
                unescape_html(&cleaned)
            }
        };

        if !formatted.is_empty() {
            content_lines.push(formatted);
        }
    }

    content_lines
}

fn extract_color(item: &Value) -> String {
    item.get("color")
        .and_then(|c| c.as_str())
        .unwrap_or("default")
        .to_lowercase()
}
