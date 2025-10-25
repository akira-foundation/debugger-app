use tokio::net::TcpListener;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use tauri::AppHandle;
use crate::logger::process_log;

pub async fn start_listener(host: &str, port: u16, app: AppHandle) {
    let addr = format!("{}:{}", host, port);
    let listener = TcpListener::bind(&addr)
        .await
        .expect("❌ Failed to bind address");

    println!("🛰️  Listening on {}", addr);

    loop {
        if let Ok((mut socket, _)) = listener.accept().await {
            let app_clone = app.clone();

            tokio::spawn(async move {
                let mut buffer = vec![0u8; 1024 * 1024];

                loop {
                    match socket.read(&mut buffer).await {
                        Ok(0) => break,
                        Ok(size) => {
                            let data = String::from_utf8_lossy(&buffer[..size]).to_string();

                            if data.contains("/_availability_check") {
                                let response = b"HTTP/1.1 404 Not Found\r\n\
                                                        Content-Length: 0\r\n\
                                                        Connection: close\r\n\
                                                        \r\n";

                                let _ = socket.write_all(response).await;
                                break;
                            }

                            if let Some(body_start) = data.find("\r\n\r\n") {
                                let body = data[body_start + 4..].trim();
                                if !body.is_empty() && body != "{}" {
                                    process_log(body, &app_clone);
                                }
                            } else if data.starts_with('{') {
                                process_log(&data, &app_clone);
                            }

                            let response = b"HTTP/1.1 200 OK\r\n\
Content-Length: 0\r\n\
Connection: keep-alive\r\n\
Server: ray\r\n\
\r\n";

                            if let Err(_) = socket.write_all(response).await {
                                break;
                            }
                        }
                        Err(_) => break,
                    }
                }
            });
        }
    }
}
